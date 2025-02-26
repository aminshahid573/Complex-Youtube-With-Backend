import { Outlet } from "react-router-dom";
import Header from "./components/Header.jsx"
function Layout(){
    return(
        <div className="h-screen overflow-y-auto bg-[#121212] text-white">
        <Header/>
        <Outlet />
        </div>
    )
}

export default Layout