import { api } from "@/configs/axios-config";

export const createTeam = async (data) => {
  const res = await api.post("/teams", data);
  return res.data;
};

export const deleteTeam = async (id) => {
  const res = await api.delete(`/teams/${id}`);
  return res.data;
};
export const getTeams = async () => {
  const res = await api.get("/teams");
  return res.data;
};

export const toggleTeam = async (id) => {
  const res = await api.patch(`/teams/toggle/${id}`);
  return res.data;
};
