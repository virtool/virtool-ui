import SettingsCheckbox from "@administration/components/SettingsCheckbox";
import { usePathParams } from "@app/hooks";
import BoxGroup from "@base/BoxGroup";
import BoxGroupDisabled from "@base/BoxGroupDisabled";
import BoxGroupHeader from "@base/BoxGroupHeader";
import BoxGroupSection from "@base/BoxGroupSection";
import Button from "@base/Button";
import IconButton from "@base/IconButton";
import InputContainer from "@base/InputContainer";
import InputError from "@base/InputError";
import InputSimple from "@base/InputSimple";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import SectionHeader from "@base/SectionHeader";
import { useUpdateSourceTypes } from "@references/hooks";
import {
	referenceQueryKeys,
	useFetchReference,
	useUpdateReference,
} from "@references/queries";
import { Undo2 } from "lucide-react";
import SourceTypeList from "./SourceTypeList";

export function LocalSourceTypes() {
	const { refId } = usePathParams<{ refId: string }>();

	const { data, isPending } = useFetchReference(refId);

	const { mutation: updateReferenceMutation } = useUpdateReference(refId);

	const sourceTypes = data?.source_types ?? [];
	const restrictSourceTypes = data?.restrict_source_types ?? false;

	const {
		error,
		lastRemoved,
		handleRemove,
		handleSubmit,
		handleUndo,
		register,
	} = useUpdateSourceTypes(
		"source_types",
		`/refs/${refId}`,
		referenceQueryKeys.detail(refId),
		sourceTypes,
	);

	if (isPending) {
		return <LoadingPlaceholder />;
	}

	function handleToggle() {
		updateReferenceMutation.mutate({
			restrict_source_types: !restrictSourceTypes,
		});
	}

	return (
		<section>
			<SectionHeader>
				<h2>Source Types</h2>
				<p>Configure a list of allowable source types.</p>
			</SectionHeader>
			<SettingsCheckbox
				enabled={restrictSourceTypes}
				id="RestrictSourceTypes"
				onToggle={handleToggle}
			>
				<h2>Restrict Source Types</h2>
				<small>
					Only allow users to to select from allowed source types for isolates.
					If disabled, users will be able to enter any string as a source type.
				</small>
			</SettingsCheckbox>
			<BoxGroup>
				<BoxGroupHeader>
					<h2>Manage Source Types</h2>
					<p>Add or remove source types for this reference.</p>
				</BoxGroupHeader>

				<BoxGroupDisabled disabled={!restrictSourceTypes}>
					<SourceTypeList sourceTypes={sourceTypes} onRemove={handleRemove} />
					{lastRemoved && (
						<BoxGroupSection className="flex items-center bg-gray-50">
							<span>
								The source type{" "}
								<strong className="capitalize">{lastRemoved}</strong> was just
								removed.
							</span>
							<IconButton
								className="ml-auto"
								IconComponent={Undo2}
								tip="undo"
								onClick={handleUndo}
							/>
						</BoxGroupSection>
					)}
					<BoxGroupSection>
						<form onSubmit={handleSubmit}>
							<label className="block mb-1" htmlFor="sourceType">
								Add Source Type{" "}
							</label>
							<InputContainer className="flex mb-[5px]">
								<span className="flex flex-auto mr-2.5 flex-col">
									<InputSimple id="sourceType" {...register("sourceType")} />
									<InputError>{error}</InputError>
								</span>
								<Button
									className="w-15 h-8.5 ml-auto text-center justify-center mr-1"
									color="green"
									type="submit"
								>
									Add
								</Button>
							</InputContainer>
						</form>
					</BoxGroupSection>
				</BoxGroupDisabled>
			</BoxGroup>
		</section>
	);
}
