import { useEffect, useState } from "react";
import axios from "axios";
import ProductForm from "../components/ProductForm";
import type { Product } from "../types/productTypes";
import styles from "../styles/AdminPanel.module.scss";
import Filters from "../components/Filters";

const AdminPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    };
    loadProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  };

  const handleAddProduct = async (product: {
    name: string;
    price: number;
    description: string;
    imageUrl?: string;
  }) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/products",
        product,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setProducts((prev) => [...prev, res.data]);
      setShowForm(false);
      setEditingProduct(null);
    } catch (err) {
      alert("Failed to create product");
      console.error(err);
    }
  };

  const handleUpdateProduct = async (product: Product) => {
    console.log("🔧 Updating product:", product);
    if (!product._id) return;

    const { _id, ...updateData } = product;

    try {
      const res = await axios.put(
        `http://localhost:5000/api/products/${_id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setProducts((prev) => prev.map((p) => (p._id === _id ? res.data : p)));
      setShowForm(false);
      setEditingProduct(null);
    } catch (err) {
      alert("Failed to update product");
      console.error(err);
    }
  };

  return (
    <div className={styles.adminPanel}>
      <h1>Admin Panel - Products</h1>

      <Filters
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
      />

      {showForm && (
        <ProductForm
          onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
          initialData={editingProduct}
        />
      )}
      <div className={styles.productsContainer}>
        <button
          onClick={() => {
            setShowForm((prev) => !prev);
            setEditingProduct(null);
          }}
          className={styles.addBtn}
        >
          <span>
            {showForm ? (
              "✖ Close"
            ) : (
              <>
                <span>➕</span> Add New Product
              </>
            )}
          </span>
        </button>

        <ul className={styles.productList}>
          {products
            .filter((product) => {
              const categoryId =
                typeof product.category === "string"
                  ? product.category
                  : product.category?._id;

              const matchCategory = selectedCategory
                ? categoryId === selectedCategory
                : true;

              const matchMin = minPrice
                ? product.price >= Number(minPrice)
                : true;
              const matchMax = maxPrice
                ? product.price <= Number(maxPrice)
                : true;
              const matchSearch = product.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

              return matchCategory && matchMin && matchMax && matchSearch;
            })
            .map((product) => (
              <li key={product._id} className={styles.productItem}>
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className={styles.productImage}
                  />
                )}

                <div className={styles.productContent}>
                  <div className={styles.productText}>
                    <div className={styles.productDetails}>
                      <strong>{product.name}</strong>
                      <p className={styles.price}>€{product.price}</p>
                    </div>
                    <div className={styles.description}>
                      {product.description}
                    </div>{" "}
                  </div>
                </div>

                <div className={styles.actions}>
                  <button
                    onClick={() => {
                      setEditingProduct(product);
                      setShowForm(true);
                    }}
                    className={styles.editBtn}
                  >
                    ✎ Edit
                  </button>
                  <button
                    onClick={() => product._id && handleDelete(product._id)}
                    className={styles.deleteBtn}
                  >
                    🗑 Delete
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPage;
