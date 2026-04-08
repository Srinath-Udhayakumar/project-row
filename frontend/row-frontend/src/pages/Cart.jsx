import { useEffect, useState } from "react";
import { getCart, placeOrder, removeCartItem } from "../services/api";

function Cart() {
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [error, setError] = useState("");

  const loadCart = async () => {
    try {
      const { data } = await getCart();
      setCart(data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load cart");
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const onRemove = async (id) => {
    try {
      await removeCartItem(id);
      await loadCart();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to remove cart item");
    }
  };

  const onPlaceOrder = async () => {
    try {
      await placeOrder();
      alert("Order placed successfully");
      await loadCart();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to place order");
    }
  };

  return (
    <section>
      <h2>Cart</h2>
      {error && <p className="error">{error}</p>}

      <div className="card">
        {cart.items.length === 0 && <p>Your cart is empty.</p>}
        {cart.items.map((item) => (
          <div key={item.id} className="row cart-item">
            <div>
              <strong>{item.productName}</strong>
              <p>
                Qty: {item.quantity} | Price: ${item.price}
              </p>
            </div>
            <div className="row">
              <span>${item.lineTotal}</span>
              <button className="danger" type="button" onClick={() => onRemove(item.id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
        <hr />
        <p>
          <strong>Total: ${cart.totalAmount}</strong>
        </p>
        <button type="button" onClick={onPlaceOrder} disabled={!cart.items.length}>
          Place Order
        </button>
      </div>
    </section>
  );
}

export default Cart;