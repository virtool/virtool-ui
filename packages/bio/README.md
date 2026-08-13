# `@virtool/bio`

Sequence utilities (complement, translation, ORF finding, FASTA/FASTQ) and the
pure text parsers the ported workflows need: FastQC `fastqc_data.txt`
(`@virtool/bio/fastqc`) and `hmmscan --tblout` (`@virtool/bio/hmmer`).

Nothing here touches the filesystem, the network, or the database. Callers read
the bytes and hand over text — locating a FastQC file, walking a results
directory, or joining an HMM hit to its annotation belongs to the workflow that
does the IO.

**`parseFastqcData` has no production caller and is kept deliberately.**
`packages/quality-core` replaced FastQC in `apps/create-sample`, so nothing
runs the tool in a pod any more. The parser is what turned a real FastQC
report into the expected blob each of that crate's goldens is, and it is what
any future golden would have to go through to be comparable with them — a
parser that drifted would quietly move the expectations the crate is held to.
It is tested here against genuine 0.11.9 output in
`src/fixtures/paired_{1,2}.fastqc_data.txt`: real FastQC reports over the
first 20,000 reads of `reads/paired_large_{1,2}.fastq.gz` from
`ghcr.io/virtool/examples`. They are frozen — if one has to change it comes
from FastQC, never from `parseFastqcData`.

## Byte-identity with Python is the governing constraint

Virtool runs in certified lab settings. A ported parser that produces
*equivalent but differently rounded* output is a failure, not a nit. Python
still runs these workflows in production, and analysis documents written by
either implementation sit in the same table and are rendered by the same UI.

So the rule for everything in this package is: **match Python's output exactly,
including its bugs.** `roundHalfEven` exists because `Math.round` is not
Python's `round`; `parseHmmerTblout` reads the best-domain score and bias from
each other's columns; `findOrfs` emits a negative coordinate. None of those are
defects to be tidied up.

Do not "fix" a quirk in this package alone. A fix means a coordinated change to
Python, to the stored documents, and to the UI — and until all three move, a
correction here is a silent disagreement with every record written so far.

Where a divergence is deliberate it is commented at the site and pinned by a
test. There is exactly one today: FastQC's all-`NaN` composition row, which this
package maps to zeros. `resolveUnparseableRow` in `fastqc.ts` explains why that
is not a byte-identity violation.

## Expected values are the reference implementation's output

Tests here write their expectations out rather than capturing them from a
fixture, so a diff shows the number that changed. Those numbers are what Python
returns and what is already stored in analysis documents.

Treat a failure as a finding, not as a test to re-baseline.
