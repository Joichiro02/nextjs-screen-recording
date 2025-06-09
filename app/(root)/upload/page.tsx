"use client";

import FileInput from "@/components/FileInput";
import FormField from "@/components/FormField";
import { MAX_THUMBNAIL_SIZE, MAX_VIDEO_SIZE } from "@/constants";
import { getThumbnailUploadUrl, getVideoUploadUrl, saveVideoDetails } from "@/lib/actions/video";
import { useFileInput } from "@/lib/hooks/useFileInput";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

const uploadFileToBunny = async (
	file: File,
	uploadUrl: string,
	accessKey: string
): Promise<void> => {
	return fetch(uploadUrl, {
		method: "PUT",
		headers: {
			AccessKey: accessKey,
			"Content-Type": file.type,
		},
		body: file,
	}).then((response) => {
		if (!response.ok) {
			throw new Error(`Upload failed: ${response.statusText}`);
		}
	});
};

export default function Page() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		visibility: "public",
	});
	const [videoDuration, setVideoDuration] = useState<number | null>(0);
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

			// 0 get upload url
			const {
				videoId,
				uploadUrl: videoUploadUrl,
				accessKey: videoAccessKey,
			} = await getVideoUploadUrl();

			if (!videoUploadUrl || !videoAccessKey) throw new Error("Failed to get upload credentials");

			// 1 Upload video to Bunny
			await uploadFileToBunny(video.file, videoUploadUrl, videoAccessKey);

			// Upload the thumbnail to DB
			const {
				uploadUrl: thumbnailUploadUrl,
				accessKey: thumbnailAccessKey,
				cdnUrl: thumbnailCdnUrl,
			} = await getThumbnailUploadUrl(videoId);

			if (!thumbnailUploadUrl || !thumbnailAccessKey || !thumbnailCdnUrl)
				throw new Error("Failed to get thumbnail upload credentials");

			// Attach thumbnail
			await uploadFileToBunny(thumbnail.file, thumbnailUploadUrl, thumbnailAccessKey);

			// Create new DB entry for the video details (urls, data)
			await saveVideoDetails({
				videoId: videoId,
				thumbnailUrl: thumbnailCdnUrl,
				...formData,
				duration: videoDuration,
			});

			router.push(`/video/${videoId}`);
		} catch (error) {
			console.error("Upload error:", error);
			setError("Failed to upload video. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	useEffect(() => {
		if (video.duration !== null || 0) {
			setVideoDuration(video.duration);
		}
	}, [video.duration]);

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
