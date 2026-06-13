import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import { useCreateTeam } from "@/hooks/team/useCreateTeam";
import { useDeleteTeam } from "@/hooks/team/useDeleteTeam";
import { useGetTeam } from "@/hooks/team/useGetTeam";
import Loader from "@/components/common/Loader";
import { useUpdateTeamStatus } from "@/hooks/team/useUpdateTeamStatus";
import { Switch } from "@/components/ui/switch";

function Team() {
  const [teamName, setTeamName] = useState("");
  const { data, isLoading } = useGetTeam();

  const teams = data || [];

  const { mutate: createTeam, isPending: creating } = useCreateTeam();
  const { mutate: deleteTeam, isPending: deleting } = useDeleteTeam();
  const { mutate: toggleTeamStatus, isPending: toggling } =
    useUpdateTeamStatus();

  if (isLoading) return <Loader />;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!teamName.trim()) {
      toast.error("Team name is required");
      return;
    }

    createTeam(
      { name: teamName },
      {
        onSuccess: () => {
          toast.success("Team created successfully");
          setTeamName("");
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row gap-6 p-6">
      {/* LEFT - CREATE TEAM */}
      <div className="md:w-1/2 flex justify-center items-start">
        <Card className="w-[380px] p-6 space-y-5 shadow-md">
          <h1 className="text-xl font-bold text-center">Create Team</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Team Name</Label>
              <Input
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter team name"
              />
            </div>

            <Button type="submit" className="w-full" disabled={creating}>
              {creating ? "Creating..." : "Create"}
            </Button>
          </form>
        </Card>
      </div>

      {/* RIGHT - TEAM LIST */}
      <div className="md:w-1/2">
        <Card className="p-6 shadow-md">
          <h2 className="text-xl font-bold mb-4">Teams</h2>

          {teams.length === 0 ? (
            <p className="text-gray-500">No teams found</p>
          ) : (
            <ul className="space-y-3">
              {teams.map((team) => (
                <li
                  key={team._id}
                  className="flex justify-between items-center p-3 border rounded-md bg-white"
                >
                  {/* LEFT SIDE */}
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{team.name}</span>

                    {/* STATUS BADGE */}
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        team.isOut
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {team.isOut ? "Out" : "Active"}
                    </span>
                  </div>

                  {/* RIGHT SIDE - SWITCH + DELETE */}
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={team.isOut}
                      disabled={toggling}
                      onCheckedChange={() => toggleTeamStatus(team._id)}
                    />

                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={deleting}
                      onClick={() =>
                        deleteTeam(team._id, {
                          onSuccess: () => toast.success("Team deleted"),
                        })
                      }
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

export default Team;
