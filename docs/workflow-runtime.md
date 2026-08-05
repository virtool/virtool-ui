# The workflow runtime

`@virtool/workflow` (`packages/workflow`) is the runtime a workflow executor
runs on: the step model, the run loop, the work directory, the subprocess
runner, and the seam that builds a run's context. It is the port of
Python's `virtool/workflow/` — `workflow.py`, `decorators.py`,
`runtime/run.py`, `runtime/path.py` and `runtime/run_subprocess.py` — minus
the three mechanisms this side deliberately does not have: dependency
injection, teardown, and lifecycle hooks.

It knows nothing about HTTP, object storage, or job claiming. `runWorkflow`
returns an outcome and never touches the network, `process.exit`, or a
signal handler; the job lifecycle loop owns all of that.

## The step model

A workflow is an **explicit ordered array** of steps handed to
`defineWorkflow`, which validates it and returns a `Workflow`.

```ts
export const workflow = defineWorkflow<Data, State>({
	name: "pathoscope",
	buildContext,
	createState: () => ({ hits: [] }),
	steps: [
		{
			id: "map_default_isolates",
			description: "Map reads to the default isolates.",
			run: async (context) => { ... },
		},
	],
	result: (state) => ({ hits: state.hits }),
});
```

There is no module scanning. Python's `collect()` reads a module's
`__dict__` and picks up decorated functions in definition order; bundling
and tree-shaking make that order an unsafe thing to depend on.

**A step's `id` is authored in `snake_case` and must match the Python
function name it was ported from.** It is the identifier the control plane
stores — `POST /jobs/{jobId}/steps/{stepId}/start` takes it, and Python
sends `step.function.__name__`. Never derive it by slugifying a display
name: a ported workflow whose step ids drift changes the shape of a job's
step list at cutover.

`defineWorkflow` throws `WorkflowDefinitionError`, naming the workflow and
the offending step, when the workflow declares no steps, or a step has an
id that is not `snake_case`, an id another step already used, or an empty
description.

A step with no explicit `name` gets the title-cased id, the same way
Python's `str.title()` produces one: `map_default_isolates` becomes
`Map Default Isolates`, so a ported step keeps the label the UI already
shows for it.

## The context is eager and plain, and there is no dependency injection

Python resolves fixtures by introspecting a step function's **parameter
names** against a `ContextVar` registry, with async generators supplying
teardown through an `AsyncExitStack`. This side has none of that. A run's
context is an ordinary object, built once before the first step by a
per-workflow `buildContext`, and handed to every step:

```ts
type WorkflowContext<TData, TState> = {
	readonly data: TData;   // eagerly built, serializable
	state: TState;          // mutable cross-step scratch
	readonly job: RunJob;
	readonly workPath: string;
	readonly proc: number;
	readonly mem: number;
	readonly logger: Logger;
	readonly signal: AbortSignal;
	readonly runSubprocess: RunSubprocess;
};
```

`buildContext` is the **only** producer of `data`, and `data` is
constrained to stay serializable — no class instances, no closures, no live
handles. That constraint is what lets the deferred end-to-end test bed
express a whole run as a directory of files plus a JSON blob and hand it
straight in.

`createWorkflowContext` is the seam that enforces it. It calls the
workflow's `buildContext`, runs `assertSerializableData` on what comes
back, and assembles the context. A caller that built the context itself
would be free to skip the assertion, and the failure it catches is
otherwise invisible until that bed exists.

**Lazy or memoized accessors were rejected.** They turn the data half into
a set of closures needing a hydration step, which is the one thing the
serializable constraint exists to prevent. Cross-workflow laziness is
handled by per-workflow construction instead — NuVs' builder fetches HMMs
and create-sample's does not — not by the injection mechanism. Eager also
fails fast: a storage read that fails surfaces before step 1 rather than
forty minutes in.

`assertSerializableData` runs a `JSON.parse(JSON.stringify(x))` round trip
and reports **every path** at which the value came back changed
(`job.createdAt: Date became "1970-01-01T00:00:00.000Z"`). Hunting for the
one `Date` in a nested domain object is exactly the work this check saves. The
check is a runtime assertion only; a conditional type mapping functions and
class instances to `never` was not added, because a `TData` with any
optional field would then have to fight the type system to satisfy it.

