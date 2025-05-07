import { useState, useEffect } from "react";
import type { Product } from "../types";
import styles from "../styles/ProductForm.module.scss";
import { getCategories } from "../api/categoryApi";

type ProductFormProps = {
  onSubmit: (product: Product) => void;
  initialData?: Product | null;
};

const ProductForm = ({ onSubmit, initialData }: ProductFormProps) => {
  const [name, setName] = useState(initialData?.name || "");
  const [price, setPrice] = useState(initialData?.price || 0);
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [instruction, setInstruction] = useState(
    initialData?.instruction || ""
  );
  const [brand, setBrand] = useState(initialData?.brand || "");
  const [category, setCategory] = useState<string>(
    typeof initialData?.category === "object" && initialData?.category !== null
      ? initialData.category._id
      : initialData?.category || ""
  );
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      price,
      description,
      imageUrl,
      instruction,
      category,
      brand,
      _id: initialData?._id,
    });

    setName("");
    setPrice(0);
    setDescription("");
    setImageUrl("");
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className={styles.input}
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        required
        className={styles.input}
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        className={styles.textarea}
      />

      <textarea
        placeholder="Instruction"
        value={instruction}
        onChange={(e) => setInstruction(e.target.value)}
        className={styles.textarea}
      />

      <input
        type="text"
        placeholder="Brand"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        className={styles.input}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className={styles.input}
        required
      >
        <option value="">Pasirink kategoriją</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className={styles.input}
      />

      <button type="submit" className={styles.submitBtn}>
        Save
      </button>
    </form>
  );
};

export default ProductForm;
