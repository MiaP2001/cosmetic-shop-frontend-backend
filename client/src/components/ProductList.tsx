import { useEffect, useState } from "react";
import { fetchProducts } from "../api/productApi";
import axios from "axios";

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

      alert("Added to cart!");
    } catch (err) {
      console.error("Failed to add to cart", err);
      alert("Failed to add to cart");
    }
  };

  return (
    <div>
      <h2>All Products</h2>
      <ul>
        {products.map((product) => (
          <li key={product._id}>
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.name}
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
            )}
            <strong>{product.name}</strong> – €{product.price}
            <p>{product.description}</p>
            <button onClick={() => handleAddToCart(product._id)}>
              Add to Cart
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
