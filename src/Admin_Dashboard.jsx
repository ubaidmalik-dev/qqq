import React, { useState, useEffect } from "react";
import Dash from "./components/Dashboard/Dashboard";
import AOS from "aos";
import "aos/dist/aos.css";
import Popup from "./components/Popup/Popup";
import Admin_All_Products from "./Admin_All_Products";

const About_Page = () => {
  const [orderPopup, setOrderPopup] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("https://mmtrjy-3000.csb.app/api/orders");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data.orders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  const handleOrderPopup = () => {
    setOrderPopup(!orderPopup);
  };

  const handleComplete = async (orderId) => {
    try {
      const response = await fetch(
        `https://mmtrjy-3000.csb.app/api/orders/${orderId}/delete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete order");
      }
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
    } catch (err) {
      console.error(err);
      alert("Error deleting order");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
      <Dash handleOrderPopup={handleOrderPopup} />
      <Admin_All_Products />
      <Popup orderPopup={orderPopup} setOrderPopup={setOrderPopup} />

      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-6">Admin Order Panel</h1>
          {orders.length === 0 ? (
            <p className="text-lg text-center">No orders found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.map((order) => (
                <div key={order._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                  <h2 className="text-xl font-bold mb-2">Order ID: {order._id}</h2>
                  <div className="mb-2">
                    <p><span className="font-semibold">Customer:</span> {order.customerName}</p>
                    <p><span className="font-semibold">Email:</span> {order.customerEmail}</p>
                    <p><span className="font-semibold">Phone:</span> {order.customerPhone}</p>
                    <p><span className="font-semibold">Address:</span> {order.customerAddress}</p>
                    <p><span className="font-semibold">Total Price:</span> {order.totalPrice} RS</p>
                    <p><span className="font-semibold">Size:</span> {order.products[0]?.size || "N/A"}</p> {/* 🔹 Moved here after Total Price */}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Products:</h3>
                    {order.products.map((prod, index) => (
                      <div key={index} className="border border-gray-300 rounded p-2 mb-2 flex items-center">
                        {prod.productId && prod.productId.name ? (
                          <>
                            <img src={`https://mmtrjy-3000.csb.app${prod.productId.picture}`} alt={prod.productId.name} className="w-16 h-16 object-cover rounded mr-2" />
                            <div>
                              <p className="font-semibold">{prod.productId.name}</p>
                              <p>Quantity: {prod.quantity}</p>
                            </div>
                          </>
                        ) : (
                          <div>
                            <p className="font-semibold">Product ID: {prod.productId}</p>
                            <p>Quantity: {prod.quantity}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Ordered on: {new Date(order.createdAt).toLocaleString()}</p>
                  <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleComplete(order._id)}>
                    Completed
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default About_Page;
