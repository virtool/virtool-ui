export default function WrapRow(renderRow, getItemProps) {
	function WrappedRow(item, index) {
		return (
			<li
				key={item.id}
				className="px-2.5 py-2.5 hover:bg-gray-50 hover:border-0"
				{...getItemProps({
					item: item.id,
					index,
				})}
			>
				{renderRow(item)}
			</li>
		);
	}
	return WrappedRow;
}
