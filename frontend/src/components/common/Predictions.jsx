import { useState } from "react";
import { Card } from "@/components/ui/card";
import Loader from "@/components/common/Loader";
import { useGetAllPredictions } from "@/hooks/predictions/useGetAllPredictions";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "@/components/ui/button";
import { useGetMatches } from "@/hooks/matches/useGetMatches";
import { useGetUsers } from "@/hooks/users/useGetUsers";
import { toNepalTime } from "@/helper/nepal-time";

function Predictions() {
  const [userId, setUserId] = useState("");
  const [matchId, setMatchId] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useGetAllPredictions(
    userId,
    matchId,
    page,
  );

  const { data: usersData } = useGetUsers();
  const { data: matchesData } = useGetMatches();

  const users = usersData || [];
  const matches = matchesData || [];

  const predictions = data?.data || [];
  const hasMore = data?.hasMore;
  const isPageLoading = isFetching;
  const totalPredictions = data?.total;
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">All Predictions</h1>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <select
          className="border p-2 rounded-md w-full sm:w-auto"
          value={userId}
          onChange={(e) => {
            setUserId(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Users</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded-md w-full sm:w-auto"
          value={matchId}
          onChange={(e) => {
            setMatchId(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Matches</option>
          {matches.map((m) => (
            <option key={m._id} value={m._id}>
              Match #{m.matchNo}
            </option>
          ))}
        </select>
        <p className="flex items-center">
          Total Predictions:{" "}
          <span className="font-bold">{totalPredictions}</span>
        </p>
      </div>

      {/* LIST */}
      {predictions.length === 0 ? (
        <p className="text-gray-500">No predictions found</p>
      ) : (
        <>
          <div className="space-y-3 max-w-7xl mx-auto">
            {predictions.map((prediction) => {
              const match = prediction.match;

              const isResolved = Boolean(match?.ended);

              const isDraw = match?.isDraw === true;

              const winnerId = match?.winningTeam?._id || match?.winningTeam;

              const predictedId =
                prediction?.predictedWinner?._id || prediction?.predictedWinner;

              // ==========================
              // FIXED RESULT LOGIC
              // ==========================
              let isCorrect = false;

              if (isResolved) {
                if (isDraw) {
                  // DRAW CASE LOGIC
                  isCorrect = false; // or handle separately if you want
                } else {
                  // WIN CASE
                  isCorrect = String(winnerId) === String(predictedId);
                }
              }

              return (
                <Card
                  key={prediction._id}
                  className="p-4 hover:shadow-md transition"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* LEFT */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-lg flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="" />
                            <AvatarFallback>
                              {prediction?.user?.name?.[0]}
                            </AvatarFallback>
                          </Avatar>

                          {prediction?.user?.name}
                        </span>

                        {isResolved ? (
                          isDraw ? (
                            <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                              🤝 Draw
                            </span>
                          ) : isCorrect ? (
                            <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                              ✅ Correct
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">
                              ❌ Wrong
                            </span>
                          )
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
                            ⏳ Pending
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-6 text-sm">
                        <span className="font-medium">
                          Match #{match?.matchNo}
                        </span>

                        <span>{match?.team1?.name}</span>

                        <span className="px-2 py-0.5 rounded-full bg-gray-200 text-xs">
                          vs
                        </span>

                        <span>{match?.team2?.name}</span>
                      </div>
                    </div>

                    {/* CENTER */}
                    <div className="min-w-[200px]">
                      <p className="text-xs text-gray-500">Predicted Winner</p>
                      <p className="font-semibold">
                        {prediction?.predictedWinner?.name}
                      </p>
                    </div>

                    {/* RIGHT */}
                    <div className="min-w-[200px]">
                      <p className="text-xs text-gray-500">Actual Winner</p>
                      <p className="font-semibold text-green-600">
                        {match?.winningTeam?.name ||
                          (match?.isDraw && "🤝 Draw") ||
                          "-"}
                      </p>
                    </div>

                    {/* TIME */}
                    <div className="text-sm text-gray-500 min-w-[180px] text-right">
                      {match?.matchTime && toNepalTime(match?.matchTime)}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* LOAD MORE */}
          <div className="flex justify-center gap-2 mt-6">
            <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Prev
            </Button>

            <span className="px-3 py-2 text-sm">Page {page}</span>

            <Button
              disabled={!hasMore || isPageLoading}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default Predictions;
