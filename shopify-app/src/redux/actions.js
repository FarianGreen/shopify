import axios from "axios";

export const FETCH_PRODUCTS_SUCCESS = "FETCH_PRODUCTS_SUCCESS";

export const fetchProductsSuccess = (products) => ({
  type: FETCH_PRODUCTS_SUCCESS,
  payload: products,
});

export const fetchProducts = () => async (dispatch) => {
  try {
    const response = await axios.get("http://localhost:3001/api/products");
    dispatch(fetchProductsSuccess(response.data));
  } catch (error) {
    console.error("Error fetching products", error);
  }
};
