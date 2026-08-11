# Images

Every image this repo ships is a target in the root `Dockerfile`, built
from the repo root. Each is a build stage and a runtime stage, and every
build stage shares `base`, which installs once from every workspace
manifest.

| Target | Image | App |
| --- | --- | --- |
| `dist` | `ghcr.io/virtool/ui` | `apps/web` |
| `jobs-api` | `ghcr.io/virtool/jobs-api` | `apps/jobs-api` |
| `tasks` | `ghcr.io/virtool/tasks` | `apps/tasks` |
| `create-subtraction` | `ghcr.io/virtool/ts-create-subtraction` | `apps/create-subtraction` |
| `pathoscope` | `ghcr.io/virtool/ts-pathoscope` | `apps/workflow-pathoscope` |

`dist` is named that rather than `web` because tooling outside this repo
targets it. There is also a `dev` stage carrying `apps/web` on the
install layer, which ships nothing.

## Every stage is `node:24-bookworm-slim`

The workflow images copy binaries from `ghcr.io/virtool/tools`, which are
built against `python:3.13-bookworm` and dynamically linked against
glibc, so at least one image has to be glibc. One base shared by
everything is worth more than the ~70 MB Alpine would save on the images
that could do without it — and it is what lets `base` be shared rather
than repeated once per libc. Do not add an Alpine stage.

The pathoscope image additionally compiles `packages/pathoscope-core` on
`rust:1.97-bookworm`, in cargo-chef stages that cook the dependencies in
their own layer before `src` is copied. That crate needs `libclang-dev`
at build time, and exactly one binary out of the whole Rust build reaches
the runtime stage.

## The install layer takes manifests by glob

`COPY --parents apps/*/package.json packages/*/package.json ./` preserves
directory structure — a plain `COPY apps/*/package.json apps/` flattens
them all onto one path. That needs the
`# syntax=docker/dockerfile:1-labs` parser directive on the first line of
the file. Adding a workspace must not mean editing a list of `COPY`
lines.

**Package *source*, though, is copied one `COPY` per package.** The glob
above matches manifests only, so it skips `packages/pathoscope-core`,
which is a Rust crate with no `package.json`. A blanket
`COPY packages ./packages` would pull that crate's `src/` and
`Cargo.lock` into the layer and bust its cache on every Rust edit. Add a
line when a new TypeScript package appears.

**App source is copied per build stage, not in `base`.** A change to
`apps/web` then does not invalidate the jobs-api image's cache, and the
install layer stays untouched when an app is added.

## Not every tool in the tools image is a binary

A runtime stage carrying one has to install interpreters as well as
shared libraries. Check a new tool's entry point rather than assuming it
is an ELF, and check it against the tools image rather than against
upstream's current source — the pinned version is what ships:

```
docker run --rm --entrypoint sh ghcr.io/virtool/tools:1.2.0 \
    -c 'head -1 /tools/<tool>/<version>/<tool>'
```

A missing interpreter does not fail the build. It fails the first time
that step runs, in a pod, as `env: '<interpreter>': No such file or
directory` — long after the image passed CI. Which interpreters a given
image needs is that app's business; `apps/workflow-pathoscope/README.md`
carries the worked example.

## Building and publishing

CI builds four of the five in a matrix (`build`), and publishes the same
four from a second matrix (`release-ghcr`) on a release. **Keep the two
lists in step** — an app added to one and not the other either goes
unbuilt on pull requests or unpublished on release, and neither fails
anything.

Adding an app to the repo needs no Dockerfile edit until it needs an
image; adding an *image* needs a stage here and an entry in both
matrices.

**Pathoscope is the fifth, and it is built but deliberately not
published.** It has its own `build-pathoscope` job with no publish
counterpart, because `virtool/workflow-pathoscope` still releases the
pathoscope workflow and a second pipeline shipping it from here would
leave two candidates for what the cluster runs. Restore a publish job
when that repo retires. Note that `release-ghcr` is also what stamps a
real version, so until then `APP_VERSION` is `0.0.0` in every built
pathoscope image, and the `workflow_version` in its cache keys with it.

That job and `pathoscope-test` are the only path-filtered jobs in
`ci.yaml`, and they take a filter each: `pathoscope-test` runs cargo over
the crate and reads no TypeScript, while `build-pathoscope` bundles the
app on the shared `base` and so takes every workspace package.
**Everything the Dockerfile `COPY`s must appear under
`pathoscope-image`** — a missing path skips the build on the pull request
that breaks it and fails on the push to `main`, where nothing gates it.
`packages/**` is the catch-all that keeps that from depending on anyone
remembering.

Build a single image locally by naming its target:

```
docker build --target pathoscope .
```
