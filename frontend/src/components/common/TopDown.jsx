import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { useGetUsers } from "@/hooks/users/useGetUsers";
import Loader from "./Loader";
import { useGetMatches } from "@/hooks/matches/useGetMatches";

const getRankStyle = (index) => {
  if (index === 0) return "bg-yellow-100 text-yellow-800";
  if (index === 1) return "bg-gray-200 text-gray-700";
  if (index === 2) return "bg-orange-100 text-orange-700";
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

  const completedMatches = useMemo(() => {
    return (matches || []).filter((match) => match.ended);
  }, [matches]);

  const leaderboard = useMemo(() => {
    return [...(data || [])].sort((a, b) => {
      if ((b.correctPredictions || 0) !== (a.correctPredictions || 0)) {
        return (b.correctPredictions || 0) - (a.correctPredictions || 0);
      }

      // Tie breaker: fewer wrong predictions ranks higher
      return (a.wrongPredictions || 0) - (b.wrongPredictions || 0);
    });
  }, [data]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-10">
      <h1 className="text-2xl font-bold">Leaderboard</h1>

      {!matchesLoading && (
        <p className="font-semibold">
          Matches Completed :
          <span className="font-bold"> {completedMatches.length}</span>
        </p>
      )}

      <Card className="p-4 max-w-6xl mx-auto">
        <h2 className="text-lg font-semibold mb-4">Prediction Leaderboard</h2>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">Rank</th>
                <th className="p-2">User</th>
                <th className="p-2">Correct</th>
                <th className="p-2">Wrong</th>
                <th className="p-2">Accuracy</th>
              </tr>
            </thead>

            <tbody>
              {leaderboard.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-400">
                    No data yet.
                  </td>
                </tr>
              ) : (
                leaderboard.map((user, index) => {
                  const correct = user.correctPredictions || 0;
                  const wrong = user.wrongPredictions || 0;
                  const total = correct + wrong;
                  const accuracy =
                    total > 0 ? ((correct / total) * 100).toFixed(1) : 0;

                  return (
                    <tr
                      key={user._id}
                      className={`border-b ${getRankStyle(index)}`}
                    >
                      <td className="p-2 font-bold">{getMedal(index)}</td>
                      <td className="p-2 font-medium whitespace-nowrap">
                        {user.name}
                      </td>
                      <td className="p-2 text-green-600 font-bold">
                        {correct}
                      </td>
                      <td className="p-2 text-red-600 font-bold">{wrong}</td>
                      <td className="p-2 font-semibold">{accuracy}%</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default TopDown;
