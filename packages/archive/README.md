# @virtool/archive

Tar and gzip, for anything in the monorepo that reads or writes an archive.

Framework-agnostic and dependency-light: `tar-stream` plus `node:zlib`, no
database, no object storage, no logger. It is imported by `@virtool/workflow`
(cache archives), by the workflow apps (gzipping reads and assemblies), and by
`@virtool/tasks` (the HMM release archive).

## Exports

| Subpath | Exports |
| --- | --- |
| `@virtool/archive` | everything below |
| `@virtool/archive/tar` | `extractTarToDir`, `extractTarMembers`, `writePathAsTar` |
| `@virtool/archive/compression` | `compressFile`, `decompressFile`, `isGzipped` |
| `@virtool/archive/errors` | `ArchiveError`, `TarArchiveError`, `TarMemberMissingError`, `TarTargetExistsError` |

Prefer a subpath. `@virtool/workflow` re-exports none of these any more —
consumers import them from here directly, so the definition site stays
greppable.

## Which tar function

`extractTarToDir` restores a whole tree and enforces the **cache archive
contract**: exactly one top-level entry, staged and renamed so a failure leaves
nothing behind, and the target must be free. It is what Python's `tarfile` on
the other side of the cache boundary expects, and `writePathAsTar` is its
inverse. Both are uncompressed-only, matching Python's `mode="w"`.

`extractTarMembers` pulls **named members** out of an archive whose other
contents do not matter, to destinations the caller chooses. It takes `gzip:
true` for a `.tar.gz`. Use it when you want two files out of a release archive,
not when you want a directory back.

## Two rules the extractors carry so callers cannot get them wrong

**Every entry is drained.** `tar-stream`'s parser will not advance past an entry
that is neither piped nor `resume()`d — it stalls, silently and forever, with no
error and no exit. Under a task lease that means a process sitting on a half-read
archive while its supervisor faithfully renews the claim. Both extraction loops
resume every entry they skip, and both have a regression test that asserts
completion under a timeout rather than asserting an error.

**Every entry is validated, whether or not it was wanted.** Absolute paths, `..`
segments, and anything that is not a plain file or directory fail the
extraction. Links and device nodes are refused outright, where Python's
`filter="data"` would admit a symlink that stays inside the destination.
`extractTarMembers` checks members it is going to skip for the same reason
Python's `safely_extract_tgz` walks every member before extracting any: a guard
that only looks at what the caller asked for never looks at the payload.

## Divergences from Python

Two, both in `extractTarToDir` and both deliberate. Python validates the whole
archive with `getmembers()` before extracting a byte, which is cheap on a
seekable file; a stream parser cannot seek, so this stages into a sibling
directory and renames on success rather than reading a multi-gigabyte archive
twice. And the link and device-node rejection above is stricter than
`filter="data"`.

`compressFile` drops Python's `pigz` branch. It exists for parallelism, and
checksums are taken over decompressed content, so the gzip bytes need not match.

## Testing

`vitest run` from this directory, or `pnpm test` from the root. No containers
and no fixtures checked into the repo — archives are built in-test with
`tar-stream`'s `pack`.
