import Header from "@/components/Header";
import VideoCard from "@/components/VideoCard";
import { dummyCards } from "@/constants";

export default async function Page({ params }: ParamsWithSearch) {
	const { id } = await params;
	return (
		<div className="wrapper page">
			<Header
				subHeader="markanthonyfamarin@gmail.com"
				title="Adrian | JS Master"
				userImg="/assets/images/dummy.jpg"
			/>

			<section className="video-grid">
				{dummyCards.map((card) => (
					<VideoCard key={card.id} {...card} />
				))}
			</section>
		</div>
	);
}
