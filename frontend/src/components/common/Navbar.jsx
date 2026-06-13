import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useLogout } from "@/hooks/useLogout";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
function Navbar({ role = "user" }) {
  const [open, setOpen] = useState(false);
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
      {" "}
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="font-bold text-lg">
          FIFA Prediction
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6 items-center">
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

          <div className="flex items-center gap-3">
            {/* USER INFO */}
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

            {/* LOGOUT */}
            <Button
              variant="destructive"
              onClick={() => logout()}
              disabled={isPending}
            >
              Logout
            </Button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-4 mt-6 p-4">
                {links.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setOpen(false)}
                    className={`text-sm font-medium ${
                      isActive(link.path)
                        ? "text-black underline"
                        : "text-gray-600"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}

                <div className="mt-6 border-t pt-4 flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <span className="text-sm font-medium">{user?.name}</span>
                </div>

                <Button
                  className="mt-4"
                  variant="destructive"
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  disabled={isPending}
                >
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
