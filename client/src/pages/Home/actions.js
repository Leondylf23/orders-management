import { GET_MY_PRODUCTS_DATA, GET_PRODUCTS_DATA, SET_PRODUCTS_DATA } from './constants';

export const getProductsData = (formData) => ({
  type: GET_PRODUCTS_DATA,
  formData,
});

export const getMyProductsData = (formData) => ({
  type: GET_MY_PRODUCTS_DATA,
  formData,
});

export const setProductsData = (data) => ({
  type: SET_PRODUCTS_DATA,
  data,
});
