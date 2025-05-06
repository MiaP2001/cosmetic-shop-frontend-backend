import { useEffect, useState } from "react";
import { fetchProducts } from "../api/productApi";

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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
