/**
 * A link, visible only while focused, that lets keyboard users jump straight to
 * the main content and past the navigation landmarks.
 */
export default function SkipLink() {
	return (
		<a
			href="#main-content"
			className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-skip-link focus:rounded-sm focus:bg-white focus:px-4 focus:py-2 focus:font-medium focus:text-blue-700 focus:shadow-lg"
		>
			Skip to main content
		</a>
	);
}
