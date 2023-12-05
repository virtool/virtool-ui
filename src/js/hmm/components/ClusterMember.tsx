import React from "react";

import { ExternalLink } from "../../base";

type ClusterMemberProps = {
    /** The index of the cluster member */
    index: number,
    /**  */
    accession: string,
    /** */
    name: string,
    /** The organism to which the cluster member belongs */
    organism: string,
};

/**
 * A condensed cluster member for use in a list of cluster members
 */
export function ClusterMember({ index, accession, name, organism }: ClusterMemberProps) {
    return (
        <tr key={index}>
            <td>
                <ExternalLink href={`http://www.ncbi.nlm.nih.gov/protein/${accession}`}>{accession}</ExternalLink>
            </td>
            <td>{name}</td>
            <td>{organism}</td>
        </tr>
    );
}
