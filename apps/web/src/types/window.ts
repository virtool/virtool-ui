export type VirtoolState = {
	sentryDsn: string;
	version: string;
};

declare global {
	// biome-ignore lint/style/useConsistentTypeDefinitions: global augmentation merges into the built-in Window interface
	interface Window {
		captureException?: (error: Error) => void;
		virtool: VirtoolState;
	}
}
