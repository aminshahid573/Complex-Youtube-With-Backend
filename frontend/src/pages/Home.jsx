import { useEffect } from "react";
import VideoCard from "../components/VideoCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
const navigate = useNavigate()
    useEffect(()=>{
        const getSession = async () =>{
            try {
                // Try to get current user first
                const currentUserResponse = await axios.get("/api/v1/users/current-user");
                
                if (currentUserResponse.data.statusCode !== 200) {
                    // If current user fails, try refreshing token
                    const refreshResponse = await axios.post("/api/v1/users/refresh-token");
                    
                    if (refreshResponse.data.statusCode === 200) {
                        // Try getting current user again after refresh
                        const userResponse = await axios.get("/api/v1/users/current-user");
                        console.log("Login success after token refresh");
                        console.log("User details:", userResponse.data.data);
                        console.log("Login method: Token refresh");
                    } else {
                        throw new Error("Token refresh failed");
                    }
                    
                } else {
                    console.log("Direct login success");
                    console.log("User details:", currentUserResponse.data.data);
                    console.log("Login method: Direct session");
                }
            } catch (error) {
                console.error("Session verification failed:", error);
                // Redirect to login if session invalid
                navigate('/login')
            }
        }

        getSession()
    },[])
  return (
    <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
  <div className="grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-4 p-4">

    
<VideoCard/>
<VideoCard/>
<VideoCard/>
<VideoCard/>
<VideoCard/>
<VideoCard/>

      </div>
</section>

  );
}

export default Home;
