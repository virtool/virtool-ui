import NuvsToolbar from "@/analyses/components/NuVs/NuvsToolbar";
import { FormattedNuvsResults } from "@/analyses/types";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof NuvsToolbar> = {
    title: "analyses/NuvsToolbar",
    component: NuvsToolbar,
    tags: ["autodocs"],
};
const fakeFormattedNuvsResults: FormattedNuvsResults = {
    hits: [
        {
            annotatedOrfCount: 3,
            blast: {
                created_at: "2024-07-22T10:00:00Z",
                id: 1,
                interval: 30,
                last_checked_at: "2024-07-22T10:05:00Z",
                ready: true,
                result: {
                    hits: [
                        {
                            accession: "XP_123456",
                            align_len: 150,
                            bit_score: 250.5,
                            evalue: 1e-50,
                            gaps: 2,
                            identity: 95,
                            len: 155,
                            name: "Hypothetical protein ABC1",
                            score: 500,
                            taxid: 9606,
                            title: "Hypothetical protein ABC1 [Homo sapiens]",
                        },
                    ],
                    masking: [
                        { from: 10, to: 50 },
                        { from: 80, to: 100 },
                    ],
                    params: {
                        matrix: "BLOSUM62",
                        expect: 1e-5,
                        filter: "T",
                        gap_open: 11,
                        gap_extend: 1,
                    },
                    program: "blastp",
                    stat: {
                        db_num: 1000000,
                        db_len: 500000000,
                        hsp_len: 150,
                        eff_space: 450000000,
                        kappa: 0.041,
                        lambda: 0.267,
                        entropy: 0.14,
                    },
                    target: {
                        db: "nr",
                    },
                    version: "BLASTP 2.12.0+",
                    rid: "ABCDEFGH",
                    updated_at: "2024-07-22T10:05:00Z",
                },
                rid: "ABCDEFGH",
                updated_at: "2024-07-22T10:05:00Z",
            },
            e: 1e-50,
            families: ["Protein family A", "Protein family B"],
            id: 1,
            index: 0,
            name: ["Novel virus protein 1"],
            orfs: [
                {
                    frame: 1,
                    hits: {
                        pfam: {
                            entries: [
                                {
                                    accession: "PF00123",
                                    name: "Domain X",
                                    score: 50.5,
                                },
                            ],
                        },
                    },
                    index: 0,
                    pos: [1, 300],
                    pro: "MSKGEELFTGVVPILVELDGDVNGHKFSVSGEGEGDATYGKLTLKFICTTGKLPVPWPTLVTTFSYGVQCFSRYPDHMKQHDFFKSAMPEGYVQERTIFFKDDGNYKTRAEVKFEGDTLVNRIELKGIDFKEDGNILGHKLEYNYNSHNVYIMADKQKNGIKVNFKIRHNIEDGSVQLADHYQQNTPIGDGPVLLPDNHYLSTQSALSKDPNEKRDHMVLLEFVTAAGITHGMDELYK",
                    strand: 1,
                },
            ],
            sequence:
                "ATGAGTAAAGGAGAAGAACTTTTCACTGGAGTTGTCCCAATTCTTGTTGAATTAGATGGTGATGTTAATGGGCACAAATTTTCTGTCAGTGGAGAGGGTGAAGGTGATGCAACATACGGAAAACTTACCCTTAAATTTATTTGCACTACTGGAAAACTACCTGTTCCATGGCCAACACTTGTCACTACTTTCTCTTATGGTGTTCAATGCTTTTCAAGATACCCAGATCATATGAAACAGCATGACTTTTTCAAGAGTGCCATGCCCGAAGGTTATGTACAGGAAAGAACTATATTTTTCAAAGATGACGGGAACTACAAGACACGTGCTGAAGTCAAGTTTGAAGGTGATACCCTTGTTAATAGAATCGAGTTAAAAGGTATTGATTTTAAAGAAGATGGAAACATTCTTGGACACAAATTGGAATACAACTATAACTCACACAATGTATACATCATGGCAGACAAACAAAAGAATGGAATCAAAGTTAACTTCAAAATTAGACACAACATTGAAGATGGAAGCGTTCAACTAGCAGACCATTATCAACAAAATACTCCAATTGGCGATGGCCCTGTCCTTTTACCAGACAACCATTACCTGTCCACACAATCTGCCCTTTCGAAAGATCCCAACGAAAAGAGAGACCACATGGTCCTTCTTGAGTTTGTAACAGCTGCTGGGATTACACATGGCATGGATGAACTATACAAA",
        },
        {
            annotatedOrfCount: 2,
            blast: {
                created_at: "2024-07-22T11:00:00Z",
                id: 2,
                interval: 30,
                last_checked_at: "2024-07-22T11:05:00Z",
                ready: true,
                result: {
                    hits: [
                        {
                            accession: "YP_789012",
                            align_len: 100,
                            bit_score: 180.5,
                            evalue: 1e-30,
                            gaps: 1,
                            identity: 90,
                            len: 102,
                            name: "Uncharacterized protein XYZ2",
                            score: 350,
                            taxid: 10090,
                            title: "Uncharacterized protein XYZ2 [Mus musculus]",
                        },
                    ],
                    masking: [
                        { from: 5, to: 25 },
                        { from: 60, to: 80 },
                    ],
                    params: {
                        matrix: "BLOSUM62",
                        expect: 1e-5,
                        filter: "T",
                        gap_open: 11,
                        gap_extend: 1,
                    },
                    program: "blastp",
                    stat: {
                        db_num: 1000000,
                        db_len: 500000000,
                        hsp_len: 100,
                        eff_space: 450000000,
                        kappa: 0.041,
                        lambda: 0.267,
                        entropy: 0.14,
                    },
                    target: {
                        db: "nr",
                    },
                    version: "BLASTP 2.12.0+",
                    rid: "IJKLMNOP",
                    updated_at: "2024-07-22T11:05:00Z",
                },
                rid: "IJKLMNOP",
                updated_at: "2024-07-22T11:05:00Z",
            },
            e: 1e-30,
            families: ["Protein family C"],
            id: 2,
            index: 1,
            name: ["Novel virus protein 2"],
            orfs: [
                {
                    frame: 2,
                    hits: {
                        pfam: {
                            entries: [
                                {
                                    accession: "PF00456",
                                    name: "Domain Y",
                                    score: 40.2,
                                },
                            ],
                        },
                    },
                    index: 0,
                    pos: [1, 200],
                    pro: "MPAQLISGLKLSCKALKLICDTEELLEILAQGLIYDSNHNGIKKYITKVYEVQPLNLLDKLRLTHAIQLQRFDTEVAELVQKLEQKAAIVNPIDLPELPQKDLQSRLKQLESQLS",
                    strand: 1,
                },
            ],
            sequence:
                "ATGCCTGCACAGCTGATCAGCGGTCTGAAGCTGTCCTGCAAGGCCCTGAAGCTGATCTGCGACACGGAGGAGCTGCTGGAGATCCTGGCCCAGGGCCTGATCTACGACAGCAACCACAACGGCATCAAGAAGTACATCACCAAGGTGTACGAGGTGCAGCCCCTGAACCTGCTGGACAAGCTGCGCCTGACCCACGCCATCCAGCTGCAGCGCTTCGACACCGAGGTGGCCGAGCTGGTGCAGAAGCTGGAGCAGAAGGCCGCCATCGTGAACCCCATCGACCTGCCCGAGCTGCCCCAGAAGGACCTGCAGAGCCGCCTGAAGCAGCTGGAGAGCCAGCTGAGC",
        },
    ],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        analysisId: "611e1b1b",
        results: fakeFormattedNuvsResults,
        sampleName: "Sample A",
    },
};
