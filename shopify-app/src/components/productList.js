import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/actions";

const ProductList = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <div>
      <h2>Product List</h2>
      <div className="list-container">
        {products.map((product) => (
          <div key={product.id} className="list-container__item">
            <img
              src={product.images[0]}
              alt={product.id}
              className="list-container__img"
            />
            <div
              dangerouslySetInnerHTML={{
                __html: product.bodyHtml.substring(0, 100),
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
