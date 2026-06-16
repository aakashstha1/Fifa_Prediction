import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetMatches } from "@/hooks/matches/useGetMatches";

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
import { useGetMyPredictions } from "@/hooks/predictions/useGetMyPredictions";

function PredictMatches() {
  const { data, isLoading } = useGetMatches();
  const { data: myPredictions } = useGetMyPredictions();
  const { mutate: createPrediction, isPending } = useCreatePrediction();
  const matches = data || [];

  const predictedMatchIds = new Set(
    (myPredictions || []).map((p) => p.match?._id || p.match),
  );

  const [confirmOpen, setConfirmOpen] = useState(false);
  // FIX 1: Store only the match ID, not the whole object, to avoid stale references
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [predictions, setPredictions] = useState({});
  const [filter, setFilter] = useState("all");

  const handleSubmitClick = (match) => {
    const selectedPrediction = predictions[match._id];

    if (!selectedPrediction) {
      toast.error("Please select a winner");
      return;
    }

    setSelectedMatchId(match._id);
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    // FIX 1 (cont): Look up the fresh match object from live data
    const selectedMatch = matches.find((m) => m._id === selectedMatchId);

    if (!selectedMatch) {
      toast.error("Match not found. Please try again.");
      setConfirmOpen(false);
      return;
    }

    createPrediction(
      {
        match: selectedMatch._id,
        predictedWinner: predictions[selectedMatch._id],
      },
      {
        onSuccess: () => {
          toast.success("Prediction submitted successfully");

          setPredictions((prev) => {
            const updated = { ...prev };
            delete updated[selectedMatch._id];
            return updated;
          });

          setConfirmOpen(false);
          setSelectedMatchId(null);
        },
        // FIX 2: Close dialog on error so user isn't stuck
        onError: (error) => {
          toast.error(error?.response?.data?.message || "Prediction failed");
          setConfirmOpen(false);
          setSelectedMatchId(null);
        },
      },
    );
  };

  const totalMatches = matches.length;

  const predictedCount = matches.filter((m) =>
    predictedMatchIds.has(m._id),
  ).length;

  const remainingCount = matches.filter((m) => {
    const isPredicted = predictedMatchIds.has(m._id);
    return !isPredicted && !m.ended;
  }).length;

  const displayMatches = matches.filter((match) => {
    const isEnded = match.ended;
    const alreadyPredicted = predictedMatchIds.has(match._id);

    if (filter === "predicted") return alreadyPredicted;
    if (filter === "remaining") return !alreadyPredicted && !isEnded;

    return true;
  });

  // FIX 3: Derive selectedMatch fresh from live data for use in the dialog
  const selectedMatch = matches.find((m) => m._id === selectedMatchId);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Matches</h1>
      <div className="flex gap-2 mb-6 flex-wrap">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayMatches.map((match) => {
            const isEnded = match.ended;
            const alreadyPredicted = predictedMatchIds.has(match._id);

            // FIX 4: Show red dot if ended regardless of winningTeam/isDraw being set
            const isActive = !isEnded;

            return (
              <Card
                key={match._id}
                className="p-4 space-y-3 shadow-sm hover:shadow-md transition"
              >
                {/* STATUS */}
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isActive ? "bg-green-500 animate-pulse" : "bg-red-500"
                    }`}
                  />
                  <span className="text-sm font-semibold">
                    Match #{match.matchNo}
                  </span>
                </div>

                {/* TEAMS */}
                <div className="flex items-center justify-between font-medium">
                  <span>{match?.team1?.name}</span>
                  <span className="text-xs px-2 py-1 bg-gray-200 rounded-full">
                    vs
                  </span>
                  <span>{match?.team2?.name}</span>
                </div>

                {/* RESULT */}
                {match?.isDraw ? (
                  <div className="text-xs text-green-600 font-semibold">
                    🤝 Draw
                  </div>
                ) : match?.winningTeam ? (
                  <div className="text-xs text-green-600 font-semibold">
                    🏆 Winner: {match?.winningTeam?.name || match?.winningTeam}
                  </div>
                ) : isEnded ? (
                  // FIX 4 (cont): Handle ended matches with no recorded result
                  <div className="text-xs text-gray-500 font-semibold">
                    Match concluded
                  </div>
                ) : null}

                {/* TIME */}
                <div className="text-xs text-gray-500">
                  {toNepalTime(match?.matchTime)}
                </div>

                {/* PREDICTION */}
                <div className="space-y-3">
                  {!alreadyPredicted && !isEnded ? (
                    <>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <input
                            type="radio"
                            name={`prediction-${match._id}`}
                            disabled={isEnded || alreadyPredicted}
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
                            disabled={isEnded || alreadyPredicted}
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

                      <Button
                        className="w-full"
                        disabled={!predictions[match._id]}
                        onClick={() => handleSubmitClick(match)}
                      >
                        Submit Prediction
                      </Button>
                    </>
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
      )}

      {/* CONFIRM ALERT */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          </AlertDialogHeader>
          <p className="text-sm text-gray-600">
            {selectedMatch
              ? `You are predicting ${
                  predictions[selectedMatchId] === selectedMatch.team1._id
                    ? selectedMatch.team1.name
                    : selectedMatch.team2.name
                } to win Match #${selectedMatch.matchNo}.`
              : "Once submitted, your prediction cannot be undone."}
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
