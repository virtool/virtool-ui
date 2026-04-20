import {
	createMemoryHistory,
	createRootRoute,
	createRoute,
	createRouter,
	Outlet,
	RouterProvider,
} from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
	useDialogParam,
	useListSearchParam,
	useNaiveUrlSearchParam,
	usePageParam,
	useUrlSearchParam,
} from "../hooks.tanstack";

async function renderWithTanStackRouter(
	ui: React.ReactElement,
	initialPath: string,
) {
	const rootRoute = createRootRoute({ component: () => <Outlet /> });
	const catchAllRoute = createRoute({
		getParentRoute: () => rootRoute,
		path: "$",
		component: () => ui,
	});
	rootRoute.addChildren([catchAllRoute]);

	// @ts-expect-error createRouter requires strictNullChecks which is not enabled project-wide
	const router = createRouter({
		routeTree: rootRoute,
		history: createMemoryHistory({ initialEntries: [initialPath] }),
		defaultPendingMinMs: 0,
	});

	await router.load();
	return render(<RouterProvider router={router} />);
}

describe("useNaiveUrlSearchParam", () => {
	function TestHarness({
		paramKey,
		defaultValue,
	}: {
		paramKey: string;
		defaultValue?: string;
	}) {
		const { value, setValue, unsetValue } = useNaiveUrlSearchParam(
			paramKey,
			defaultValue,
		);
		return (
			<div>
				<span data-testid="value">{value ?? "null"}</span>
				<button onClick={() => setValue("updated")} type="button">
					set
				</button>
				<button onClick={() => unsetValue()} type="button">
					unset
				</button>
			</div>
		);
	}

	it("reads an existing search param", async () => {
		await renderWithTanStackRouter(
			<TestHarness paramKey="find" />,
			"/samples?find=hello",
		);

		expect(screen.getByTestId("value")).toHaveTextContent("hello");
	});

	it("returns null when param is absent and no default", async () => {
		await renderWithTanStackRouter(<TestHarness paramKey="find" />, "/samples");

		expect(screen.getByTestId("value")).toHaveTextContent("null");
	});

	it("applies default value when param is absent", async () => {
		await renderWithTanStackRouter(
			<TestHarness paramKey="find" defaultValue="default" />,
			"/samples",
		);

		expect(screen.getByTestId("value")).toHaveTextContent("default");
	});

	it("writes a search param", async () => {
		await renderWithTanStackRouter(
			<TestHarness paramKey="find" />,
			"/samples?find=hello",
		);

		await userEvent.click(screen.getByText("set"));

		expect(screen.getByTestId("value")).toHaveTextContent("updated");
	});

	it("unsets a search param", async () => {
		await renderWithTanStackRouter(
			<TestHarness paramKey="find" />,
			"/samples?find=hello",
		);

		await userEvent.click(screen.getByText("unset"));

		expect(screen.getByTestId("value")).toHaveTextContent("null");
	});
});

describe("useUrlSearchParam", () => {
	function TestHarness({ paramKey }: { paramKey: string }) {
		const { value } = useUrlSearchParam(paramKey);
		return <span data-testid="value">{String(value)}</span>;
	}

	it("coerces numeric string to number", async () => {
		await renderWithTanStackRouter(
			<TestHarness paramKey="page" />,
			"/samples?page=3",
		);

		expect(screen.getByTestId("value")).toHaveTextContent("3");
	});

	it("coerces boolean string to boolean", async () => {
		await renderWithTanStackRouter(
			<TestHarness paramKey="active" />,
			"/samples?active=true",
		);

		expect(screen.getByTestId("value")).toHaveTextContent("true");
	});
});

