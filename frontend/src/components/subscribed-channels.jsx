import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function SubscribedChannels({ channels }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {channels.map((channel) => (
        <div key={channel.id} className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={channel.avatar} alt={channel.name} />
            <AvatarFallback>{channel.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{channel.name}</h3>
            <p className="text-sm text-muted-foreground">{channel.subscribers} subscribers</p>
          </div>
        </div>
      ))}
    </div>
  )
}

