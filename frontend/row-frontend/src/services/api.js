 import axios from "axios";

import { getToken } from "../util/auth";

import { getToken } from "../util/auth";

const API = axios.create({
  baseURL: "http://localhost:8081",
});

API.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = (payload) => API.post("/api/auth/register", payload);
export const login = (payload) => API.post("/api/auth/login", payload);

export const getProducts = (name = "") =>
  API.get(`/v1/products?name=${encodeURIComponent(name)}`);
export const getProductById = (id) => API.get(`/v1/products/${id}`);
export const createProduct = (payload) => API.post("/v1/products", payload);
export const updateProduct = (id, payload) =>
  API.put(`/v1/products/${id}`, payload);
export const deleteProduct = (id) => API.delete(`/v1/products/${id}`);

export const addCartItem = (payload) => API.post("/v1/cart/items", payload);
export const getCart = () => API.get("/v1/cart");
export const removeCartItem = (cartItemId) =>
  API.delete(`/v1/cart/items/${cartItemId}`);

export const placeOrder = () => API.post("/v1/orders");
export const getOrders = () => API.get("/v1/orders");
export const getOrderById = (id) => API.get(`/v1/orders/${id}`);
export const cancelOrder = (id) => API.delete(`/v1/orders/${id}`);

export default API;
