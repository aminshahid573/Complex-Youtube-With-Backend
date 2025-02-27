import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ThumbsUp } from "@/components/ui/icons" // Import ThumbsUp icon

const comments = [
  {
    id: 1,
    user: {
      name: "Alice Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    content: "Great tutorial! I learned a lot about React and Tailwind CSS.",
    likes: 24,
    timestamp: "2 days ago",
  },
  {
    id: 2,
    user: {
      name: "Bob Smith",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    content: "Could you make a follow-up video on state management in React?",
    likes: 15,
    timestamp: "1 day ago",
  },
]

export function CommentSection() {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold">Comments</h2>
      <div className="mt-4 flex space-x-4">
        <Avatar>
          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Your Avatar" />
          <AvatarFallback>YA</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <Textarea placeholder="Add a comment..." />
          <div className="mt-2 flex justify-end space-x-2">
            <Button variant="ghost">Cancel</Button>
            <Button>Comment</Button>
          </div>
        </div>
      </div>
      <div className="mt-6 space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex space-x-4">
            <Avatar>
              <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
              <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">
                {comment.user.name} <span className="font-normal text-muted-foreground">{comment.timestamp}</span>
              </p>
              <p className="mt-1">{comment.content}</p>
              <Button variant="ghost" size="sm" className="mt-1">
                <ThumbsUp className="mr-2 h-4 w-4" />
                {comment.likes}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

