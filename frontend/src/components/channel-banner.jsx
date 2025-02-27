export function ChannelBanner({ src }) {
    return (
      <div className="h-40 md:h-56 lg:h-64 w-full overflow-hidden">
        <img src={src || "/placeholder.svg"} alt="Channel Banner" className="w-full h-full object-cover" />
      </div>
    )
  }
  
  