import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-white">
      <Navbar />

      <main className="min-w-0 flex-1 bg-white">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default PublicLayout;