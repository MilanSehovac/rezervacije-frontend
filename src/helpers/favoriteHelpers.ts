import instance from "../confing/AxiosConfig";
import type { SalonProfile } from "../components/types";

export const getFavoriteIds = async (): Promise<number[]> => {
  const res = await instance.get("/favorites/ids");
  return res.data;
};

export const getFavoriteSalons = async (): Promise<SalonProfile[]> => {
  const res = await instance.get("/favorites");
  return res.data;
};

export const addFavorite = async (salonId: number | string) => {
  await instance.put(`/favorites/${salonId}`);
};

export const removeFavorite = async (salonId: number | string) => {
  await instance.delete(`/favorites/${salonId}`);
};
