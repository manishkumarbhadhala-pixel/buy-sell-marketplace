import axiosInstance from './axiosInstance';

export const getAllCategories = async (token) => {
  const response = await axiosInstance.get('/categories', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};