import axios from "axios";

const config = {
    baseURL: 'http://localhost:8000/api/',
    withCredentials: true,
}

const instance = axios.create(config)

export default instance