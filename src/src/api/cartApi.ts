import axiosClient from "./axiosClient";

const cartApi = {
    getCart: () => axiosClient.get("/Cart"),

    addToCart: (productId: number | string, quantity: number) => {
        return axiosClient.post("/Cart", null, {
            params: {
                productId: productId,
                quantity: quantity
            }
        });
    },

    updateQuantity: (itemId: number | string, quantity: number) => {
        return axiosClient.put("/Cart", null, {
                params: {
                itemId: itemId,
                quantity: quantity
            }
        });
    },

    removeFromCart: (itemId: number | string) => {
        return axiosClient.delete(`/Cart/${itemId}`);
    }
};

export default cartApi;