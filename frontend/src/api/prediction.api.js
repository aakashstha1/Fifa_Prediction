import { api } from "@/configs/axios-config";

export const createPrediction = async (data) => {
  const res = await api.post("/predictions", data);
  console.log(data);
  return res.data;
};

// export const getAllPredictions = async () => {
//   const res = await api.get("/predictions");
//   return res.data;
// };

export const getAllPredictions = async (page = 1, userId, matchId) => {
  const res = await api.get(
    `/predictions?page=${page}&limit=10&userId=${userId || ""}&matchId=${matchId || ""}`,
  );

  return res.data;
};

export const getMyPredictions = async () => {
  const res = await api.get("/predictions/me");
  return res.data;
};
