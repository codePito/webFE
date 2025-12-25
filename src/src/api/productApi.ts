import axiosClient  from "./axiosClient";

const productApi = {
    getAll: () => axiosClient.get("/products"),                    // GET list
    getById: (id:string) => axiosClient.get(`/product/${id}`),     // GET 1 item
    create: (data: any) => axiosClient.post("/product", data),     // POST 1 item
    update: (id:string, data: any) => axiosClient.put(`/product/${id}`, data),  // PUT 1 item
    delete: (id:string) => axiosClient.delete(`/product/${id}`),   // DELETE 1 item
};

export default productApi;