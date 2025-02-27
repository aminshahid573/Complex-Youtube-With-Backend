function VideoLoading(){
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="aspect-video w-full rounded-xl bg-muted overflow-hidden">
              <div className="h-full w-full bg-muted" />
            </div>
            <div className="flex gap-3">
              <div className="h-9 w-9 shrink-0 rounded-full bg-muted" />
              <div className="flex flex-col gap-1 flex-1">
                <div className="line-clamp-2 font-medium">
                  <div className="h-4 w-[80%] rounded bg-muted" />
                </div>
                <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                  <div className="h-3 w-[70%] rounded bg-muted" />
                  <div className="h-3 w-[40%] rounded bg-muted" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
}

export default VideoLoading