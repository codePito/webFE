import axiosClient from "./axiosClient";

const authApi = {
    login: (params: {email: string; password: string}) =>
        axiosClient.post("/user/login", null, {
            params: {
                email: params.email,
                password: params.password
            }
        }),

    register: (body: any) =>
        axiosClient.post("/user/register", body),

    getAllUsers: () => axiosClient.get("/users")  // GET list users
};

export default authApi;