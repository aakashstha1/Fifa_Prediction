import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGetMatches } from "@/hooks/matches/useGetMatches";
import { useCreateMatch } from "@/hooks/matches/useCreateMatch";
import { useDeleteMatch } from "@/hooks/matches/useDeleteMatch";
import { useUpdateMatch } from "@/hooks/matches/useUpdateMatch";
import { useGetTeam } from "@/hooks/team/useGetTeam";
import Loader from "@/components/common/Loader";
import { Switch } from "@/components/ui/switch";
import { toNepalTime } from "@/helper/nepal-time";

function Matches() {
  const [matchNo, setMatchNo] = useState("");
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [matchTime, setMatchTime] = useState("");
  const [isDraw, setIsDraw] = useState(false);

  const [open, setOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [winningTeam, setWinningTeam] = useState("");

  const { data, isLoading } = useGetMatches();

  const { mutate: createMatch, isPending: creating } = useCreateMatch();
  const { mutate: deleteMatch } = useDeleteMatch();
  const { mutate: updateMatch } = useUpdateMatch();
  const { data: teamData } = useGetTeam();

  const teams = teamData?.teams || teamData || [];

  const matches = data || [];

  // CREATE MATCH
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!matchNo || !team1 || !team2 || !matchTime) {
      toast.error("All fields are required");
      return;
    }

    createMatch(
      { matchNo, team1, team2, matchTime: matchTime + ":00" },
      {
        onSuccess: () => {
          toast.success("Match created");
          setMatchNo("");
          setTeam1("");
          setTeam2("");
          setMatchTime("");
        },
        onError: (error) => {
          toast.error(
            error?.response?.data?.message || "Match creation failed",
          );
        },
      },
    );
  };

  // OPEN UPDATE DIALOG
  const handleOpenUpdate = (match) => {
    setSelectedMatch(match);
    setWinningTeam(match.winningTeam || "");
    setIsDraw(match.isDraw || false);
    setOpen(true);
  };

  // SUBMIT WINNER
  const handleUpdate = () => {
    if (!isDraw && !winningTeam) {
      toast.error("Select winning team or mark draw");
      return;
    }

    updateMatch(
      {
        id: selectedMatch._id,
        data: {
          teamId: isDraw ? null : winningTeam,
          isDraw,
        },
      },
      {
        onSuccess: () => {
          toast.success("Match updated");
          setOpen(false);
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message || "Match update failed");
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row gap-6 p-6">
      {/* LEFT - CREATE MATCH */}
      <div className="md:w-1/2 flex justify-center items-start">
        <Card className="w-[420px] p-6 space-y-4 shadow-md">
          <h1 className="text-xl font-bold text-center">Create Match</h1>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <Label>Match No</Label>
              <Input
                value={matchNo}
                onChange={(e) => setMatchNo(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label>Team 1</Label>
              <select
                className="w-full border rounded-md p-2"
                value={team1}
                onChange={(e) => setTeam1(e.target.value)}
              >
                <option value="">Select Team 1</option>
                {teams.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <Label>Team 2</Label>
              <select
                className="w-full border rounded-md p-2"
                value={team2}
                onChange={(e) => setTeam2(e.target.value)}
              >
                <option value="">Select Team 2</option>
                {teams.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <Label>Match Date & Time</Label>
              <Input
                type="datetime-local"
                value={matchTime}
                onChange={(e) => setMatchTime(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={creating}>
              {creating ? "Creating..." : "Create"}
            </Button>
          </form>
        </Card>
      </div>

      {/* RIGHT - MATCH LIST */}
      <div className="md:w-1/2">
        <Card className="p-6 shadow-md">
          <h2 className="text-xl font-bold mb-4">Matches</h2>

          <div className="max-h-[500px] overflow-y-auto space-y-3 pr-2">
            {isLoading ? (
              <Loader />
            ) : matches.length === 0 ? (
              <p className="text-gray-500">No matches found</p>
            ) : (
              matches.map((match) => (
                <div
                  key={match._id}
                  className={`p-3 border rounded-md flex justify-between items-center ${
                    match?.ended
                      ? "bg-red-50 border-red-300"
                      : "bg-green-50 border-green-300"
                  }`}
                >
                  {/* LEFT SIDE INFO */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      {/* STATUS DOT */}
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          match?.ended
                            ? "bg-red-500"
                            : "bg-green-500 animate-pulse"
                        }`}
                      ></span>

                      <span className="text-sm font-semibold">
                        Match #{match?.matchNo}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-medium">
                      <span>{match?.team1?.name}</span>

                      <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-700">
                        vs
                      </span>

                      <span>{match?.team2?.name}</span>

                      {/* RESULT */}
                      {match?.isDraw ? (
                        <span className="ml-2 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 font-semibold">
                          🤝 Draw
                        </span>
                      ) : match?.winningTeam ? (
                        <span className="ml-2 px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 font-semibold">
                          🏆 {match?.winningTeam?.name || match?.winningTeam}
                        </span>
                      ) : null}
                    </div>

                    {/* MATCH TIME */}
                    <span className="text-xs text-gray-600">
                      {toNepalTime(match?.matchTime)}
                    </span>
                  </div>

                  {/* RIGHT SIDE BUTTONS */}
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleOpenUpdate(match)}>
                      Update
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        deleteMatch(match._id, {
                          onSuccess: () => toast.success("Match deleted"),
                        })
                      }
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* UPDATE DIALOG */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Winning Team</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-between border p-3 rounded-md">
              <span className="font-medium">Mark as Draw</span>

              <Switch
                checked={isDraw}
                onCheckedChange={(val) => {
                  setIsDraw(val);
                  if (val) setWinningTeam(""); // reset winner if draw
                }}
              />
            </div>

            {/* TEAM SELECT */}
            <select
              className="w-full border rounded-md p-2"
              value={winningTeam}
              disabled={isDraw}
              onChange={(e) => setWinningTeam(e.target.value)}
            >
              <option value="">Select Winning Team</option>

              <option value={selectedMatch?.team1?._id}>
                {selectedMatch?.team1?.name}
              </option>

              <option value={selectedMatch?.team2?._id}>
                {selectedMatch?.team2?.name}
              </option>
            </select>

            <Button onClick={handleUpdate} className="w-full">
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Matches;
