"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ThumbsUp, Share2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function VideoInfo({ video }) {
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    if (isSubscribing) {
      const timer = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress === 100) {
            clearInterval(timer)
            setIsSubscribing(false)
            setIsSubscribed(true)
            return 0
          }
          return oldProgress + 10
        })
      }, 200)

      return () => {
        clearInterval(timer)
      }
    }
  }, [isSubscribing])

  const handleSubscribe = () => {
    if (!isSubscribed) {
      setIsSubscribing(true)
    }
  }

  return (
    <div className="mt-4">
      <h1 className="text-2xl font-bold">{video.title}</h1>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-y-2">
        <div className="flex items-center space-x-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={video.channel.avatar} alt={video.channel.name} />
            <AvatarFallback>{video.channel.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{video.channel.name}</p>
            <p className="text-sm text-muted-foreground">{video.channel.subscribers} subscribers</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={isSubscribed ? "default" : "secondary"}
            onClick={handleSubscribe}
            disabled={isSubscribing}
            className="relative"
          >
            {isSubscribing && (
              <svg className="absolute inset-0" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (progress / 100) * 283}
                  transform="rotate(-90 50 50)"
                />
              </svg>
            )}
            <span className="z-10">{isSubscribed ? "Subscribed" : "Subscribe"}</span>
          </Button>
          <Button variant="secondary">
            <ThumbsUp className="mr-2 h-4 w-4" />
            {video.likes}
          </Button>
          <Button variant="secondary">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
      <div className="mt-4 rounded-lg bg-muted p-4">
        <p className="text-sm">
          <span className="font-medium">
            {video.views} • {video.uploadDate}
          </span>
        </p>
        <p className="mt-2 text-sm">{video.description}</p>
      </div>
    </div>
  )
}

