import { useState } from "react";
import type { Product } from "../types";

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
  const [category, setCategory] = useState(initialData?.category || "");
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
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(+e.target.value)}
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <textarea
        placeholder="Instruction"
        value={instruction}
        onChange={(e) => setInstruction(e.target.value)}
      />

      <input
        placeholder="Brand"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
      />

      <input
        placeholder="Category ID"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <input
        placeholder="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      <button type="submit">Save</button>
    </form>
  );
};

export default ProductForm;
