import Loader from "@/components/common/Loader";
import { Card } from "@/components/ui/card";
import { useGetMyPredictions } from "@/hooks/predictions/useGetMyPredictions";
import { useAuth } from "@/hooks/useAuth";
import { toNepalTime } from "@/helper/nepal-time";

function MyPredictions() {
  const { data, isLoading } = useGetMyPredictions();
  const { user } = useAuth();
  const predictions = data || [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">My Predictions</h1>
      <div className="flex items-center gap-10">
        {" "}
        <div className="mb-6 text-gray-600">
          Correct Predictions:{" "}
          <span className="font-bold text-green-600">
            {user?.correctPredictions}
          </span>{" "}
          / {data?.length}
        </div>
        <div className="mb-6 text-gray-600">
          Wrong Predictions:{" "}
          <span className="font-bold text-red-600">
            {user?.wrongPredictions}
          </span>{" "}
          / {data?.length}
        </div>
      </div>

      {isLoading ? (
        <Loader />
      ) : predictions.length === 0 ? (
        <p className="text-gray-500">No predictions found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {predictions.map((p) => {
            const match = p.match;

            const winnerId = match?.winningTeam?._id || match?.winningTeam;
            const predictedId = p?.predictedWinner?._id || p?.predictedWinner;

            const isResolved = Boolean(match?.ended);
            const isDraw = match?.isDraw === true;
            let isCorrect = false;

            if (isResolved) {
              if (isDraw) {
                isCorrect = false; // draw is neutral (not correct/wrong)
              } else {
                isCorrect = String(winnerId) === String(predictedId);
              }
            }
            return (
              <Card
                key={p._id}
                className="p-4 space-y-3 shadow-sm hover:shadow-md transition"
              >
                {/* HEADER */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-600">
                    Match #{match?.matchNo}
                  </span>

                  {/* STATUS */}
                  {isResolved ? (
                    isDraw ? (
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                        🤝 Draw
                      </span>
                    ) : isCorrect ? (
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                        Correct ✓
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">
                        Wrong ✕
                      </span>
                    )
                  ) : (
                    <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
                      Pending
                    </span>
                  )}
                </div>

                {/* TEAMS */}
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>{match?.team1?.name}</span>

                  <span className="text-xs px-2 py-0.5 bg-gray-200 rounded-full">
                    vs
                  </span>

                  <span>{match?.team2?.name}</span>
                </div>

                {/* MY PREDICTION */}
                <div className="text-sm text-gray-700">
                  My Prediction:
                  <span className="ml-1 font-semibold">
                    {p?.predictedWinner?.name}
                  </span>
                </div>

                {/* WINNER (if available) */}
                {match?.winningTeam && (
                  <div className="text-sm text-gray-700">
                    Winner:
                    <span className="ml-1 font-semibold text-green-600">
                      {match?.winningTeam?.name || "Unknown"}
                    </span>
                  </div>
                )}

                {/* TIME */}
                <div className="text-xs text-gray-500">
                  {match?.matchTime && toNepalTime(match?.matchTime)}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyPredictions;
