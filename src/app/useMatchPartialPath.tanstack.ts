import { useLocation } from "@tanstack/react-router";

export function useMatchPartialPath(path: string, exclude?: string[]): boolean {
	const pathname = useLocation({ select: (l) => l.pathname });

	if (exclude?.includes(pathname)) {
		return false;
	}

	return pathname.startsWith(path.split("?")[0].replace(/\/+$/, ""));
}
