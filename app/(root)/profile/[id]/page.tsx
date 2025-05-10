import Header from "@/components/Header";

export default async function Page({ params }: ParamsWithSearch) {
	const { id } = await params;
	return (
		<div className="wrapper page">
			<Header
				subHeader="markanthonyfamarin@gmail.com"
				title="Adrian | JS Master"
				userImg="/assets/images/dummy.jpg"
			/>
			Profile {id}
		</div>
	);
}
