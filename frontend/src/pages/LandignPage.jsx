import Rules from "@/components/common/Rules";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl font-bold mb-4">Match Prediction Platform</h1>

      <p className="text-lg text-gray-600 max-w-2xl mb-8">
        Predict match winners, track your prediction accuracy, compete with
        other users, and climb the leaderboard.
      </p>

      <Rules />

      <div className="flex gap-4">
        <Link to="/login" className="px-6 py-3 bg-black text-white rounded-lg">
          Login
        </Link>

        <Link to="/register" className="px-6 py-3 border rounded-lg">
          Register
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;
