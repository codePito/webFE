import { LoginRequest, LoginResponse } from "../types";
import axiosClient from "./axiosClient";

const authApi = {
    login: (request: LoginRequest) => {
        return axiosClient.post<LoginResponse>("/user/login", request);
        },

    register: (body: any) =>
        axiosClient.post("/user/register", body),

    getAllUsers: () => axiosClient.get("/users")  // GET list users
};

export default authApi;