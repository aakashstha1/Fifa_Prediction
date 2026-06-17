import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { useCreatePrediction } from "@/hooks/predictions/useCreatePrediction";
import { toast } from "sonner";
import Loader from "@/components/common/Loader";
import { toNepalTime } from "@/helper/nepal-time";
import { useGetMatches } from "@/hooks/matches/useGetMatches";
import { useGetMyPredictions } from "@/hooks/predictions/useGetMyPredictions";

function PredictMatches() {
  const { data, isLoading } = useGetMatches();
  const { data: myPredictionsData } = useGetMyPredictions();
  const { mutate: createPrediction, isPending } = useCreatePrediction();

  const matches = data || [];
  const myPredictions = myPredictionsData || [];

  const predictedMatchIds = new Set(
    myPredictions.map((p) => p.match?._id || p.match),
  );

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [predictions, setPredictions] = useState({});
  const [filter, setFilter] = useState("all");

  const handleConfirm = async () => {
    const entries = Object.entries(predictions);
    if (entries.length === 0) {
      toast.error("No predictions selected");
      return;
    }

    try {
      for (const [matchId, teamId] of entries) {
        await createPrediction({ match: matchId, predictedWinner: teamId });
      }
      toast.success("All predictions submitted!");
      setPredictions({});
      setConfirmOpen(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to submit predictions",
      );
    }
  };

  const displayMatches = matches.filter((match) => {
    const isEnded = match.ended;
    const alreadyPredicted = predictedMatchIds.has(match._id);
    if (filter === "predicted") return alreadyPredicted;
    if (filter === "remaining") return !alreadyPredicted && !isEnded;
    return true;
  });

  const totalMatches = matches.length;
  const predictedCount = matches.filter((m) =>
    predictedMatchIds.has(m._id),
  ).length;
  const remainingCount = matches.filter(
    (m) => !predictedMatchIds.has(m._id) && !m.ended,
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-28">
      <h1 className="text-2xl font-bold mb-4">Matches</h1>
      <p className="text-sm text-gray-600 bg-gray-100 border border-gray-200 rounded-md px-3 py-2 mb-4">
        You can now select predictions for multiple matches and submit them all
        at once with a single click.
      </p>

      <div className="flex gap-2 mb-4 flex-wrap">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
        >
          All ({totalMatches})
        </Button>
        <Button
          variant={filter === "predicted" ? "default" : "outline"}
          onClick={() => setFilter("predicted")}
        >
          Predicted ({predictedCount})
        </Button>
        <Button
          variant={filter === "remaining" ? "default" : "outline"}
          onClick={() => setFilter("remaining")}
        >
          Remaining ({remainingCount})
        </Button>
      </div>

      {isLoading ? (
        <Loader />
      ) : displayMatches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-gray-500 text-lg font-semibold">
            No matches found
          </p>
          <p className="text-gray-400 text-sm mt-2">
            {filter === "predicted"
              ? "You haven't predicted any matches yet"
              : filter === "remaining"
                ? "No remaining matches available"
                : "No matches available"}
          </p>
        </div>
      ) : (
        <>
          <Button
            className="mb-4 hidden md:block"
            disabled={Object.keys(predictions).length === 0 || isPending}
            onClick={() => setConfirmOpen(true)}
          >
            Submit All Predictions
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayMatches.map((match) => {
              const isEnded = match.ended;
              const alreadyPredicted = predictedMatchIds.has(match._id);
              const isActive = !isEnded;

              return (
                <Card
                  key={match._id}
                  className="p-4 space-y-3 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${isActive ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
                    />
                    <span className="text-sm font-semibold">
                      Match #{match.matchNo}
                    </span>
                  </div>

                  <div className="flex items-center justify-between font-medium">
                    <span>{match?.team1?.name}</span>
                    <span className="text-xs px-2 py-1 bg-gray-200 rounded-full">
                      vs
                    </span>
                    <span>{match?.team2?.name}</span>
                  </div>

                  {match?.isDraw ? (
                    <div className="text-xs text-green-600 font-semibold">
                      🤝 Draw
                    </div>
                  ) : match?.winningTeam ? (
                    <div className="text-xs text-green-600 font-semibold">
                      🏆 Winner:{" "}
                      {match?.winningTeam?.name || match?.winningTeam}
                    </div>
                  ) : isEnded ? (
                    <div className="text-xs text-gray-500 font-semibold">
                      Match concluded
                    </div>
                  ) : null}

                  <div className="text-xs text-gray-500">
                    {toNepalTime(match?.matchTime)}
                  </div>

                  <div className="space-y-3">
                    {!alreadyPredicted && !isEnded ? (
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <input
                            type="radio"
                            name={`prediction-${match._id}`}
                            value={match.team1._id}
                            checked={predictions[match._id] === match.team1._id}
                            onChange={(e) =>
                              setPredictions((prev) => ({
                                ...prev,
                                [match._id]: e.target.value,
                              }))
                            }
                          />
                          {match.team1.name}
                        </label>
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <input
                            type="radio"
                            name={`prediction-${match._id}`}
                            value={match.team2._id}
                            checked={predictions[match._id] === match.team2._id}
                            onChange={(e) =>
                              setPredictions((prev) => ({
                                ...prev,
                                [match._id]: e.target.value,
                              }))
                            }
                          />
                          {match.team2.name}
                        </label>
                      </div>
                    ) : (
                      <Button className="w-full" disabled>
                        {isEnded ? "Match Ended" : "Already Predicted"}
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="fixed lg:hidden bottom-0 left-0 right-0 p-3 bg-white border-t shadow-md z-50">
            <Button
              className="w-full"
              disabled={Object.keys(predictions).length === 0 || isPending}
              onClick={() => setConfirmOpen(true)}
            >
              Submit All Predictions
            </Button>
          </div>
        </>
      )}

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          </AlertDialogHeader>
          <p className="text-sm text-gray-600">
            You are submitting {Object.keys(predictions).length} predictions.
            Once submitted, they cannot be changed.
          </p>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} disabled={isPending}>
              {isPending ? "Submitting..." : "Yes, Submit"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default PredictMatches;
