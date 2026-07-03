import BoxGroup from "@base/BoxGroup";
import BoxGroupHeader from "@base/BoxGroupHeader";
import BoxGroupSection from "@base/BoxGroupSection";
import RelativeTime from "@base/RelativeTime";
import { GitFork, HardDrive } from "lucide-react";

export default function Remote({ detail }) {
	const { installed, remotes_from } = detail;

	const slug = remotes_from.slug;

	return (
		<BoxGroup>
			<BoxGroupHeader>
				<h2 className="flex items-center justify-between gap-2">
					<span className="inline-flex items-center gap-2">
						Remote Reference
					</span>
					<a
						className="flex gap-1 items-center text-base"
						href={`https://github.com/${slug}`}
						target="_blank"
						rel="noopener noreferrer"
					>
						<GitFork size={18} />
						{slug}
					</a>
				</h2>
			</BoxGroupHeader>

			{installed && (
				<BoxGroupSection className="flex items-center gap-1.5">
					<HardDrive size={18} />
					<strong>Installed Version</strong>
					<span>/</span>
					<span>{installed.name}</span>
					<span>/</span>
					<span>Published</span>
					<RelativeTime time={installed.published_at} />
				</BoxGroupSection>
			)}
		</BoxGroup>
	);
}
