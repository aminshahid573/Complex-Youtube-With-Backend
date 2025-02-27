import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ThumbsUp, Trash2, Edit2 } from "lucide-react"
import { useState, useEffect, useRef, useCallback } from "react"
import axios from "axios"
import { useSelector } from "react-redux"

export function CommentSection({video}) {

  const {data} = useSelector(state=> state.auth)
  console.log("auth", data)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [newComment, setNewComment] = useState("")
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editContent, setEditContent] = useState("")
  const observer = useRef()

  const lastCommentElementRef = useCallback(node => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1)
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore])

  const fetchComments = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/v1/comments/${video._id}?page=${page}`)
      const newComments = response.data.data.comments
      
      // If it's page 1, replace comments, otherwise append
      if (page === 1) {
        setComments(newComments)
      } else {
        setComments(prev => [...prev, ...newComments])
      }
      
      setHasMore(response.data.data.pagination.hasNextPage)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [page, video._id])

  // Reset everything when video changes
  useEffect(() => {
    setComments([])
    setPage(1)
    setHasMore(true)
  }, [video._id])

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    try {
      const response = await axios.post(`/api/v1/comments/${video._id}`, {
        content: newComment
      })

      // Get the newly created comment with a separate request to ensure we have all fields
      const commentResponse = await axios.get(`/api/v1/comments/${video._id}?page=1&limit=1`)
      const newCommentData = commentResponse.data.data.comments[0]

      // Add new comment to start of comments array
      setComments(prevComments => [newCommentData, ...prevComments])
      setNewComment("")
    } catch (err) {
      console.error("Failed to add comment:", err)
    }
  }

  const handleToggleLike = async (commentId, index) => {
    try {
      await axios.post(`/api/v1/likes/toggle/c/${commentId}`)
      
      // Update the comment's like status and count locally
      setComments(prevComments => {
        const updatedComments = [...prevComments]
        const comment = {...updatedComments[index]}
        comment.isLiked = !comment.isLiked
        comment.likesCount = comment.isLiked 
          ? comment.likesCount + 1 
          : comment.likesCount - 1
        updatedComments[index] = comment
        return updatedComments
      })
    } catch (err) {
      console.error("Failed to toggle like:", err)
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/api/v1/comments/c/${commentId}`)
      setComments(prevComments => prevComments.filter(comment => comment._id !== commentId))
    } catch (err) {
      console.error("Failed to delete comment:", err)
    }
  }

  const handleEditComment = async (commentId) => {
    if (!editContent.trim()) return
    
    try {
      await axios.patch(`/api/v1/comments/c/${commentId}`, {
        content: editContent
      })
      
      setComments(prevComments => prevComments.map(comment => 
        comment._id === commentId 
          ? {...comment, content: editContent}
          : comment
      ))
      setEditingCommentId(null)
      setEditContent("")
    } catch (err) {
      console.error("Failed to update comment:", err)
    }
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold">Comments</h2>
      <div className="mt-4 flex space-x-4">
        <Avatar>
          <AvatarImage src={data?.avatar} alt={data?.fullName} />
          <AvatarFallback>{data?.fullName?.[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <Textarea 
            placeholder="Add a comment..." 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <div className="mt-2 flex justify-end space-x-2">
            <Button variant="ghost" onClick={() => setNewComment("")}>Cancel</Button>
            <Button onClick={handleAddComment}>Comment</Button>
          </div>
        </div>
      </div>
      <div className="mt-6 space-y-4">
        {comments.map((comment, index) => (
          <div 
            key={comment._id} 
            ref={index === comments.length - 1 ? lastCommentElementRef : null}
            className="flex space-x-4"
          >
            <Avatar>
              <AvatarImage src={comment.owner.avatar} alt={comment.owner.fullName} />
              <AvatarFallback>{comment.owner.fullName[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
              <p className="text-sm font-semibold">
                {comment.owner.fullName} 
                <span className="font-normal text-muted-foreground ml-2">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </p>
              {editingCommentId === comment._id ? (
                <div className="mt-1">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="mb-2"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        setEditingCommentId(null)
                        setEditContent("")
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={() => handleEditComment(comment._id)}>
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="mt-1">{comment.content}</p>
              )}
              <div className="mt-1 flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`${comment.isLiked ? 'text-blue-600' : ''}`}
                  onClick={() => handleToggleLike(comment._id, index)}
                >
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  {comment.likesCount}
                </Button>
                {data?._id === comment.owner._id && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingCommentId(comment._id)
                        setEditContent(comment.content)
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteComment(comment._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        {loading && <div>Loading...</div>}
        {error && <div>Error: {error}</div>}
      </div>
    </div>
  )
}
