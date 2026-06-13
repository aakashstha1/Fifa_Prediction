// import React from "react";
import Navbar from "@/components/common/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { Outlet } from "react-router-dom";

function MainLayout() {
  const { user } = useAuth();
  return (
    <div>
      <header>
        <Navbar role={user?.role} />
      </header>

      <main className="min-h-screen">
        <Outlet />
      </main>

      <footer>
        <p>© 2026 My App</p>
      </footer>
    </div>
  );
}

export default MainLayout;
