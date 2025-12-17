import axios from "axios";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    }, 
});

axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");
        if(token) {
            config.headers.Authorization= `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const {status} = error.response || {};

        if(status == 401) {
            localStorage.removeItem("access_token");
            // window.location.href = "/login";
        }

        return Promise.reject(error);
    } 
);

export default axiosClient;