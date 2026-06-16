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
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [predictions, setPredictions] = useState({});

  // FINAL CONFIRM ACTION
  const handleSubmitClick = (match) => {
    const selectedPrediction = predictions[match._id];

    if (!selectedPrediction) {
      toast.error("Please select a winner");
      return;
    }

    setSelectedMatch(match);
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
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
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message || "Prediction failed");
        },
      },
    );
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">Matches</h1>

      {isLoading ? (
        <Loader />
      ) : matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-gray-500 text-lg font-semibold">
            No matches found
          </p>
          <p className="text-gray-400 text-sm mt-2">Please check back later</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.map((match) => {
            const isEnded = match.ended;
            const alreadyPredicted = predictedMatchIds.has(match._id);

            
            return (
              <Card
                key={match._id}
                className="p-4 space-y-3 shadow-sm hover:shadow-md transition"
              >
                {/* STATUS */}
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isEnded ? "bg-red-500" : "bg-green-500 animate-pulse"
                    }`}
                  ></span>
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
                ) : null}

                {/* TIME */}
                <div className="text-xs text-gray-500">
                  {toNepalTime(match?.matchTime)}
                </div>

                {/* BUTTON */}
                <div className="space-y-3">
                  {!alreadyPredicted && !isEnded ? (
                    <>
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
            Once submitted, your prediction cannot be undone.
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
