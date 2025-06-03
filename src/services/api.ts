import axios from 'axios';

const API_URL = 'https://product-manage-1gs3.onrender.com/products'; 

export const getProducts = async (page: number = 1, limit: number = 10000) => {
  const response = await axios.get(`${API_URL}/list`, { params: { page, limit } });
  return response.data.data;
};

export const getProduct = async (id: number) => {
  const response = await axios.get(`${API_URL}/detail/${id}`);
  return response.data;
};

export const createProduct = async (data: FormData) => {
  const response = await axios.post(`${API_URL}/create`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateProduct = async (id: number, data: FormData) => {
  const response = await axios.post(`${API_URL}/update/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteProduct = async (id: number) => {
  const response = await axios.delete(`${API_URL}/delete/${id}`);
  return response.data;
};