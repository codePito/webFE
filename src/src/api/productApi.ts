import axiosClient  from "./axiosClient";

const productApi = {
    getAll: () => axiosClient.get("/Product"),
    getById: (id:string) => axiosClient.get(`/Product/${id}`),
    create: (data: any) => axiosClient.post("/Product", data),
    update: (id:string, data: any) => axiosClient.put(`/Product/${id}`, data),
    delete: (id:string) => axiosClient.delete(`/Product/${id}`),
};

export default productApi;