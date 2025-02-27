import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsUpIcon } from "lucide-react"
import { useState, useEffect } from "react"
import axios from "axios"

export function TweetList({ channelId }) {
  const [tweets, setTweets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const response = await axios.get(`/api/v1/tweets/user/${channelId}`)
        setTweets(response.data.data)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchTweets()
  }, [channelId])

  const handleLikeToggle = async (tweetId) => {
    try {
      await axios.post(`/api/v1/likes/toggle/t/${tweetId}`)
      setTweets(prevTweets => 
        prevTweets.map(tweet => {
          if (tweet._id === tweetId) {
            return {
              ...tweet,
              isLiked: !tweet.isLiked,
              likesCount: tweet.isLiked ? tweet.likesCount - 1 : tweet.likesCount + 1
            }
          }
          return tweet
        })
      )
    } catch (err) {
      console.error("Failed to toggle like:", err)
    }
  }

  if (loading) return <div>Loading tweets...</div>
  if (error) return <div>Error: {error}</div>
  if (!tweets.length) return <div>No tweets found</div>

  return (
    <div className="space-y-4">
      {tweets.map((tweet) => (
        <div key={tweet._id} className="bg-muted p-4 rounded-lg">
          <p>{tweet.content}</p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-muted-foreground">
              {new Date(tweet.createdAt).toLocaleDateString()}
            </p>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleLikeToggle(tweet._id)}
            >
              {tweet.isLiked ? (
                <ThumbsUpIcon className="h-4 w-4 mr-2 text-primary fill-primary" />
              ) : (
                <ThumbsUp className="h-4 w-4 mr-2" />
              )}
              {tweet.likesCount}
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
