import { useEffect, useState } from "react";
import { fetchProducts } from "../api/productApi";
import axios from "axios";
import styles from "../styles/ProductList.module.scss";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

type Product = {
  _id: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
};

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
    };

    loadProducts();
  }, []);

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
      toast.success("Product added to cart!");
    } catch (err) {
      console.error("Failed to add to cart", err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div>
      <h2>All Products</h2>
      <ul className={styles.productList}>
        {products.map((product) => (
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
