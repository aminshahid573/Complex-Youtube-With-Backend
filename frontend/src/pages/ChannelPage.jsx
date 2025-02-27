import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ChannelBanner } from "@/components/channel-banner";
import { ChannelInfo } from "@/components/channel-info";
import { ChannelTabs } from "@/components/channel-tabs";
import { VideoGrid } from "@/components/video-grid";
import { PlaylistGrid } from "../components/playlist-grid";
import { TweetList } from "@/components/tweet-list";
import { SubscribedChannels } from "@/components/subscribed-channels";
import axios from "axios";

const channelData = {
  playlists: [
    {
      id: 1,
      title: "React Basics: Master the Fundamentals", 
      videoCount: 10,
      thumbnail: "/placeholder.svg?height=100&width=180",
    },
    {
      id: 2,
      title: "Advanced Next.js: Server-Side Rendering and More",
      videoCount: 8,
      thumbnail: "/placeholder.svg?height=100&width=180",
    },
    {
      id: 3,
      title: "CSS Tricks: From Basics to Advanced Techniques",
      videoCount: 12,
      thumbnail: "/placeholder.svg?height=100&width=180",
    },
  ],
  tweets: [
    {
      id: 1,
      content: "Just uploaded a new video on React Hooks! Check it out!",
      timestamp: "2h ago",
      likes: 42,
    },
    {
      id: 2,
      content:
        "What topics would you like to see covered in future videos? Let us know in the comments!",
      timestamp: "1d ago",
      likes: 89,
    },
  ],
  subscribedChannels: [
    {
      id: 1,
      name: "React Official",
      avatar: "/placeholder.svg?height=40&width=40",
      subscribers: "1M",
    },
    {
      id: 2,
      name: "Next.js Community",
      avatar: "/placeholder.svg?height=40&width=40",
      subscribers: "750K",
    },
  ],
};

export default function ChannelPage() {
  const [activeTab, setActiveTab] = useState("videos");
  const [channelInfo, setChannelInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { username } = useParams();

  useEffect(() => {
    const fetchChannelInfo = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/v1/users/c/${username}`);
        setChannelInfo(response.data.data);
      } catch (error) {
        console.error("Error fetching channel info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChannelInfo();
  }, [username]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <ChannelBanner src={channelInfo?.coverImage} />
      <div className="container mx-auto px-4 py-8">
        <ChannelInfo username={username} channelInfo={channelInfo} />
        <ChannelTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="mt-6">
          {activeTab === "videos" && <VideoGrid channelId={channelInfo?._id} />}
          {activeTab === "playlists" && (
            <PlaylistGrid channelId={channelInfo?._id} />
          )}
          {activeTab === "tweets" && <TweetList channelId={channelInfo?._id} />}
          {activeTab === "subscribed" && (
            <SubscribedChannels channelId={channelInfo._id} />
          )}
        </div>
      </div>
    </div>
  );
}
