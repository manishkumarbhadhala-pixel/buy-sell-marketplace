import axiosInstance from './axiosInstance';

export const getAllUsers = async (token) => {
  const response = await axiosInstance.get('/admin/users', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getAllProductsAdmin = async (token) => {
  const response = await axiosInstance.get('/admin/products', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deleteAnyProduct = async (id, token) => {
  const response = await axiosInstance.delete(`/admin/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deleteUser = async (id, token) => {
  const response = await axiosInstance.delete(`/admin/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const toggleBlockUser = async (id, token) => {
  const response = await axiosInstance.put(`/admin/users/${id}/block`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};