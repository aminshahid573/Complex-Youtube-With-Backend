import { VideoPlayer } from "@/components/video-player";
import { VideoInfo } from "@/components/video-info";
import { CommentSection } from "../components/comment-section.jsx";
import { VideoRecommendations } from "../components/video-recommendation.jsx";

const videoData = {
  id: "video123",
  title: "Building a YouTube Clone with React and Tailwind CSS",
  views: "1.2M views",
  uploadDate: "May 15, 2023",
  likes: "52K",
  description:
    "In this tutorial, we'll be building a YouTube clone using React and Tailwind CSS. We'll cover everything from setting up the project to implementing key features like video playback, comments, and recommendations.",
  channel: {
    name: "Dev Tutorials",
    subscribers: "500K",
    avatar: "/placeholder.svg?height=48&width=48",
  },
};

function VideoDetail() {
  return (
    <div className="container mx-auto px-4 py-8 lg:flex lg:gap-6">
      <main className="lg:flex-grow lg:max-w-[calc(100%-352px)]">
        <VideoPlayer videoId={videoData.id} />
        <VideoInfo video={videoData} />
        <CommentSection videoId={videoData.id} />
      </main>
      <aside className="mt-6 lg:mt-0 lg:w-80">
        <VideoRecommendations />
      </aside>
    </div>
  );
};

export default VideoDetail
