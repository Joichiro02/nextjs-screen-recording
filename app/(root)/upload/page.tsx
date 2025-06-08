"use client";

import FileInput from "@/components/FileInput";
import FormField from "@/components/FormField";
import { MAX_THUMBNAIL_SIZE, MAX_VIDEO_SIZE } from "@/constants";
import { useFileInput } from "@/lib/hooks/useFileInput";
import { FormEvent, useState } from "react";

export default function Page() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		visibility: "public",
	});
	const [error, setError] = useState<string | null>(null);

	const video = useFileInput(MAX_VIDEO_SIZE);
	const thumbnail = useFileInput(MAX_THUMBNAIL_SIZE);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			if (!video.file || !thumbnail.file) {
				setError("Please upload video and a thumbnail.");
				return;
			}
			if (!formData.title || !formData.description) {
				setError("Please fill in all the details");
				return;
			}

			// Upload the video to Bunny
			// Upload the thumbnail to DB
			// Attach thumbnail
			// Create new DB entry for the video details (urls, data)
		} catch (error) {
			console.error("Upload error:", error);
			setError("Failed to upload video. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="wrapper-md upload-page">
			<h1>Upload a video</h1>

			{error && <div className="error-field">{error}</div>}

			<form
				className="rounded-20 shadow-10 gap-6 w-full flex flex-col px-5 py-7.5"
				onSubmit={handleSubmit}
			>
				<FormField
					id="title"
					label="Title"
					value={formData.title}
					onChange={handleChange}
					placeholder="Enter a clear and concise video title"
				/>
				<FormField
					id="description"
					label="Description"
					value={formData.description}
					onChange={handleChange}
					placeholder="Describe what this video is about"
					as="textarea"
				/>
				<FileInput
					id="video"
					label="Video"
					accept="video/*"
					file={video.file}
					previewUrl={video.previewUrl}
					inputRef={video.inputRef}
					onChange={video.handleFileChange}
					onReset={video.resetFile}
					type="video"
				/>
				<FileInput
					id="thumbnail"
					label="Thumbnail"
					accept="images/*"
					file={thumbnail.file}
					previewUrl={thumbnail.previewUrl}
					inputRef={thumbnail.inputRef}
					onChange={thumbnail.handleFileChange}
					onReset={thumbnail.resetFile}
					type="image"
				/>
				<FormField
					id="visibility"
					label="Visibility"
					value={formData.visibility}
					onChange={handleChange}
					placeholder="Describe what this video is about"
					as="select"
					options={[
						{ value: "public", label: "Public" },
						{ value: "private", label: "Private" },
					]}
				/>
				<button type="submit" disabled={isSubmitting} className="submit-button">
					{isSubmitting ? "Uploading..." : "Upload Video"}
				</button>
			</form>
		</div>
	);
}
