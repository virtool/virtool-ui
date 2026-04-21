export type VirtoolState = {
	sentryDsn: string;
	version: string;
};

declare global {
	interface Window {
		captureException?: (error: Error) => void;
		virtool: VirtoolState;
	}
}
