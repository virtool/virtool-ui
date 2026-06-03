import {
	useClearActiveBanner,
	useCreateBanner,
	useDeleteBanner,
	useFetchBanners,
	useSetActiveBanner,
	useUpdateBanner,
} from "@banner/queries";
import BoxGroup from "@base/BoxGroup";
import BoxGroupSection from "@base/BoxGroupSection";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import NoneFoundSection from "@base/NoneFoundSection";
import { RadioGroup, RadioGroupItem } from "@base/RadioGroup";
import SectionHeader from "@base/SectionHeader";
import BannerItem from "./BannerItem";
import CreateBanner from "./CreateBanner";

/**
 * Display and manage the list of banners. Admins can create, edit, activate,
 * deactivate, and delete entries; the active row is shown to all users.
 */
export default function Banners() {
	const { data, isPending } = useFetchBanners();
	const createMutation = useCreateBanner();
	const updateMutation = useUpdateBanner();
	const deleteMutation = useDeleteBanner();
	const setActiveMutation = useSetActiveBanner();
	const clearActiveMutation = useClearActiveBanner();

	if (isPending || !data) {
		return <LoadingPlaceholder />;
	}

	const activeBanner = data.find((item) => item.active);
	const selectedValue = activeBanner?.id.toString() ?? "off";

	function handleChange(value: string) {
		if (value === "off") {
			clearActiveMutation.mutate();
			return;
		}
		setActiveMutation.mutate({ id: Number(value) });
	}

	return (
		<section>
			<SectionHeader>
				<h2>Banners</h2>
				<p>
					Manage the banner displayed to all users above the navigation bar.
				</p>
				<div className="mt-3 flex justify-end">
					<CreateBanner
						onSubmit={(values) => createMutation.mutateAsync(values)}
					/>
				</div>
			</SectionHeader>
			{data.length ? (
				<RadioGroup
					aria-label="Active banner"
					value={selectedValue}
					onValueChange={handleChange}
				>
					<BoxGroup>
						<BoxGroupSection className="flex items-center gap-3">
							<RadioGroupItem id="banner-off" value="off" />
							<label
								htmlFor="banner-off"
								className="grow cursor-pointer text-gray-600"
							>
								Off — no banner displayed
							</label>
						</BoxGroupSection>
						{data.map((item) => (
							<BannerItem
								key={item.id}
								color={item.color}
								id={item.id}
								message={item.message}
								onEdit={(id, values) =>
									updateMutation.mutateAsync({ id, ...values })
								}
								onRemove={(id) => deleteMutation.mutateAsync({ id })}
							/>
						))}
					</BoxGroup>
				</RadioGroup>
			) : (
				<BoxGroup>
					<NoneFoundSection noun="banners" />
				</BoxGroup>
			)}
		</section>
	);
}
