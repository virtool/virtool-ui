import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

/** Button that scrolls the user to the top of the page */
export function PathoscopeViewerScroller() {
	const [show, setShow] = useState(false);

	useEffect(() => {
		const handleScroll = () => setShow(window.scrollY > 0);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	if (show) {
		return (
			<div
				className="flex items-center justify-center fixed bottom-8 left-8 size-10 border border-gray-300 rounded-lg text-gray-500 cursor-pointer z-1 hover:bg-gray-100 hover:text-gray-600"
				onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
			>
				<ArrowUp />
			</div>
		);
	}

	return null;
}
