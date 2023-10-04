import { IndexNested } from "../indexes/types";
import { JobMinimal } from "../jobs/types";
import { ReferenceNested } from "../references/types";
import { SubtractionNested } from "../subtraction/types";
import { UserNested } from "../users/types";
import { SearchResult } from "../utils/types";

export type AnalysisSample = {
    id: string;
};

export type AnalysisMinimal = {
    created_at: string;
    id: string;
    index: IndexNested;
    job?: JobMinimal;
    ready: boolean;
    reference: ReferenceNested;
    sample: AnalysisSample;
    subtractions: Array<SubtractionNested>;
    updated_at: Date;
    user: UserNested;
    workflow: string;
    canModify: boolean;
};

export type AnalysisFile = {
    analysis: string;
    description?: string | null;
    format: string;
    id: number;
    name: string;
    name_on_disk: string;
    size?: number;
    uploaded_at?: Date;
};

export type Analysis = AnalysisMinimal & {
    files: Array<AnalysisFile>;
    results?: { [key: string]: any };
};

export type AnalysisSearchResult = SearchResult & {
    documents: Array<AnalysisMinimal>;
};
