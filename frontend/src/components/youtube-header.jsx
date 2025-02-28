import { Bell, Camera, Mic, Search, User, Youtube, Menu } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export function YoutubeHeader() {
  const auth = useSelector((state) => state.auth);
  const [user, setUser] = useState(null);
  let isLoading = auth?.isLoading;

  useEffect(() => {
    if (auth?.data) {
      setUser(auth.data);
    }
  }, [auth?.data]);

  return (
    
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="flex h-16 items-center px-4">
          {/* Logo section */}
          <div className="flex items-center gap-4 md:w-48">
            <SidebarTrigger className="hidden md:flex">
              <Menu className="size-5" />
            </SidebarTrigger>
            <div className="flex ml-10 sm:ml-0 items-center gap-2">
              <Youtube className="size-6 " />
              <span className="hidden font-semibold md:inline-block">
                YouTube
              </span>
            </div>
          </div>

          {/* Search section - desktop */}
          <div className="hidden flex-1 items-center justify-center gap-2 px-4 md:flex">
            <div className="flex w-full max-w-[600px] items-center">
              <div
                className="flex w-full items-center rounded-l-full border bg-muted/50 px-4 ring-offset-background focus-within:ring-1 
              focus:outline-none focus-within:ring-ring"
              >
                <Input
                  type="search"
                  placeholder="Search"
                  noShadow=""
                  className="border-0 focus:outline-none bg-transparent focus-visible:ring-0"
                />
              </div>
              <Button
                type="submit"
                variant="secondary"
                size="icon"
                className="h-10 rounded-l-none rounded-r-full border border-l-0"
              >
                <Search className="size-4" />
                <span className="sr-only">Search</span>
              </Button>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Mic className="size-4" />
              <span className="sr-only">Search with voice</span>
            </Button>
          </div>

          {/* Search button - mobile */}
          <div className="flex flex-1 items-center justify-end gap-2 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Search className="size-5" />
                  <span className="sr-only">Search</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="w-full">
                <div className="flex w-full items-center gap-2 pt-8 h-36 px-2">
                  <div className="flex w-full items-center rounded-full border bg-muted/50 px-4 ring-offset-background focus-within:ring-1 focus-within:ring-ring">
                    <Input
                      type="search"
                      noShadow=""
                      placeholder="Search"
                      className="border-0 bg-transparent 
                    focus:outline-none
                    focus-visible:ring-0"
                    />
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Mic className="size-4" />
                    <span className="sr-only">Search with voice</span>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Actions section */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Camera className="size-5" />
              <span className="sr-only">Create</span>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="size-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            {isLoading ? (
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="size-8">
                  <AvatarFallback>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-500 border-t-transparent" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="size-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
                      <AvatarFallback>
                        <User className="size-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="flex items-center gap-2 p-4">
                    <Avatar className="size-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
                      <AvatarFallback>
                        <User className="size-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.fullName}</span>
                      <span className="text-xs text-muted-foreground">
                        @{user.username}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link to={`/c/${user.username}`}>
                  <DropdownMenuItem>Your Channel</DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem>YouTube Studio</DropdownMenuItem>
                  <DropdownMenuItem>Switch Account</DropdownMenuItem>
                  <DropdownMenuItem>Sign Out</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="icon" className="rounded-full opacity-50 cursor-not-allowed">
                  <Avatar className="size-8">
                    <AvatarFallback>
                      <User className="size-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>
   
  );
}
