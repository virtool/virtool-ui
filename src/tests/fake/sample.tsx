import nock from "nock";

export function mockCreateSample() {
    return nock("http://localhost")
        .get("/api/samples")
        .query(true)
        .reply(200, {
            page: 1,
            page_count: 1,
            per_page: 4,
            total_count: 2,
            documents: [
                {
                    id: "foo",
                    name: "sample1",
                    created_at: "2023-11-06T18:31:46.469000Z",
                    host: "",
                    isolate: "",
                    labels: [],
                    library_type: "normal",
                    ready: true,
                    user: { handle: "testUser" },
                    workflows: { aodp: "incompatible", nuvs: "none", pathoscope: "none" },
                },
                {
                    id: "bar",
                    name: "sample2",
                    created_at: "2023-11-06T18:31:46.469000Z",
                    host: "",
                    isolate: "",
                    labels: [],
                    library_type: "srna",
                    ready: true,
                    user: { handle: "testUser" },
                    workflows: { aodp: "incompatible", nuvs: "none", pathoscope: "none" },
                },
            ],
        });
}
