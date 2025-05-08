import { useEffect, useState } from "react";
import { fetchProducts } from "../api/productApi";
import axios from "axios";
import styles from "../styles/ProductList.module.scss";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Filters from "./Filters";
import type { Product } from "../types/productTypes";

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
    };

    loadProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const categoryId =
      typeof product.category === "string"
        ? product.category
        : product.category?._id;

    const matchCategory = selectedCategory
      ? categoryId === selectedCategory
      : true;

    const matchMin = minPrice ? product.price >= Number(minPrice) : true;
    const matchMax = maxPrice ? product.price <= Number(maxPrice) : true;
    const matchSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchCategory && matchMin && matchMax && matchSearch;
  });

  const handleAddToCart = async (productId: string) => {
    try {
      await axios.post(
        "http://localhost:5000/api/cart",
        {
          productId,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Product added to cart!", {
        autoClose: 100,
      });
    } catch (err) {
      console.error("Failed to add to cart", err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.pageTitle}>All Products</h2>

      <Filters
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <ul className={styles.productList}>
        {filteredProducts.map((product) => (
          <li key={product._id} className={styles.card}>
            <Link to={`/products/${product._id}`} className={styles.link}>
              {product.imageUrl && (
                <div className={styles.imageWrapper}>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className={styles.productImage}
                  />
                </div>
              )}
              <h3 className={styles.productTitle}>{product.name}</h3>
              <p className={styles.productPrice}>€{product.price}</p>
              <p className={styles.productDescription}>{product.description}</p>
            </Link>

            <button
              className={styles.addButton}
              onClick={() => handleAddToCart(product._id)}
            >
              Add to Cart
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
