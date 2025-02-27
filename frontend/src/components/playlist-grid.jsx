import { Link } from "react-router-dom"

export function PlaylistGrid({ playlists }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {playlists.map((playlist) => (
        <Link href={`/playlist/${playlist.id}`} key={playlist.id} className="group">
          <div className="aspect-video relative overflow-hidden rounded-lg">
            <img
              src={playlist.thumbnail || "/placeholder.svg"}
              alt={playlist.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-white text-center">
                <p className="font-semibold text-lg">{playlist.videoCount}</p>
                <p className="text-sm">VIDEOS</p>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <p className="text-white font-semibold line-clamp-2">{playlist.title}</p>
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

