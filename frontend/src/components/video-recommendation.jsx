import { VideoCard } from "@/components/video-card"

const recommendedVideos = [
  {
    id: 1,
    title: "Advanced React Hooks: useCallback and useMemo",
    thumbnail: "/placeholder.svg?height=200&width=360",
    duration: "18:24",
    channel: {
      name: "React Masters",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    views: "450K",
    uploadedAt: "3 weeks ago",
  },
  {
    id: 2,
    title: "CSS Grid Layout: A Comprehensive Guide",
    thumbnail: "/placeholder.svg?height=200&width=360",
    duration: "22:15",
    channel: {
      name: "CSS Wizards",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    views: "320K",
    uploadedAt: "1 month ago",
  },
  {
    id: 3,
    title: "Building a RESTful API with Node.js and Express",
    thumbnail: "/placeholder.svg?height=200&width=360",
    duration: "31:42",
    channel: {
      name: "Backend Devs",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    views: "280K",
    uploadedAt: "2 weeks ago",
  },
]

export function VideoRecommendations() {
  return (
    <div className="space-y-4">
      {recommendedVideos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  )
}

