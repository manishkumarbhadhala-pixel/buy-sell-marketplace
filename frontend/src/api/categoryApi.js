import axiosInstance from './axiosInstance';

export const getAllCategories = async (token) => {
  const response = await axiosInstance.get('/categories', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const addCategory = async (name, token) => {
  const response = await axiosInstance.post('/categories', { name }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deleteCategory = async (id, token) => {
  const response = await axiosInstance.delete(`/categories/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};