import { useEffect, useState } from "react";
import axios from "axios";
import { VideoCard } from "@/components/video-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";

// Sample video data
const videos = [
  {
    id: 1,
    title: "Building a YouTube Clone with React and Tailwind CSS",
    thumbnail: "https://placehold.co/600x400",
    duration: "15:23",
    channel: {
      name: "Dev Tutorials",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    views: "1.2M",
    uploadedAt: "2 weeks ago",
  },
  {
    id: 2,
    title: "Next.js 13 Crash Course: App Router, Server Components and More",
    thumbnail: "https://placehold.co/600x400",
    duration: "22:47",
    channel: {
      name: "Next.js Official",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    views: "500K",
    uploadedAt: "3 days ago",
  },
  {
    id: 3,
    title: "Mastering Tailwind CSS: Advanced Techniques and Best Practices",
    thumbnail: "https://placehold.co/600x400",
    duration: "18:39",
    channel: {
      name: "CSS Wizards",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    views: "750K",
    uploadedAt: "1 week ago",
  },
  {
    id: 4,
    title: "React Performance Optimization: Tips and Tricks",
    thumbnail: "https://placehold.co/600x400",
    duration: "12:55",
    channel: {
      name: "React Masters",
      avatar: "ddfd",
    },
    views: "300K",
    uploadedAt: "5 days ago",
  },
  {
    id: 5,
    title: "Building Accessible Web Applications: A Comprehensive Guide",
    thumbnail: "https://placehold.co/600x400",
    duration: "28:16",
    channel: {
      name: "Web A11y",
      avatar: "ddd",
    },
    views: "200K",
    uploadedAt: "1 month ago",
  },
  {
    id: 6,
    title: "TypeScript for Beginners: From Zero to Hero",
    thumbnail: "https://placehold.co/600x400",
    duration: "45:32",
    channel: {
      name: "TypeScript Tutorials",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    views: "1M",
    uploadedAt: "2 months ago",
  },
];

function Home() {
  const [user, setUser] = useState(null);
  const [showLoginBanner, setShowLoginBanner] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await axios.get("/api/v1/users/current-user");
        setUser(response.data);
        dispatch(loginSuccess(response.data));
      } catch (error) {
        // If current-user fails, try refreshing token
        try {
          await axios.post("/api/v1/users/refresh-token");
          // Try getting current user again after token refresh
          const retryResponse = await axios.get("/api/v1/users/current-user");
          setUser(retryResponse.data);
          dispatch(loginSuccess(retryResponse.data));
        } catch (refreshError) {
          // If both attempts fail, show login banner
          setShowLoginBanner(true);
        }
      }
    };

    getCurrentUser();
  }, [dispatch]);

  

  return (
    <div>
      {showLoginBanner && (
        <Alert className="mb-4">
          <AlertTitle>Not logged in</AlertTitle>
          <AlertDescription>
            Please <Link to="/login" className="font-medium underline">log in</Link> to access all features
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid mt-3 ml-3 grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}

export default Home;
