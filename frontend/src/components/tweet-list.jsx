import { Button } from "@/components/ui/button"
import { ThumbsUp } from "lucide-react"

export function TweetList({ tweets }) {
  return (
    <div className="space-y-4">
      {tweets.map((tweet) => (
        <div key={tweet.id} className="bg-muted p-4 rounded-lg">
          <p>{tweet.content}</p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm text-muted-foreground">{tweet.timestamp}</p>
            <Button variant="ghost" size="sm">
              <ThumbsUp className="h-4 w-4 mr-2" />
              {tweet.likes || 0}
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

