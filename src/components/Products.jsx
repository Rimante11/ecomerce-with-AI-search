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
  const [filter, setFilter] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState(new Set()); // Track favorite items

  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
  };

  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
        toast.success("Removed from favorites");
      } else {
        newFavorites.add(productId);
        toast.success("Added to favorites");
      }
      return newFavorites;
    });
  };

  useEffect(() => {
    let componentMounted = true;
    
    const getProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch("/data/products.json");
        if (componentMounted) {
          const products = await response.json();
          
          // Ensure products is an array
          const productsArray = Array.isArray(products) ? products : [];
          
          setData(productsArray);
          setFilter(productsArray);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        if (componentMounted) {
          setLoading(false);
        }
      }
    };

    getProducts();

    return () => {
      componentMounted = false;
    };
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
              All Products
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
                  <Link to={"/product/" + product.id} className="product-image-link">
                    <img
                      className="product-image"
                      src={product.image?.startsWith('/') ? product.image : `/${product.image}`}
                      loading="lazy"
                      decoding="async"
                      alt={product.title}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x500?text=" + encodeURIComponent(product.title);
                      }}
                    />
                  </Link>
                </div>
                <div className="product-info">
                  <h5 className="product-title-all">
                    {product.title}
                  </h5>
                  <div className="product-bottom">
                    <p className="product-price">
                      {product.price} €
                    </p>
                    <div className="product-actions">
                      <button
                        className={`favorite-icon-btn ${favorites.has(product.id) ? 'favorite-active' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavorite(product.id);
                        }}
                      >
                        <i className={`fa ${favorites.has(product.id) ? 'fa-heart' : 'fa-heart-o'}`}></i>
                      </button>
                      <button
                        className="cart-icon-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toast.success("Added to cart");
                          addProduct(product);
                        }}
                      >
                        <i className="fa fa-shopping-bag"></i>
                      </button>
                    </div>
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
      <div id="shop-by-category" className="container my-3 py-3 products-container">
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
