import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ThumbsUp, Share2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import axios from "axios"

export function VideoInfo({ video}) {
  console.log("video", video)
  const [channelData, setChannelData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLiked, setIsLiked] = useState(video.isLiked)
  const [likesCount, setLikesCount] = useState(video.likesCount)

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        const response = await axios.get(`/api/v1/users/c/${video.owner.username}`)
        setChannelData(response.data.data)
        console.log(response.data.data)
        setIsSubscribed(response.data.data.isSubscribed)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchChannelData()
  }, [video])

  const handleSubscribe = async () => {
    try {
      const data = await axios.post(`/api/v1/subscriptions/c/${video.owner._id}`)
      console.log("subscribe", data)
      setIsSubscribed(!isSubscribed)
      setChannelData(prev => ({
        ...prev,
        subscribersCount: isSubscribed ? prev.subscribersCount - 1 : prev.subscribersCount + 1,
        isSubscribed: !isSubscribed
      }))
    } catch (err) {
      console.error("Failed to toggle subscription:", err)
    }
  }

  const handleLike = async () => {
    try {
      await axios.post(`/api/v1/likes/toggle/v/${video._id}`)
      setIsLiked(!isLiked)
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1)
    } catch (err) {
      console.error("Failed to toggle like:", err)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!channelData) return <div>No channel data found</div>

  return (
    <div className="mt-4">
      <div className="mt-2 flex flex-wrap items-center justify-between gap-y-2">
        <div className="flex items-center space-x-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={channelData.avatar} alt={channelData.fullName} />
            <AvatarFallback>{channelData.fullName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{channelData.fullName}</p>
            <p className="text-sm text-muted-foreground">{channelData.subscribersCount} subscribers</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={channelData.isSubscribed ? "default" : "secondary"}
            onClick={handleSubscribe}
          >
            {channelData.isSubscribed ? "Subscribed" : "Subscribe"}
          </Button>
          <Button 
            variant={isLiked ? "default" : "secondary"} 
            onClick={handleLike}
          >
            <ThumbsUp className="mr-2 h-4 w-4" />
            {isLiked ? "Liked" : "Like"} {likesCount > 0 && likesCount}
          </Button>
          <Button variant="secondary">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
      <div className="mt-4 rounded-lg bg-muted p-4">
        <p className="text-sm">
         <p className="mb-4 text-gray-500 font-semibold">
         {video.description}
         </p>
          
          <span className="font-medium">
            Channel created on: {new Date(channelData.createdAt).toLocaleDateString()}
          </span>
        </p>
      </div>
    </div>
  )
}
