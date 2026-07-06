/**
 * Derive a user-friendly FASTA filename from a subtraction name
 * (e.g. "Arabidopsis thaliana" -> "arabidopsis_thaliana.fa.gz").
 */
export function getSubtractionFastaName(name: string) {
	return `${name.toLowerCase().replace(/\s+/g, "_")}.fa.gz`;
}
