import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import formatTime from "../utils/formatTime"

export function VideoCard({ video }) {
  const [videoData, setVideoData] = useState(video)

  useEffect(() => {
    // Update videoData when video prop changes
    setVideoData(video)
  }, [video])

  // Check if video exists to prevent errors
  if (!videoData) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-2">
      <Link to={`/video/${videoData._id}`}>
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted">
          <img src={videoData.thumbnail || "/placeholder.svg"} alt={videoData.title} className="h-full w-full object-cover" />
          <div className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-xs font-medium text-white">
            {formatTime(videoData.duration)}
            
          </div>
        </div>
      </Link>
      <div className="flex space-x-3">
        <Link to={`/c/${videoData.owner?.username}`}>
          <Avatar className="h-9 w-9">
            <AvatarImage src={videoData.owner?.avatar} alt={videoData.owner?.fullName} />
            <AvatarFallback>{videoData.owner?.fullName?.[0]}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex flex-col">
          <Link to={`/videos/${videoData._id}`}>
            <h3 className="line-clamp-2 text-sm font-medium">{videoData.title}</h3>
          </Link>
          <Link to={`/c/${videoData.owner?.username}`}>
            <p className="text-xs text-muted-foreground">{videoData.owner?.fullName}</p>
          </Link>
          <p className="text-xs text-muted-foreground">
            {videoData.views} views • {videoData.createdAt}
          </p>
        </div>
      </div>
    </div>
  )
}