describe("useDialogParam", () => {
	function TestHarness({ paramKey }: { paramKey: string }) {
		const { open, setOpen } = useDialogParam(paramKey);
		return (
			<div>
				<span data-testid="open">{String(open)}</span>
				<button onClick={() => setOpen(true)} type="button">
					open
				</button>
				<button onClick={() => setOpen(false)} type="button">
					close
				</button>
			</div>
		);
	}

	it("reads open state as true when param is present", async () => {
		await renderWithTanStackRouter(
			<TestHarness paramKey="openCreate" />,
			"/samples?openCreate=true",
		);

		expect(screen.getByTestId("open")).toHaveTextContent("true");
	});

	it("reads open state as false when param is absent", async () => {
		await renderWithTanStackRouter(
			<TestHarness paramKey="openCreate" />,
			"/samples",
		);

		expect(screen.getByTestId("open")).toHaveTextContent("false");
	});

	it("setOpen(true) sets the param", async () => {
		await renderWithTanStackRouter(
			<TestHarness paramKey="openCreate" />,
			"/samples",
		);

		await userEvent.click(screen.getByText("open"));

		expect(screen.getByTestId("open")).toHaveTextContent("true");
	});

	it("setOpen(false) strips the param from the URL (D15)", async () => {
		await renderWithTanStackRouter(
			<TestHarness paramKey="openCreate" />,
			"/samples?openCreate=true",
		);

		await userEvent.click(screen.getByText("close"));

		expect(screen.getByTestId("open")).toHaveTextContent("false");
	});
});

describe("usePageParam", () => {
	function TestHarness() {
		const { page, setPage } = usePageParam();
		return (
			<div>
				<span data-testid="page">{page}</span>
				<button onClick={() => setPage(5)} type="button">
					go to 5
				</button>
			</div>
		);
	}

	it("defaults to 1 when absent", async () => {
		await renderWithTanStackRouter(<TestHarness />, "/samples");

		expect(screen.getByTestId("page")).toHaveTextContent("1");
	});

	it("reads the page param", async () => {
		await renderWithTanStackRouter(<TestHarness />, "/samples?page=3");

		expect(screen.getByTestId("page")).toHaveTextContent("3");
	});

	it("sets the page param", async () => {
		await renderWithTanStackRouter(<TestHarness />, "/samples");

		await userEvent.click(screen.getByText("go to 5"));

		expect(screen.getByTestId("page")).toHaveTextContent("5");
	});
});

describe("useListSearchParam", () => {
	function TestHarness({
		paramKey,
		defaultValues,
	}: {
		paramKey: string;
		defaultValues?: number[];
	}) {
		const { values, setValues } = useListSearchParam<number>(
			paramKey,
			defaultValues,
		);
		return (
			<div>
				<span data-testid="values">{JSON.stringify(values)}</span>
				<button onClick={() => setValues([10, 20])} type="button">
					set
				</button>
				<button onClick={() => setValues([])} type="button">
					clear
				</button>
			</div>
		);
	}

	it("reads JSON-encoded array values", async () => {
		await renderWithTanStackRouter(
			<TestHarness paramKey="labels" />,
			"/samples?labels=%5B1%2C2%5D",
		);

		expect(screen.getByTestId("values")).toHaveTextContent("[1,2]");
	});

	it("returns empty array when absent with no defaults", async () => {
		await renderWithTanStackRouter(
			<TestHarness paramKey="labels" />,
			"/samples",
		);

		expect(screen.getByTestId("values")).toHaveTextContent("[]");
	});

	it("applies default values when absent", async () => {
		await renderWithTanStackRouter(
			<TestHarness paramKey="labels" defaultValues={[1, 2]} />,
			"/samples",
		);

		expect(screen.getByTestId("values")).toHaveTextContent("[1,2]");
	});

	it("writes values", async () => {
		await renderWithTanStackRouter(
			<TestHarness paramKey="labels" />,
			"/samples",
		);

		await userEvent.click(screen.getByText("set"));

		expect(screen.getByTestId("values")).toHaveTextContent("[10,20]");
	});

	it("setValues([]) strips the key", async () => {
		await renderWithTanStackRouter(
			<TestHarness paramKey="labels" />,
			"/samples?labels=%5B1%2C2%5D",
		);

		await userEvent.click(screen.getByText("clear"));

		expect(screen.getByTestId("values")).toHaveTextContent("[]");
	});
});
