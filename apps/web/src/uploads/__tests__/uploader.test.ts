import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { postUpload } from "../uploader";

// A minimal, controllable stand-in for XMLHttpRequest. jsdom's real one would
// try to hit the network (which the test setup blocks), so `postUpload`'s
// event-to-promise translation is exercised by driving these emit* helpers.
class MockXhr {
	status = 0;
	responseText = "";
	method = "";
	url = "";
	body: unknown;
	upload = new EventTarget();
	private events = new EventTarget();

	open(method: string, url: string): void {
		this.method = method;
		this.url = url;
	}

	send(body: unknown): void {
		this.body = body;
	}

	addEventListener(type: string, listener: EventListener): void {
		this.events.addEventListener(type, listener);
	}

	emitLoad(status: number, responseText: string): void {
		this.status = status;
		this.responseText = responseText;
		this.events.dispatchEvent(new Event("load"));
	}

	emitError(): void {
		this.events.dispatchEvent(new Event("error"));
	}

	emitAbort(): void {
		this.events.dispatchEvent(new Event("abort"));
	}

	emitProgress(loaded: number, total: number): void {
		this.upload.dispatchEvent(
			new ProgressEvent("progress", { lengthComputable: true, loaded, total }),
		);
	}
}

let xhr: MockXhr;

beforeEach(() => {
	vi.stubGlobal("XMLHttpRequest", function XMLHttpRequestStub() {
		xhr = new MockXhr();
		return xhr;
	});
});

afterEach(() => {
	vi.unstubAllGlobals();
});

function file(): File {
	return new File(["content"], "reads.fq.gz");
}

describe("postUpload", () => {
	it("posts to /uploads with the name and type in the query string", () => {
		postUpload(file(), "reads file.fq.gz", "reads");

		expect(xhr.method).toBe("POST");
		expect(xhr.url).toBe("/uploads?name=reads%20file.fq.gz&type=reads");
		expect(xhr.body).toBeInstanceOf(File);
	});

	it("resolves with the parsed upload on a 2xx response", async () => {
		const promise = postUpload(file(), "reads.fq.gz", "reads");
		xhr.emitLoad(201, JSON.stringify({ id: 42, name: "reads.fq.gz" }));

		await expect(promise).resolves.toMatchObject({
			id: 42,
			name: "reads.fq.gz",
		});
	});

	it("rejects with the server's message on a non-2xx JSON response", async () => {
		const promise = postUpload(file(), "reads.fq.gz", "reads");
		xhr.emitLoad(
			422,
			JSON.stringify({ message: "A valid `name` is required." }),
		);

		await expect(promise).rejects.toThrow("A valid `name` is required.");
	});

	it("falls back to the status code when the error body is not JSON", async () => {
		const promise = postUpload(file(), "reads.fq.gz", "reads");
		xhr.emitLoad(403, "Forbidden");

		await expect(promise).rejects.toThrow("Upload failed with status 403.");
	});

	it("rejects when the request errors", async () => {
		const promise = postUpload(file(), "reads.fq.gz", "reads");
		xhr.emitError();

		await expect(promise).rejects.toThrow("Upload failed.");
	});

	it("rejects when the request is aborted", async () => {
		const promise = postUpload(file(), "reads.fq.gz", "reads");
		xhr.emitAbort();

		await expect(promise).rejects.toThrow("Upload aborted.");
	});

	it("reports progress as loaded, total, and a rounded percent", async () => {
		const onProgress = vi.fn();

		const promise = postUpload(file(), "reads.fq.gz", "reads", onProgress);
		xhr.emitProgress(3, 10);
		xhr.emitProgress(7, 10);
		xhr.emitLoad(201, JSON.stringify({ id: 1 }));
		await promise;

		expect(onProgress).toHaveBeenNthCalledWith(1, {
			loaded: 3,
			total: 10,
			percent: 30,
		});
		expect(onProgress).toHaveBeenNthCalledWith(2, {
			loaded: 7,
			total: 10,
			percent: 70,
		});
	});
});
