import BoxGroup from "@base/BoxGroup";
import BoxGroupHeader from "@base/BoxGroupHeader";
import BoxGroupSection from "@base/BoxGroupSection";
import { Link } from "@tanstack/react-router";

type CloneProps = {
	source: { id: string; name: string };
};

export function Clone({ source }: CloneProps) {
	return (
		<BoxGroup>
			<BoxGroupHeader>
				<h2>Clone Reference</h2>
			</BoxGroupHeader>

			<BoxGroupSection>
				<strong>Source Reference</strong>
				<span>
					{" / "}
					<Link to="/refs/$refId" params={{ refId: source.id }}>
						{source.name}
					</Link>
				</span>
			</BoxGroupSection>
		</BoxGroup>
	);
}
