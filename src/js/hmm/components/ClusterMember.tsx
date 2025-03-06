import React from "react";
import { ExternalLink } from "@base/index";

type ClusterMemberProps = {
    /** The index of the cluster member */
    index: number;
    /** The accession number */
    accession: string;
    /** The name of the accession */
    name: string;
    /** The organism associated with the accession */
    organism: string;
};

/**
 * A condensed cluster member for use in a list of cluster members
 */
export function ClusterMember({
    index,
    accession,
    name,
    organism,
}: ClusterMemberProps) {
    return (
        <tr key={index}>
            <td>
                <ExternalLink
                    href={`http://www.ncbi.nlm.nih.gov/protein/${accession}`}
                >
                    {accession}
                </ExternalLink>
            </td>
            <td>{name}</td>
            <td>{organism}</td>
        </tr>
    );
}
