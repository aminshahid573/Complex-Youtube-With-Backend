export function VideoPlayer({ videoId }) {
    return (
      <div className="aspect-video w-full bg-muted">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        ></iframe>
      </div>
    )
  }
  
  