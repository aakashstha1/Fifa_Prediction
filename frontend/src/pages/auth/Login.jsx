import { useState } from "react";
import { useLogin } from "@/hooks/useLogin";
import { Link, useNavigate } from "react-router-dom";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { mutate, isPending } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }
    mutate(
      { email, password },
      {
        onSuccess: (data) => {
          toast.success(data?.message || "Login successful");
          localStorage.setItem("token", data.token);
          const user = data?.user;
          if (user?.role === "admin") {
            navigate("/admin", { replace: true });
          } else {
            navigate("/dashboard", { replace: true });
          }
        },

        onError: (error) => {
          toast.error(error?.response?.data?.message || "Login failed");
        },
      },
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="p-6 w-[360px] space-y-4">
        <h1 className="text-xl font-bold text-center">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label>Password</Label>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Button */}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Logging in..." : "Login"}
          </Button>
        </form>

        {/* Register link */}
        <p className="text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-black font-medium hover:underline"
          >
            Register
          </Link>
        </p>
        <Link
          to="/"
          className="text-sm text-blue-600 hover:underline font-medium text-center"
        >
          ← Back to Home
        </Link>
      </Card>
    </div>
  );
}

export default Login;
