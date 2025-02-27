import { VideoCard } from "@/components/video-card"
import { useState, useEffect, useRef, useCallback } from "react"
import axios from "axios"

export function VideoGrid({channelId}) {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const observer = useRef()
  const lastVideoElementRef = useCallback(node => {
    if (loading) return
    
    if (observer.current) observer.current.disconnect()
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1)
      }
    })
    
    if (node) observer.current.observe(node)
  }, [loading, hasMore])

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`/api/v1/videos?page=${page}&limit=10&sortBy=createdAt&sortType=desc&userId=${channelId}`)
        
        // Filter out any duplicate videos based on _id
        const newVideos = response.data.data.videos
        setVideos(prev => {
          const uniqueVideos = [...prev]
          newVideos.forEach(video => {
            if (!uniqueVideos.find(v => v._id === video._id)) {
              uniqueVideos.push(video)
            }
          })
          return uniqueVideos
        })
        setHasMore(response.data.data.pagination.hasNextPage)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchVideos()
  }, [page, channelId])

  if (error) return <div>Error: {error}</div>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {videos.map((video, index) => {
        if (videos.length === index + 1) {
          return (
            <div ref={lastVideoElementRef} key={video._id}>
              <VideoCard video={video} />
            </div>
          )
        } else {
          return <VideoCard key={video._id} video={video} />
        }
      })}
      {loading && <div className="col-span-full text-center">Loading...</div>}
    </div>
  )
}
