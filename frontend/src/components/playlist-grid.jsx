import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"

export function PlaylistGrid({ channelId }) {
  const [playlists, setPlaylists] = useState([])

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get(`/api/v1/playlist/user/${channelId}`)
        setPlaylists(response.data.data)
      } catch (error) {
        console.error("Error fetching playlists:", error)
      }
    }

    if (channelId) {
      fetchPlaylists()
    }
  }, [channelId])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {playlists.map((playlist) => (
        <Link to={`/playlist/${playlist._id}`} key={playlist._id} className="group">
          <div className="aspect-video relative overflow-hidden rounded-lg">
            <img
              src={"/placeholder.svg"}
              alt={playlist.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-white text-center">
                <p className="font-semibold text-lg">{playlist.videos.length}</p>
                <p className="text-sm">VIDEOS</p>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <p className="text-white font-semibold line-clamp-2">{playlist.name}</p>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-sm text-muted-foreground">View full playlist</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
