
import { useState } from "react"
import { YoutubeHeader } from "@/components/youtube-header"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ChannelBanner } from "@/components/channel-banner"
import { ChannelInfo } from "@/components/channel-info"
import { ChannelTabs } from "@/components/channel-tabs"
import { VideoGrid } from "@/components/video-grid"
import { PlaylistGrid } from "../components/playlist-grid"
import { TweetList } from "@/components/tweet-list"
import { SubscribedChannels } from "@/components/subscribed-channels"

const channelData = {
  id: "channel123",
  name: "Dev Tutorials",
  subscribers: "500K",
  avatar: "/placeholder.svg?height=80&width=80",
  banner: "/placeholder.svg?height=200&width=1200",
  description:
    "Welcome to Dev Tutorials! We create in-depth programming tutorials on web development, focusing on React, Next.js, and modern JavaScript.",
  videos: [
    // ... (use the video data structure from previous examples)
  ],
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
    { id: 1, content: "Just uploaded a new video on React Hooks! Check it out!", timestamp: "2h ago", likes: 42 },
    {
      id: 2,
      content: "What topics would you like to see covered in future videos? Let us know in the comments!",
      timestamp: "1d ago",
      likes: 89,
    },
  ],
  subscribedChannels: [
    { id: 1, name: "React Official", avatar: "/placeholder.svg?height=40&width=40", subscribers: "1M" },
    { id: 2, name: "Next.js Community", avatar: "/placeholder.svg?height=40&width=40", subscribers: "750K" },
  ],
}

export default function ChannelPage() {
  const [activeTab, setActiveTab] = useState("videos")

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <YoutubeHeader />
        <ChannelBanner src={channelData.banner} />
        <div className="container mx-auto px-4 py-8">
          <ChannelInfo channel={channelData} />
          <ChannelTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="mt-6">
            {activeTab === "videos" && <VideoGrid videos={channelData.videos} />}
            {activeTab === "playlists" && <PlaylistGrid playlists={channelData.playlists} />}
            {activeTab === "tweets" && <TweetList tweets={channelData.tweets} />}
            {activeTab === "subscribed" && <SubscribedChannels channels={channelData.subscribedChannels} />}
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}

