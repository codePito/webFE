import { create } from "domain";
import axiosClient from "./axiosClient";

const categoryApi = {
    getAll: () => axiosClient.get("/categories"),        // GET list
    create: (data:any) => axiosClient.post("/category", data),     // POST 1 item
    update: (id:string, data:any) => axiosClient.put(`/category/${id}`, data),  // PUT 1 item
    delete: (id:string) => axiosClient.delete(`/category/${id}`),  // DELETE 1 item
};

export default categoryApi;