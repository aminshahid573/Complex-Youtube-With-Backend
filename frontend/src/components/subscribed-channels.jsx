import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useEffect } from "react"
import axios from "axios"

export function SubscribedChannels({ channelId }) {
  const [subscribedChannels, setSubscribedChannels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSubscribedChannels = async () => {
      try {
        const response = await axios.get(`/api/v1/subscriptions/c/${channelId}`)
        setSubscribedChannels(response.data.data[0].subscribedChannels)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchSubscribedChannels()
  }, [channelId])

  if (loading) return <div>Loading subscribed channels...</div>
  if (error) return <div>Error: {error}</div>
  if (!subscribedChannels.length) return <div>No subscribed channels found</div>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {subscribedChannels.map((channel) => (
        <div key={channel._id} className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={channel.channelDetails.avatar} alt={channel.channelDetails.fullName} />
            <AvatarFallback>{channel.channelDetails.fullName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{channel.channelDetails.fullName}</h3>
            <p className="text-sm text-muted-foreground">{channel.subscriberCount} subscribers</p>
          </div>
        </div>
      ))}
    </div>
  )
}
