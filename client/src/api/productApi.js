import axiosInstance from './axiosInstance';
import API_ENDPOINTS from './endpoint';

const productApi = {

  getAllProducts: async (params = {}) => {
    const res = await axiosInstance.get(API_ENDPOINTS.PRODUCTS.GET_ALL, { params });
    // Transform response for Home.jsx
    if (res.data.success && res.data.data) {
      return {
        data: res.data.data.products,
        totalPages: res.data.data.totalPages
      };
    }
    return res.data;
  },


  getProductById: async (id) => {
    const res = await axiosInstance.get(API_ENDPOINTS.PRODUCTS.GET_BY_ID(id));
    return res.data.data;
  },


  createProduct: async (formData) => {
    const res = await axiosInstance.post(API_ENDPOINTS.PRODUCTS.CREATE, formData);
    return res.data;
  },

  updateProduct: async (id, formData) => {
    const res = await axiosInstance.put(API_ENDPOINTS.PRODUCTS.UPDATE(id), formData);
    return res.data;
  },

  deleteProduct: async (id) => {
    const res = await axiosInstance.delete(API_ENDPOINTS.PRODUCTS.DELETE(id));
    return res.data;
  },

  forceDeleteProduct: async (id) => {
    const res = await axiosInstance.delete(API_ENDPOINTS.PRODUCTS.DELETE(id) + "/force");
    return res.data;
  },

  restoreProduct: async (id) => {
    const res = await axiosInstance.put(API_ENDPOINTS.PRODUCTS.UPDATE(id) + "/restore");
    return res.data;
  },
};

export default productApi;