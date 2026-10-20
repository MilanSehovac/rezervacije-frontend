import instance from "../confing/AxiosConfig";

export type SiteStats = { salons: number; cities: number; completedBookings: number; reviews: number };

export type FeaturedReview = {
  id: number;
  rating: number;
  comment: string;
  author: string;
  salonId: number;
  salonName: string;
  service: string | null;
};

export const getSiteStats = async (): Promise<SiteStats> => (await instance.get("/stats")).data;

export const getRecentReviews = async (): Promise<FeaturedReview[]> => (await instance.get("/reviews/recent")).data;
