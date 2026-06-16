import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { useGetUsers } from "@/hooks/users/useGetUsers";
import Loader from "./Loader";
import { useGetMatches } from "@/hooks/matches/useGetMatches";

const getRankStyle = (index) => {
  if (index === 0) return "bg-yellow-100 text-yellow-800"; // gold
  if (index === 1) return "bg-gray-200 text-gray-700"; // silver
  if (index === 2) return "bg-orange-100 text-orange-700"; // bronze
  return "";
};

const getMedal = (index) => {
  if (index === 0) return "🥇";
  if (index === 1) return "🥈";
  if (index === 2) return "🥉";
  return `${index + 1}`;
};
function TopDown() {
  const { data, isLoading } = useGetUsers();
  const { data: matches, isLoading: matchesLoading } = useGetMatches();

  const users = useMemo(() => data || [], [data]);

  // sort by correct predictions
  const sortedCorrect = useMemo(() => {
    return [...users].sort(
      (a, b) => (b.correctPredictions || 0) - (a.correctPredictions || 0),
    );
  }, [users]);

  // sort by wrong predictions
  const sortedWrong = useMemo(() => {
    return [...users].sort(
      (a, b) => (b.wrongPredictions || 0) - (a.wrongPredictions || 0),
    );
  }, [users]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-10 ">
      <h1 className="text-2xl font-bold">Leaderboard</h1>
      {!matchesLoading && (
        <p className="font-semibold">
          Matches Completed :
          <span classname="font-bold"> {matches?.length}</span>
        </p>
      )}

      {/* ---------------- CORRECT TABLE ---------------- */}
      <Card className="p-4 max-w-6xl mx-auto">
        <h2 className="text-lg font-semibold mb-4 text-green-700 ">
          Top Correct Predictions
        </h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Rank</th>
              <th className="p-2">User</th>
              <th className="p-2">Correct</th>
            </tr>
          </thead>

          <tbody>
            {sortedCorrect.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-6 text-center text-gray-400">
                  No data yet.
                </td>
              </tr>
            ) : (
              sortedCorrect.map((user, index) => (
                <tr
                  key={user._id}
                  className={`border-b ${getRankStyle(index)} transition`}
                >
                  <td className="p-2 font-bold">{getMedal(index)}</td>

                  <td className="p-2 font-medium">{user.name}</td>

                  <td className="p-2 text-green-600 font-bold">
                    {user.correctPredictions || 0}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      {/* ---------------- WRONG TABLE ---------------- */}
      <Card className="p-4 max-w-6xl mx-auto">
        <h2 className="text-lg font-semibold mb-4 text-red-700">
          Top Wrong Predictions
        </h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Rank</th>
              <th className="p-2">User</th>
              <th className="p-2">Wrong</th>
            </tr>
          </thead>

          <tbody>
            {sortedWrong.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-6 text-center text-gray-400">
                  No data yet.
                </td>
              </tr>
            ) : (
              sortedWrong.map((user, index) => (
                <tr
                  key={user._id}
                  className={`border-b ${getRankStyle(index)} transition`}
                >
                  <td className="p-2 font-bold">{getMedal(index)}</td>

                  <td className="p-2 font-medium">{user.name}</td>

                  <td className="p-2 text-red-600 font-bold">
                    {user.wrongPredictions || 0}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export default TopDown;
