import { useServerVersionStore } from "@app/serverVersion";
import {
	Toast,
	ToastAction,
	ToastProvider,
	ToastTitle,
	ToastViewport,
} from "@base/Toast";

/**
 * A persistent toast prompting the user to reload when the running SSR service
 * has been redeployed since their session started.
 */
export default function UpdateToast() {
	const version = useServerVersionStore((state) => state.version);
	const open = version !== null && version !== __APP_VERSION__;

	return (
		<ToastProvider>
			<Toast open={open} duration={Number.POSITIVE_INFINITY}>
				<ToastTitle>A new version of Virtool is available.</ToastTitle>
				<ToastAction
					altText="Reload the page to update to the latest version"
					onClick={() => window.location.reload()}
				>
					Reload
				</ToastAction>
			</Toast>
			<ToastViewport />
		</ToastProvider>
	);
}