`state` is the mutable scratch that replaces Python's `results` dict
fixture, and is **not** serializable-constrained. It holds whatever a
workflow needs between steps.

Everything on `BuildContextInput` is spread onto the context, so a member
added there is a member a step sees. `runSubprocess` is one of those, and
`storage` and `client` land the same way with their own issues. Only `data`
is serializable-constrained; the live handles are so by design.

## There is no teardown

The container is ephemeral and process exit reclaims everything. Python's
`AsyncExitStack` is not ported, and there is no `dispose` or
`Symbol.asyncDispose` layer. `createWorkPath` empties and recreates the
work directory at the start of a run and nothing removes it at the end.

Because that function unconditionally deletes its target and the target
comes from an environment variable, it refuses a blank path and one that
resolves somewhere with no parent directory. Python has no such guard.

## There are no lifecycle hooks

Python exposes ten module-level hooks — `on_workflow_start`, `on_step_start`,
`on_step_finish`, `on_result`, `on_success`, `on_cancelled`, `on_error`,
`on_terminated`, `on_failure`, `on_finish` — with a registry, concurrent
`asyncio.gather` dispatch, and a `cleanup_builtin_status_hooks()` call to stop
one run's callbacks leaking into the next. **None of it is ported.**

A survey of every production registration across `virtool` and the four
`workflow-*` repos found the whole mechanism carrying three callbacks:

| Hook | Registrations |
| --- | --- |
| `on_failure` | 4 — one per workflow, each deleting the resource it was building |
| `on_step_start` | 1 — runtime-internal, reports the step to the jobs API |
| `on_success` | 1 — runtime-internal, `POST /jobs/{id}/finish` |
| the other seven | **0** |

`on_result` is worth calling out: it has never had a registration. A workflow
uploads its result with an explicit call inside its final step, so the hook
fires into nothing.

The three real callbacks resolve without a registry:

- **`on_failure`'s deletions are gone by decision.** A failed run now leaves
  its half-built sample, subtraction, or analysis for the user to delete. The
  cleanup was best-effort anyway — it ran in the workflow process, so an OOM
  kill or a lost node skipped it and stranded the resource regardless.
- **`on_success` is redundant.** `runWorkflow` returns `RunOutcome`, so the
  caller marks the job finished on `"succeeded"` itself.
- **`on_step_start` is the only genuine one**, because it fires mid-run rather
  than at the end. It survives as `onStepStart` on `RunWorkflowOptions`: one
  optional function, no registry, no dispatch semantics.

A rejection from `onStepStart` fails the run. The control plane not knowing
which step is executing is not a thing to continue past.

Do not reintroduce a hook registry to give a workflow a place to put teardown.
That is the same argument the no-teardown rule already answers.

## How a run ends

`runWorkflow` reports every outcome by returning a `RunOutcome`, never by
throwing:

| Outcome | `state` | `error` |
| --- | --- | --- |
| Every step completed | `succeeded` | absent |
| A step threw | `failed` | what it threw |
| `onStepStart` rejected | `failed` | what it threw |
| Aborted, `isCancelled()` | `cancelled` | absent |
| Aborted, not cancelled | `failed` | absent |

An abort with neither `isCancelled()` nor `isTerminated()` set takes the
termination path and logs `workflow terminated without sigterm`. Nothing
should be able to produce it, so the run says so rather than reporting a
plain termination.

`state` is tracked separately from `error` because a step is free to throw a
falsy value; keying the outcome off the captured error alone would read
`throw undefined` as a clean run.

## Cancellation is cooperative, and this is the one real divergence

In Python, `CancelledError` unwinds the step at its next `await`. Aborting
an `AbortSignal` in Node interrupts **nothing** — the step keeps running.

So `runWorkflow` races the in-flight step against the signal. On abort it
stops awaiting the step, logs that it was abandoned, and proceeds down the
cancellation path without waiting. That is safe because the process exits
immediately afterwards and the subprocess runner kills its process tree on
the same signal.

The abandoned step is left with a `catch` attached. Its eventual rejection
would otherwise be an unhandled rejection that takes the process down
before the caller has finished reporting the run — which is the whole point
of not waiting for it.

