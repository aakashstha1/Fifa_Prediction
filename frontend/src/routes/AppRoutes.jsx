import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "@/layout/MainLayout";

import AdminDashboard from "@/pages/admin/AdminDashboard";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import LandingPage from "@/pages/LandignPage";
import UserDashboard from "@/pages/user/UserDashboard";

import RoleRedirect from "./RoleRedirect";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import NotFound from "@/pages/PageNotFound";
import Team from "@/pages/admin/Team";
import Matches from "@/pages/admin/Matches";
import Users from "@/pages/admin/Users";
import PredictMatches from "@/pages/user/PredictMatches";
import MyPredictions from "@/pages/user/MyPredictions";
import Predictions from "@/components/common/Predictions";
import Tiesheet from "@/components/common/Tiesheet";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* User Routes */}
        <Route
          element={
            <ProtectedRoute roles={["user"]}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/matches" element={<PredictMatches />} />
          <Route path="/my-predictions" element={<MyPredictions />} />
        </Route>

        {/* Admin Routes */}
        <Route
          element={
            <ProtectedRoute roles={["admin"]}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/teams" element={<Team />} />
          <Route path="/admin/matches" element={<Matches />} />
          <Route path="/admin/users" element={<Users />} />
        </Route>

        {/* Shared Routes */}
        <Route
          element={
            <ProtectedRoute roles={["user", "admin"]}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/predictions" element={<Predictions />} />
          <Route path="/bracket" element={<Tiesheet />} />
        </Route>

        {/* Root Route */}
        <Route path="/" element={<RoleRedirect />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
