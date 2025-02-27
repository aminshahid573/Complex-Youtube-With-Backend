import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
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

import YoutubeSidebar from "@/components/youtube-sidebar"
import { YoutubeHeader } from "@/components/youtube-header"
import { SidebarProvider } from "@/components/ui/sidebar"
import VideoDetail from "./pages/VideoDetail.jsx";
import ChannelPage from "./pages/ChannelPage.jsx";


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="" element={<Home />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/video/:videoId" element={<VideoDetail />} />
      <Route path="/c/:username" element={<ChannelPage />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <SidebarProvider>
        <div className="relative flex min-h-screen flex-col w-full">
          <YoutubeHeader />
          <div className="flex flex-1">
            <YoutubeSidebar />
            <div className="flex-1 px-4">
              <RouterProvider router={router} />
            </div>
          </div>
        </div>
      </SidebarProvider>
    </Provider>
  </StrictMode>
);
