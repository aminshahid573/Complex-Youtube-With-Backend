"use client"
import {
  Home,
  Compass,
  PlaySquare,
  Clock,
  ThumbsUp,
  Flame,
  Music2,
  Gamepad2,
  Trophy,
  Film,
  Newspaper,
  Radio,
  Plus,
  Menu,
  Youtube,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

// Sample subscription data
const subscriptions = [
  { id: 1, name: "Vercel", avatar: "/placeholder.svg?height=32&width=32" },
  { id: 2, name: "Next.js", avatar: "/placeholder.svg?height=32&width=32" },
  { id: 3, name: "React", avatar: "/placeholder.svg?height=32&width=32" },
  { id: 4, name: "TailwindCSS", avatar: "/placeholder.svg?height=32&width=32" },
  { id: 5, name: "ShadcnUI", avatar: "/placeholder.svg?height=32&width=32" },
]

const mainNavItems = [
  { icon: Home, label: "Home" },
  { icon: Compass, label: "Explore" },
  { icon: PlaySquare, label: "Subscriptions" },
]

const libraryItems = [
  { icon: Clock, label: "History" },
  { icon: PlaySquare, label: "Your Videos" },
  { icon: ThumbsUp, label: "Liked Videos" },
]

const exploreItems = [
  { icon: Flame, label: "Trending" },
  { icon: Music2, label: "Music" },
  { icon: Gamepad2, label: "Gaming" },
  { icon: Trophy, label: "Sports" },
  { icon: Film, label: "Movies" },
  { icon: Newspaper, label: "News" },
  { icon: Radio, label: "Live" },
]

// Internal SidebarContent component
function SidebarContentSection() {
  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <SidebarGroup>
        <SidebarMenu>
          {mainNavItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton>
                <item.icon className="size-5" />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>

      <Separator className="my-2" />

      <SidebarGroup>
        <SidebarGroupLabel>Library</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {libraryItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton>
                  <item.icon className="size-5" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <Separator className="my-2" />

      <SidebarGroup>
        <SidebarGroupLabel>Subscriptions</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {subscriptions.map((channel) => (
              <SidebarMenuItem key={channel.id}>
                <SidebarMenuButton>
                  <img src={channel.avatar || "/placeholder.svg"} alt={channel.name} className="size-5 rounded-full" />
                  <span>{channel.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Plus className="size-5" />
                <span>Browse Channels</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <Separator className="my-2" />

      <SidebarGroup>
        <SidebarGroupLabel>Explore</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {exploreItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton>
                  <item.icon className="size-5" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </ScrollArea>
  )
}

// Changed to default export
const YoutubeSidebar = () => {
  return (
    <>
    
      {/* Desktop Sidebar */}
      <Sidebar className="hidden border-r transition-all duration-300 ease-in-out md:flex mt-[4rem]" collapsible="icon">
        <SidebarContent>
          <SidebarContentSection />
        </SidebarContent>
        <SidebarRail />
      </Sidebar>

      {/* Mobile Menu Button */}
      <div className="fixed left-4 top-2 z-50 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mt-1">
              <Menu className="size-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] p-0">
            <div className="flex h-16 items-center gap-2 border-b px-6">
              <Youtube className="size-6" />
              <span className="font-semibold">YouTube</span>
            </div>
            <SidebarContentSection />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}

// Add default export
export default YoutubeSidebar

