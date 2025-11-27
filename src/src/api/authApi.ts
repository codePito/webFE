import axiosClient from "./axiosClient";

const authApi = {
    login: (body: {email: string; password: string}) =>
        axiosClient.post("/User/login", body),

    register: (body: any) =>
        axiosClient.post("/User/register", body),
};

export default authApi;