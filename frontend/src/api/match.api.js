import { api } from "@/configs/axios-config";

export const createMatch = async (data) => {
  const res = await api.post("/matches", data);
  return res.data;
};

export const deleteMatch = async (id) => {
  const res = await api.delete(`/matches/${id}`);
  return res.data;
};
export const getMatches = async () => {
  const res = await api.get("/matches");
  return res.data;
};

export const updateMatch = async ({ id, data }) => {
  const res = await api.patch(`/matches/${id}`, data);
  return res.data;
};
