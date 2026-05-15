import { byteSize } from "@app/utils";
import BoxGroupSection from "@base/BoxGroupSection";

export type SubtractionFileItemProps = {
	downloadUrl: string;
	name: string;
	size: number;
};

export function SubtractionFileItem({
	downloadUrl,
	name,
	size,
}: SubtractionFileItemProps) {
	return (
		<BoxGroupSection className="flex items-center">
			<a className="mr-auto font-medium" href={`/api${downloadUrl}`}>
				{name}
			</a>
			<strong>{byteSize(size)}</strong>
		</BoxGroupSection>
	);
}