**An abort outranks whatever the step threw.** A step that forwards
`context.signal` to an abort-aware API rejects from that API's own abort
listener, and that listener was registered inside `step.run` — before the
run loop's — so it fires first and its rejection can win the race. Reading
that as a step failure would report a cancelled job as `error`/`failure`
and lose the cancellation entirely, so a rejection arriving while
`signal.aborted` is set takes the abort path instead.

`createRunSignals` replaces Python's `Events`. Both `cancel()` (a ping
response reported `cancelled: true`) and `terminate()` (SIGTERM) abort the
same signal; the flags are what tells the two apart afterwards.

## The subprocess runner

Every bioinformatics tool a workflow runs — bowtie2, samtools, cd-hit-est,
SPAdes, HMMER, `pathoscope-core` — goes through `context.runSubprocess`, the
port of Python's `runtime/run_subprocess.py`. It is built once per run by
`createRunSubprocess({ signal, logger })` and handed in on
`BuildContextInput`, so the run's `AbortSignal` is already bound and a step
cannot forget to forward cancellation to a forty-minute alignment.

```ts
await context.runSubprocess({
	command: ["bowtie2-build", fastaPath, indexPath],
	cwd: context.workPath,
	stderr: async (line) => { ... },
});
```

`RunSubprocess` is a plain function type, not a class, so a step test hands
in a `vi.fn()` and asserts on the commands it was asked to run.
`createFakeRunSubprocess` in `testFixtures` is the recording stand-in.

The command is always an array of arguments and `shell: false`. There is no
shell string form and no `cwd`-relative executable lookup beyond `PATH`.
`env` is **merged** into the process' own, never a replacement — a tool that
loses `PATH` cannot find the interpreter its own wrapper script is written
in, and `bowtie2` is one of those wrappers.

### stdout is not piped unless something reads it

Without a `stdout` handler the child's stdout is opened on `/dev/null`.
An unread pipe is a buffer that fills, and a tool told to write a SAM
stream to stdout fills it fast; piping output nobody consumes is how a
workflow pod dies of a tool doing exactly what it was asked to.

stderr is always piped, because every line of it is logged as
`logger.info({ line }, "stderr")` and the last twenty are kept to attach to
a failure.

Handlers are awaited before the next line is read, so a slow handler applies
backpressure to the tool rather than queueing its output in this process.

### Lines are split with a byte ceiling

`node:readline` would do the splitting and has no length ceiling at all: a
tool that writes a gigabyte with no newline in it grows the heap until the
process dies, and the failure names the workflow rather than the tool. So
the runner splits lines itself and refuses to buffer one past
`maxLineBytes`, which defaults to **128 MiB** — the same `limit` Python
passes to `asyncio.create_subprocess_exec`. Overrunning it throws
`SubprocessLineLimitError` and kills the process tree, because the reader
giving up is otherwise a subprocess blocked forever on its next write.

Splitting happens on the newline **byte** before any decoding, which is safe
because every byte of a multi-byte UTF-8 sequence has its high bit set.
Each line is then decoded on its own with invalid sequences replaced by
U+FFFD; Python uses `backslashreplace`, but nothing reads these lines back
as bytes. Only the newline is stripped — Python's `rstrip()` takes every
trailing whitespace character with it, which would reflow the aligned
columns tools write to stderr.

### Descendants are killed, which execa cannot do on its own

The runner spawns with **`detached: true`** and signals **`-pid`**.

execa has no option for this. `subprocess.kill()` and `cancelSignal` signal
the direct child only, and for `bowtie2` and `bowtie2-build` that child is a
perl script whose real binary would go on running; SPAdes has the same shape
in python. `detached` calls `setsid`, making the child a process-group
leader, and a signal sent to the negated pid reaches the whole group.

Cancellation therefore does not use execa's `cancelSignal`. Aborting the
run's signal sends **SIGTERM** to the group and **SIGKILL** after
`forceKillAfterDelay` (5s). `detached` also turns off execa's own
cleanup-on-exit, so the runner registers a `process.once("exit")` group kill
in its place — without it a crash in the parent strands a running aligner.

`ESRCH` from a kill that lands after the subprocess has already exited, and
`EPIPE` from the same race seen from the other end, are logged at `debug`
and never surfaced. A cancellation racing an exit is ordinary.

### How a subprocess ends

The runner awaits **both** the process promise and the line readers before
deciding anything. A subprocess can exit before its stdio has drained, and
deciding on the process promise alone loses the tail of stderr that says why
it failed.

