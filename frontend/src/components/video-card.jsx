import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function VideoCard({ video }) {
  return (
    <div className="flex flex-col space-y-2">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted">
        <img src={video.thumbnail || "/placeholder.svg"} alt={video.title} className="h-full w-full object-cover" />
        <div className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-xs font-medium text-white">
          {video.duration}
        </div>
      </div>
      <div className="flex space-x-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={video.channel.avatar} alt={video.channel.name} />
          <AvatarFallback>{video.channel.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h3 className="line-clamp-2 text-sm font-medium">{video.title}</h3>
          <p className="text-xs text-muted-foreground">{video.channel.name}</p>
          <p className="text-xs text-muted-foreground">
            {video.views} views • {video.uploadedAt}
          </p>
        </div>
      </div>
    </div>
  )
}

