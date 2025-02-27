export function VideoPlayer({src }) {
    return (
      <div className="aspect-video w-full bg-muted">
        <video
          src={src}
          title="YouTube video player"
          controls
          playsInline
          className="h-full w-full"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    )
  }