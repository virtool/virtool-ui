/** A machinelearning model release */
export type MLModelRelease = {
    id: number;
    /** iso formatted date of when the model was loaded into virtool*/
    created_at: string;
    /** The URL to download the model */
    download_url: string;
    /** The URL to the release HTML page for the release on GitHub. */
    github_url: string;
    name: string;
    /** iso formatted date of when the model was published to GitHub */
    published_at: string;
    ready: boolean;
    /** The size of the model in bytes */
    size: number;
};

/** A reduced MLModel.tsx for rendering in a list view*/
export type MLModelMinimal = {
    id: number;
    /** iso formatted date */
    created_at: string;
    description: string;
    latest_release: MLModelRelease | null;
    name: string;
    /** The number of releases for the model */
    release_count: number;
};

/** A machine learning model*/
export type MlModel = MLModelMinimal & {
    releases: MLModelRelease[];
};

/** Machine Learning model search results from the API */
export type MLModelSearchResult = {
    items: MLModelMinimal[];
    /** iso formatted datestring of when the models were last synced with virtool.ca */
    last_synced_at: string;
};
