import { screen } from "@testing-library/react";
import { createFakeAccount } from "@tests/fake/account";
import { createFakeHmmSearchResults, mockApiGetHmms } from "@tests/fake/hmm";
import { renderRoute } from "@tests/setup";
import nock from "nock";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

describe("<HmmList />", () => {
	let fakeHMMData;
	let path: string;

	beforeEach(() => {
		fakeHMMData = createFakeHmmSearchResults();
		path = "/hmm";
	});

	afterEach(() => nock.cleanAll());

	it("should render correctly", async () => {
		const scope = mockApiGetHmms(fakeHMMData);
		await renderRoute(path);

		expect(await screen.findByText("HMMs")).toBeInTheDocument();
		expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();

		expect(
			screen.getByText(fakeHMMData.documents[0].cluster),
		).toBeInTheDocument();
		expect(
			screen.getByText(fakeHMMData.documents[0].names[0]),
		).toBeInTheDocument();

		scope.done();
	});

	it("should render correctly when no documents exist", async () => {
		const fakeHMMData = createFakeHmmSearchResults({ documents: [] });
		const scope = mockApiGetHmms(fakeHMMData);
		await renderRoute(path);

		expect(await screen.findByText("HMMs")).toBeInTheDocument();
		expect(screen.getByText("No HMMs found.")).toBeInTheDocument();

		scope.done();
	});

	describe("<HmmInstall />", () => {
		it("should render correctly when installed = false and user has permission to install", async () => {
			const fakeHMMData = createFakeHmmSearchResults({
				documents: [],
				total_count: 0,
			});
			mockApiGetHmms(fakeHMMData);
			mockApiGetHmms(fakeHMMData);
			const account = createFakeAccount({
				administrator_role: "full",
			});
			await renderRoute(path, { account });

			expect(
				await screen.findByText("HMM profiles not installed."),
			).toBeInTheDocument();
			expect(
				screen.getByText(/HMM profiles are required for NuVs analysis/),
			).toBeInTheDocument();

			expect(
				screen.getByRole("button", { name: "Install" }),
			).toBeInTheDocument();
		});

		it("should render correctly when installed = false and user does not have permission to install", async () => {
			const fakeHMMData = createFakeHmmSearchResults({
				documents: [],
				total_count: 0,
			});
			mockApiGetHmms(fakeHMMData);
			mockApiGetHmms(fakeHMMData);
			const account = createFakeAccount({ administrator_role: null });
			await renderRoute(path, { account });

			expect(
				await screen.findByText("Contact an administrator to install HMMs."),
			).toBeInTheDocument();

			expect(
				screen.queryByRole("button", { name: "Install" }),
			).not.toBeInTheDocument();
		});

		it("should render correctly when installed = false, user has permission to install and task !== undefined", async () => {
			const fakeHMMData = createFakeHmmSearchResults({
				documents: [],
				total_count: 0,
				status: {
					task: {
						complete: false,
						id: 21,
						progress: 33,
						step: "decompress",
					},
				},
			});
			mockApiGetHmms(fakeHMMData);
			mockApiGetHmms(fakeHMMData);
			const account = createFakeAccount({
				administrator_role: "full",
			});
			await renderRoute(path, { account });

			expect(await screen.findByText("Installing")).toBeInTheDocument();
			expect(screen.getByText("decompress")).toBeInTheDocument();

			expect(
				screen.queryByText("HMM profiles not installed."),
			).not.toBeInTheDocument();
			expect(
				screen.queryByRole("button", { name: "Install" }),
			).not.toBeInTheDocument();
		});
	});
});
