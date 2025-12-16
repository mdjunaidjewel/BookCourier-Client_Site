import React from "react";
import Navbar from "../Navbar/Navbar";
import { Outlet } from "react-router"; //
import Footer from "../Footer/Footer";

const Root = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header / Navbar */}
      <header className="pb-10">
        <Navbar />
      </header>

      {/* Main Content */}
      <main className="flex-1 w-11/12 mx-auto mt-1">
        <Outlet />
      </main>

      {/* Footer */}
      <div className="pt-10">
        <Footer />
      </div>
    </div>
  );
};

export default Root;
