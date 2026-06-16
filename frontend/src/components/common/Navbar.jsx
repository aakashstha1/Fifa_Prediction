import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/useLogout";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LogOut } from "lucide-react";
function Navbar({ role = "user" }) {
  const { mutate: logout, isPending } = useLogout();
  const { user } = useAuth();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const userLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Matches", path: "/matches" },
    { name: "Predictions", path: "/predictions" },
    { name: "My Predictions", path: "/my-predictions" },
  ];

  const adminLinks = [
    { name: "Dashboard", path: "/admin" },
    { name: "Teams", path: "/admin/teams" },
    { name: "Matches", path: "/admin/matches" },
    { name: "Users", path: "/admin/users" },
    { name: "Predictions", path: "/predictions" },
  ];

  const links = role === "admin" ? adminLinks : userLinks;

  return (
    <header className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="font-bold text-lg whitespace-nowrap">
            FIFA Prediction
          </Link>

          {/* Navigation */}
          <nav className="flex flex-wrap items-center gap-4">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium hover:text-black transition ${
                  isActive(link.path)
                    ? "text-black border-b-2 border-black pb-1"
                    : "text-gray-600"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* User Section */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>

              <span className="text-sm font-medium text-gray-700">
                {user?.name}
              </span>
            </div>

            <Button
              variant="destructive"
              onClick={() => logout()}
              disabled={isPending}
            >
              Logout
              <LogOut />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