| Outcome | Result |
| --- | --- |
| Exit 0 | resolves, `cancelled: false` |
| Killed by the run's cancellation (SIGTERM/SIGKILL, run signal aborted) | resolves, `cancelled: true` |
| Any other non-zero exit, **15 included** | throws `SubprocessFailedError` |
| Never started (`ENOENT`, `EACCES`) | throws `SubprocessSpawnError` |
| A line past `maxLineBytes` | throws `SubprocessLineLimitError` |

**Exit code 15 is a failure here and a success in Python.** Python treats
`15` and `-15` as expected, on the reasoning that the run was already
failing for some other reason and the tool was terminated as a consequence.
That reasoning does not survive a tool choosing 15 as an ordinary error
code, and the cancellation row above is what it was really reaching for.

`SubprocessFailedError` carries `command`, `exitCode`, `signal` and
`stderrTail`, and its message puts the tail under a `stderr:` heading:

```
Subprocess failed with exit code 1: bowtie2-build ref.fa index
stderr:
Error: Reference file does not seem to be a FASTA file
```

All three extend `WorkflowError`, so a workflow app can tell a runtime
failure from anything else that went wrong inside a step.

## Configuration

`parseWorkflowRunConfig(env)` parses the environment into a
`WorkflowRunConfig`. Every key is `VT_`-prefixed and every key also reads
from a `<KEY>_FILE` variant, resolved by `resolveFileBacked` from
`@virtool/contracts/env` — the same helper every other service uses, so the
precedence rule cannot drift. The file wins over a plain variable of the
same name, an unreadable path throws at startup, and an empty file is an
unset value.

| Key | Default |
| --- | --- |
| `VT_JOBS_API_URL` | **none — required** |
| `VT_WORK_PATH` | **none — required** |
| `VT_WORKFLOW` | none — required, parsed as `JobWorkflow` |
| `VT_MEM` | `4` |
| `VT_PROC` | `2` |
| `VT_TIMEOUT` | `1000` |
| `VT_IMAGE` | `"unknown"` |
| `VT_SENTRY_DSN` | unset |

Two of those are deliberate departures from Python's defaults. Python
defaults the jobs API address to `https://localhost:9950`, which in a pod
silently polls nothing and reads as an idle runner rather than a
misconfigured one; and it defaults the work path to the relative path
`temp`, which `createWorkPath` would then delete. Both are required here.

**`VT_JOBS_API_URL` is also a rename.** Python calls it
`VT_JOBS_API_CONNECTION_STRING`, but it is a base URL that a path is
appended to (`client.py` does `f"{connection_string}{path}"`), not a DSN,
and `VT_POSTGRES_URL` already settles this repo's convention in the harder
case — that one *is* a credential-bearing connection string and is still
named `_URL`. A workflow pod's manifest therefore renames the variable in
the same change that switches it to a TypeScript image. Getting that wrong
fails loudly at startup rather than quietly, which is the practical reason
this key keeps no default.

An empty string is treated as unset throughout, because deployment tooling
routinely injects one for a value it has nothing to put in — and coercing
`""` would make `VT_MEM` zero rather than four.

`parseWorkflowRunConfig` is a function the app entrypoint calls; the parsed
config is then passed on as an argument. **Nothing in the package reads
`process.env` at import time.** That is the same rule that got the old
`@virtool/config` package deleted.

## Errors and logging

`WorkflowError` is the base for everything this package throws, with
`WorkflowDefinitionError` for a malformed definition. The subprocess runner
and the control-plane client extend `WorkflowError` rather than `Error`, so
a workflow app can tell a runtime failure from anything that went wrong
inside a step.

Logging goes through `@virtool/logger`. `console.*` is banned repo-wide.
Structured fields go first and the message second
(`logger.info({ stepId }, "running workflow step")`) — never interpolate a
value into the message, which defeats the redaction list and makes records
ungreppable.

## What is not ported

- `runtime/discover.py`, the importlib file loading. TypeScript workflow
  apps are compiled entrypoints with an explicit step array.
- The `pyfixtures` dependency and everything built on it.
- `AsyncExitStack` and every teardown path.
- `hooks.py` and `runtime/hook.py` — the whole lifecycle hook mechanism,
  including `cleanup_builtin_status_hooks()` and `Hook`'s `until=` / `once=`
  options.
