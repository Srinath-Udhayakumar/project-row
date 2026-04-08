import { useEffect, useState } from "react";
import { cancelOrder, getOrders } from "../services/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    try {
      const { data } = await getOrders();
      setOrders(data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load orders");
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const onCancel = async (id) => {
    try {
      await cancelOrder(id);
      await loadOrders();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to cancel order");
    }
  };

  return (
    <section>
      <h2>Order History</h2>
      {error && <p className="error">{error}</p>}

      {orders.length === 0 && <p>No orders found.</p>}

      <div className="grid">
        {orders.map((order) => (
          <article key={order.id} className="card">
            <h3>Order #{order.id}</h3>
            <p>Status: {order.status}</p>
            <p>Total: ${order.totalAmount}</p>
            <p>Created: {new Date(order.createdAt).toLocaleString()}</p>
            <ul>
              {order.items.map((item) => (
                <li key={`${order.id}-${item.productId}`}>
                  {item.productName} x {item.quantity} (${item.lineTotal})
                </li>
              ))}
            </ul>
            {order.status === "PLACED" && (
              <button className="danger" type="button" onClick={() => onCancel(order.id)}>
                Cancel Order
              </button>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export default Orders;