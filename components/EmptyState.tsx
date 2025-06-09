import Image from "next/image";

export default function EmptyState({ icon, title, description }: EmptyStateProps) {
	return (
		<section className="empty-state">
			<div>
				<Image src={icon} alt="icon" width={46} height={46} />
			</div>
			<article>
				<h1>{title}</h1>
				<p>{description}</p>
			</article>
		</section>
	);
}
