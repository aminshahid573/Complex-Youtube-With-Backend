import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  BrowserRouter,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";

import Layout from "./Layout.jsx";
import Home from "./pages/Home.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import Login from "./pages/Login.jsx";
import PublishPage from "./pages/PublishPage.jsx";

import YoutubeSidebar from "@/components/youtube-sidebar"
import { YoutubeHeader } from "@/components/youtube-header"
import { SidebarProvider } from "@/components/ui/sidebar"
import VideoDetail from "./pages/VideoDetail.jsx";
import ChannelPage from "./pages/ChannelPage.jsx";


const AppLayout = () => (
<SidebarProvider>
    <div className="relative flex min-h-screen flex-col w-full">
    <YoutubeHeader />
    <div className="flex flex-1">
        <YoutubeSidebar />
        <div className="flex-1">
        <Layout />
        </div>
    </div>
    </div>
</SidebarProvider>
);

const router = createBrowserRouter(
createRoutesFromElements(
    <Route path="/" element={<AppLayout />}>
    <Route path="" element={<Home />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/login" element={<Login />} />
    <Route path="/video/:videoId" element={<VideoDetail />} />
    <Route path="/c/:username" element={<ChannelPage />} />
    <Route path="/publish-video" element={<PublishPage />} />
    </Route>
)
);

createRoot(document.getElementById("root")).render(
<StrictMode>
    <Provider store={store}>
    <RouterProvider router={router} />
    </Provider>
</StrictMode>
);
