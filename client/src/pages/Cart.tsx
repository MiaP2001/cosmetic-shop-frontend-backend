import { useEffect, useState } from "react";
import axios from "axios";

type ProductInCart = {
  product: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
};

export default function Cart() {
  const [cartItems, setCartItems] = useState<ProductInCart[]>([]);
  const [total, setTotal] = useState(0);

  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setCartItems(res.data.products);

      const totalSum = res.data.products.reduce(
        (sum: number, item: ProductInCart) =>
          sum + item.product.price * item.quantity,
        0
      );

      setTotal(totalSum);
    } catch (err) {
      console.error("Failed to fetch cart", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = (productId: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleUpdate = async (productId: string, quantity: number) => {
    try {
      await axios.put(
        `http://localhost:5000/api/cart/${productId}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchCart();
    } catch (err) {
      console.error("Failed to update cart item", err);
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      await fetchCart();
    } catch (err) {
      console.error("Failed to remove item from cart", err);
      alert("Failed to remove item");
    }
  };

  const handlePlaceOrder = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/orders",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("Order placed successfully!");
      setCartItems([]);
      setTotal(0);
    } catch (err) {
      console.error("Failed to place order", err);
      alert("Failed to place order.");
    }
  };

  return (
    <div>
      <h1>Your Cart</h1>
      {cartItems.map(({ product, quantity }) => (
        <div key={product._id}>
          <p>
            <strong>{product.name}</strong> – {quantity} x €{product.price}
          </p>
          <input
            type="number"
            value={quantity}
            min="1"
            onChange={(e) =>
              handleQuantityChange(product._id, parseInt(e.target.value))
            }
          />
          <button onClick={() => handleUpdate(product._id, quantity)}>
            Update
          </button>
          <button onClick={() => handleDelete(product._id)}>Delete</button>
        </div>
      ))}
      <hr />
      <h3>Total: €{total.toFixed(2)}</h3>
      <button onClick={handlePlaceOrder}>Place Order</button>
    </div>
  );
}
