import instance from "../confing/AxiosConfig";
import type { SalonFormData, TeamMember } from "../components/types";

export type SalonCreateRequest = SalonFormData & {
  teamMembers: TeamMember[];
};
  
export const createSalon = async (data: SalonCreateRequest) => {
  const res = await instance.post('/salon/create', data);
  return res.data;
};

export const getAllSalons = async () => {
  const res = await instance.get('/salon/')
  return res.data
}

export const getSalonById = async (id: string | number) => {
  const res = await instance.get(`/salon/${id}`);
  return res.data;
}

// ----- owner management -----

export const getMySalon = async () => {
  const res = await instance.get('/salon/me');
  return res.data;
};

export const updateMySalon = async (data: Record<string, unknown>) => {
  const res = await instance.put('/salon/me', data);
  return res.data;
};

export const addService = async (data: Record<string, unknown>) => {
  const res = await instance.post('/salon/me/services', data);
  return res.data;
};

export const updateService = async (id: number | string, data: Record<string, unknown>) => {
  const res = await instance.put(`/salon/me/services/${id}`, data);
  return res.data;
};

export const deleteService = async (id: number | string) => {
  const res = await instance.delete(`/salon/me/services/${id}`);
  return res.data as { archived?: boolean; deleted?: boolean };
};

export const addTeamMember = async (data: { name: string; role: string; specialties?: string }) => {
  const res = await instance.post('/salon/me/team', data);
  return res.data;
};

export const deleteTeamMember = async (id: number | string) => {
  const res = await instance.delete(`/salon/me/team/${id}`);
  return res.data;
};


export const uploadSalonImages = async (files: File[]) => {
  const form = new FormData();
  files.forEach((f) => form.append('images', f));
  const res = await instance.post('/salon/me/images', form);
  return res.data as { images: string[] };
};

export const deleteSalonImage = async (url: string) => {
  const res = await instance.delete('/salon/me/images', { data: { url } });
  return res.data as { images: string[] };
};
