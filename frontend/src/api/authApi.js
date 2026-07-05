import axiosInstance from './axiosInstance';

export const signupUser = async (formData) => {
  const response = await axiosInstance.post('/auth/signup', formData);
  return response.data;
};

export const loginUser = async (formData) => {
  const response = await axiosInstance.post('/auth/login', formData);
  return response.data;
};