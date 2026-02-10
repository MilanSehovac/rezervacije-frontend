import instance from "../confing/AxiosConfig";
import type { UserFormData } from '../components/types/UserProfile'

export const updateUserProfile = async (formData: UserFormData) => {
    const res = await instance.put('/users/me', formData)
    return res.data
}