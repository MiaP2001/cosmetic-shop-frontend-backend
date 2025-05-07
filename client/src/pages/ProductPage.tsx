import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/ProductPage.module.scss";
import { toast } from "react-toastify";
import type { Product } from "../types/productTypes";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/cart",
        {
          productId: product._id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Product added to cart!");
    } catch (err) {
      console.error("Failed to add to cart", err);
      toast.error("Something went wrong");
    }
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{product.name}</h1>
      <div className={styles.content}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className={styles.image}
        />
        <div className={styles.details}>
          <p>
            <strong>Price:</strong> €{product.price}
          </p>
          <p>
            <strong>Description:</strong> {product.description}
          </p>
          <p>
            <strong>Brand:</strong> {product.brand}
          </p>
          <p>
            <strong>Instruction:</strong> {product.instruction}
          </p>
          <button onClick={handleAddToCart} className={styles.cartButton}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
