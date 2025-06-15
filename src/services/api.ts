import axios from 'axios';
import { getAuthHeaders, getCurrentUser } from './auth';

const API_URL = 'https://product-manage-1gs3.onrender.com/products';

const createAuthenticatedRequest = () => {
  return axios.create({
    headers: getAuthHeaders(),
  });
};

export const getProducts = async (page: number = 1, limit: number = 4, search?: string) => {
  try {
    const response = await axios.get(`${API_URL}/list`, {
      params: { page, limit, search },
    });
    return {
      data: response.data.data.data,
      total: response.data.data.total
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch products');
  }
};

export const getProduct = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/detail/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch product');
  }
};

export const createProduct = async (data: FormData) => {
  try {
    const authenticatedAxios = createAuthenticatedRequest();
    const response = await authenticatedAxios.post(`${API_URL}/create`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please login first.');
    }
    throw new Error(error.response?.data?.message || 'Failed to create product');
  }
};

export const updateProduct = async (id: number, data: FormData) => {
  try {
    const authenticatedAxios = createAuthenticatedRequest();
    const response = await authenticatedAxios.post(`${API_URL}/update/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please login first.');
    }
    throw new Error(error.response?.data?.message || 'Failed to update product');
  }
};

export const deleteProduct = async (id: number) => {
  try {
    const authenticatedAxios = createAuthenticatedRequest();
    const response = await authenticatedAxios.delete(`${API_URL}/delete/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Authentication required. Please login first.');
    }
    throw new Error(error.response?.data?.message || 'Failed to delete product');
  }
};

export const canPerformAdminActions = (): boolean => {
  try {
    const user = getCurrentUser();
    return user?.role === 'admin';
  } catch {
    return false;
  }
};

export const isUserLoggedIn = (): boolean => {
  const headers = getAuthHeaders();
  return Object.keys(headers).length > 0;
};

export const handleAuthError = (error: any) => {
  if (error.response?.status === 401) {
    window.location.href = '/login';
  }
};