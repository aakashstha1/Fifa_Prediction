import { api } from "@/configs/axios-config";

export const createPrediction = async (data) => {
  const res = await api.post("/predictions", data);
  return res.data;
};

// export const getAllPredictions = async () => {
//   const res = await api.get("/predictions");
//   return res.data;
// };

export const getAllPredictions = async (page, userId, matchId) => {
  const { data } = await api.get("/predictions", {
    params: {
      page,
      limit: 20,
      ...(userId && { userId }),
      ...(matchId && { matchId }),
    },
  });
  return data;
};

export const getMyPredictions = async () => {
  const res = await api.get("/predictions/me");
  return res.data;
};
