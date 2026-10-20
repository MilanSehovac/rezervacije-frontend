import axios from "axios";

const config = {
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    withCredentials: true,
}

const instance = axios.create(config)

export default instance
