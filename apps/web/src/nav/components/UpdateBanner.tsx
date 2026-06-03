import { useServerVersionStore } from "@app/serverVersion";

/**
 * Non-blocking banner prompting the user to reload when the running SSR
 * service has been redeployed since their session started.
 */
export default function UpdateBanner() {
	const version = useServerVersionStore((state) => state.version);

	if (version === null || version === __APP_VERSION__) {
		return null;
	}

	return (
		<div className="bg-blue-600 flex font-medium gap-3 items-center justify-center px-3 py-1 text-white">
			<span>A new version of Virtool is available.</span>
			<button
				type="button"
				className="underline"
				onClick={() => window.location.reload()}
			>
				Reload
			</button>
		</div>
	);
}
