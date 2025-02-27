import { VideoPlayer } from "@/components/video-player";
import { VideoInfo } from "@/components/video-info";
import { CommentSection } from "../components/comment-section.jsx";
import { VideoRecommendations } from "../components/video-recommendation.jsx";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function VideoDetail() {
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { videoId } = useParams();

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const response = await axios.get(`/api/v1/videos/${videoId}`);
        setVideoData(response.data.data);
        console.log("response",videoData)
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchVideoDetails();
  }, [videoId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!videoData) return <div>No video found</div>;

  return (
    <div className="container mx-auto px-4 py-8 lg:flex lg:gap-6">
      <main className="lg:flex-grow lg:max-w-[calc(100%-352px)]">
        <VideoPlayer videoId={videoData._id} />
        <VideoInfo video={videoData} description={videoData.description} channelId={videoData.owner._id} username={videoData.owner.username} />
        <CommentSection video={videoData} />
      </main>
      <aside className="mt-6 lg:mt-0 lg:w-80">
        <VideoRecommendations />
      </aside>
    </div>
  );
}

export default VideoDetail;
