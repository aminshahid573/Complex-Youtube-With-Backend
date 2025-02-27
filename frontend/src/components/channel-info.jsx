import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"
import { Loader2 } from "lucide-react"

export function ChannelInfo({username}) {
  
  const [channelData, setChannelData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isSubscribing, setIsSubscribing] = useState(false)

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        const response = await axios.get(`/api/v1/users/c/${username}`)
        setChannelData(response.data.data)
        setIsSubscribed(response.data.data.isSubscribed)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchChannelData()
  }, [username])

  const handleSubscribe = async () => {
    try {
      setIsSubscribing(true)
      await axios.post(`/api/v1/subscriptions/c/${channelData._id}`)
      setIsSubscribed(!isSubscribed)
      setChannelData(prev => ({
        ...prev,
        subscribersCount: isSubscribed ? prev.subscribersCount - 1 : prev.subscribersCount + 1,
        isSubscribed: !isSubscribed
      }))
      setIsSubscribing(false)
    } catch (err) {
      console.error("Failed to toggle subscription:", err)
      setIsSubscribing(false)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!channelData) return <div>No channel data found</div>

  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
        <Avatar className="h-24 w-24">
          <AvatarImage src={channelData.avatar} alt={channelData.fullName} />
          <AvatarFallback>{channelData.fullName[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{channelData.fullName}</h1>
          <p className="text-muted-foreground">{channelData.subscribersCount} subscribers</p>
          <p className="mt-4 text-sm w-full lg:w-1/2">@{channelData.username}</p>
        </div>
      </div>
      <Button 
  disabled={isSubscribing} 
  className="mt-4 lg:mt-0" 
  variant={isSubscribed ? "default" : "secondary"} 
  onClick={handleSubscribe}
>
  {isSubscribing ? (
    <>
      <Loader2 className="animate-spin" /> Please Wait.
    </>
  ) : (
    isSubscribed ? "Subscribed" : "Subscribe"
  )}
</Button>
    </div>
  )
}
