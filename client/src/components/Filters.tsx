import React from "react";
import styles from "../styles/Filters.module.scss";

type FiltersProps = {
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  minPrice: string;
  setMinPrice: (value: string) => void;
  maxPrice: string;
  setMaxPrice: (value: string) => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
};

const Filters: React.FC<FiltersProps> = ({
  selectedCategory,
  setSelectedCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <div className={styles.filters}>
      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.input}
      />

      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className={styles.select}
      >
        <option value="">All Categories</option>
        <option value="681a0e64e9870ffa618f8b80">Kūnui</option>
        <option value="681a0e8fe9870ffa618f8b83">Veidui</option>
        <option value="681a0ea3e9870ffa618f8b86">Plaukams</option>
      </select>

      <input
        type="number"
        placeholder="Min price"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        className={styles.input}
      />

      <input
        type="number"
        placeholder="Max price"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        className={styles.input}
      />
    </div>
  );
};

export default Filters;
