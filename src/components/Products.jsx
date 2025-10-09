import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import "../styles/products.css";

const Products = () => {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(data);
  const [loading, setLoading] = useState(false);
  let componentMounted = true;

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
  };

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("/data/products.json");
        if (componentMounted) {
          const products = await response.json();
          setData(products);
          setFilter(products);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }

      return () => {
        componentMounted = false;
      };
    };

    getProducts();
  }, []);

  const Loading = () => {
    return (
      <>
        <div className="col-12 py-5 text-center">
          <Skeleton height={40} width={560} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
        <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
      </>
    );
  };

  const filterProduct = (cat) => {
    const updatedList = data.filter((item) => item.category === cat);
    setFilter(updatedList);
  };

  const ShowProducts = () => {
    return (
      <>
        <div className="category-links-container py-5">
          <div className="category-links">
            <div 
              className="category-link"
              onClick={() => setFilter(data)}
            >
              ALL PRODUCTS
            </div>
            <div 
              className="category-link"
              onClick={() => filterProduct("men's clothing")}
            >
              Men
            </div>
            <div 
              className="category-link"
              onClick={() => filterProduct("women's clothing")}
            >
              Women
            </div>
            <div 
              className="category-link"
              onClick={() => filterProduct("footwear")}
            >
              FOOTWEAR
            </div>
          </div>
        </div>

        {filter.map((product) => {
          return (
            <div
              id={product.id}
              key={product.id}
              className="col-md-4 col-sm-6 col-xs-8 col-12 mb-5"
            >
              <div className="product-card" key={product.id}>
                <div className="product-image-container">
                  <img
                    className="product-image"
                    src={product.image?.startsWith('/') ? product.image : `/${product.image}`}
                    alt={product.title}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x500?text=" + encodeURIComponent(product.title);
                    }}
                  />
                </div>
                <div className="product-info">
                  <h5 className="product-title">
                    {product.title}
                  </h5>
                  <p className="product-price">
                    ${product.price}
                  </p>
                  <div className="product-buttons">
                    <Link
                      to={"/product/" + product.id}
                      className="btn-custom btn-primary-custom button-buy-now "
                    >
                      Buy Now
                    </Link>
                    <button
                      className="btn-custom btn-secondary-custom button-add-cart"
                      onClick={() => {
                        toast.success("Added to cart");
                        addProduct(product);
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  };
  return (
    <>
      <div className="container my-3 py-3 products-container">
        <div className="row">
          <div className="col-12">
            <h3 className="display-4 text-center heading-3">Shop By Category</h3>
            <hr />
          </div>
        </div>
        <div className="row justify-content-center">
          {loading ? <Loading /> : <ShowProducts />}
        </div>
      </div>
    </>
  );
};

export default Products;
