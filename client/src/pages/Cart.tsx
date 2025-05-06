import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";

type Product = {
  _id: string;
  name: string;
  price: number;
};

type ProductInCart = {
  product: Product;
  quantity: number;
};

export default function Cart() {
  const { cart, dispatch } = useCart();
  const [total, setTotal] = useState(0);

  const fetchCart = async () => {
    try {
      const res = await axios.get<{ products: ProductInCart[] }>(
        "http://localhost:5000/api/cart",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      dispatch({ type: "CLEAR_CART" });

      res.data.products.forEach((item: ProductInCart) => {
        dispatch({
          type: "ADD_ITEM",
          payload: {
            id: item.product._id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
          },
        });
      });
    } catch (err) {
      console.error("Failed to fetch cart", err);
    }
  };

  const handleQuantityChange = async (productId: string, quantity: number) => {
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

      dispatch({
        type: "CHANGE_QUANTITY",
        payload: {
          id: productId,
          quantity,
        },
      });
    } catch (err) {
      console.error("Failed to update item quantity on server", err);
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      dispatch({ type: "REMOVE_ITEM", payload: productId });
    } catch (err) {
      console.error("Failed to remove item from server", err);
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
      dispatch({ type: "CLEAR_CART" });
    } catch (err) {
      console.error("Failed to place order", err);
      alert("Failed to place order.");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    const totalSum = cart.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
    setTotal(totalSum);
  }, [cart]);

  return (
    <div>
      <h1>Your Cart</h1>
      {cart.map(({ id, name, price, quantity }) => (
        <div key={id}>
          <p>
            <strong>{name}</strong> × {quantity} = €{price}
          </p>
          <input
            type="number"
            value={quantity}
            onChange={(e) => handleQuantityChange(id, Number(e.target.value))}
          />
          <button onClick={() => handleRemove(id)}>Remove</button>
        </div>
      ))}

      <h2>Total: €{total.toFixed(2)}</h2>
      <button onClick={handlePlaceOrder}>Place Order</button>
    </div>
  );
}
