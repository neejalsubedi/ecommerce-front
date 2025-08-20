import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-indigo-200 overflow-y-auto ">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
