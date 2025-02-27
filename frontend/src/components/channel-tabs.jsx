import { Button } from "@/components/ui/button"

export function ChannelTabs({ activeTab, onTabChange }) {
  const tabs = ["videos", "playlists", "tweets", "subscribed"]

  return (
    <div className="flex mt-6 border-b w-full overflow-x-auto">
      {tabs.map((tab) => (
        <Button
          key={tab}
          variant="ghost"
          className={`capitalize flex-grow ${activeTab === tab ? "border-b-2 border-primary" : ""}`}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </Button>
      ))}
    </div>
  )
}

