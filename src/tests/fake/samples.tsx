import nock from "nock";

/**
 * Creates a mocked API call for creating a sample
 *
 * @returns {nock.Scope} nock scope for the mocked API call
 */
export function mockApiCreateSample(name, isolate, host, locale, subtractions, labels, files, libraryType) {
    return nock("http://localhost")
        .post("/api/samples", {
            name: name,
            isolate: isolate,
            host: host,
            locale: locale,
            subtractions: subtractions,
            files: files,
            library_type: libraryType.toLowerCase(),
            labels: labels,
            group: null,
        })
        .reply(201, {
            name: name,
            isolate: isolate,
            host: host,
            locale: locale,
            subtractions: subtractions,
            files: files,
            library_type: libraryType.toLowerCase(),
            labels: labels,
            group: null,
        });
}
