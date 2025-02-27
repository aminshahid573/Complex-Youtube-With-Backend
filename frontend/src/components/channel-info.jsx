import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function ChannelInfo({ channel }) {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
        <Avatar className="h-24 w-24">
          <AvatarImage src={channel.avatar} alt={channel.name} />
          <AvatarFallback>{channel.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{channel.name}</h1>
          <p className="text-muted-foreground">{channel.subscribers} subscribers</p>
          <p className="mt-4 text-sm w-full lg:w-1/2">{channel.description}</p>
        </div>
      </div>
      <Button className="mt-4 lg:mt-0">Subscribe</Button>
    </div>
  )
}

