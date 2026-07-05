import axiosInstance from './axiosInstance';

export const getAllProducts = async (token, categoryId, search) => {
  const params = {};
  if (categoryId) params.category_id = categoryId;
  if (search) params.search = search;

  const response = await axiosInstance.get('/products/all', {
    headers: { Authorization: `Bearer ${token}` },
    params
  });
  return response.data;
};

export const getProductById = async (id, token) => {
  const response = await axiosInstance.get(`/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const addProduct = async (formData, token) => {
  const response = await axiosInstance.post('/products/add', formData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const getMyProducts = async (token) => {
  const response = await axiosInstance.get('/products/my-products', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updateProduct = async (id, formData, token) => {
  const response = await axiosInstance.put(`/products/${id}`, formData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deleteProduct = async (id, token) => {
  const response = await axiosInstance.delete(`/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};