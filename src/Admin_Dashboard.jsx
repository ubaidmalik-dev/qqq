import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";

const DELIVERY_CHARGE = 250;

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
    window.addEventListener("cartUpdated", fetchCartItems);
    return () => window.removeEventListener("cartUpdated", fetchCartItems);
  }, []);

  const fetchCartItems = async () => {
    try {
      const cartData = JSON.parse(localStorage.getItem("cart")) || {};

      if (!cartData || Object.keys(cartData).length === 0) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      const itemPromises = Object.entries(cartData).map(async ([key, quantity]) => {
        const [productId, size] = key.split("-");

        try {
          const response = await fetch(https://mmtrjy-3000.csb.app/products/${productId});
          if (!response.ok) throw new Error(Product ${productId} not found);

          const productData = await response.json();
          return {
            ...productData,
            quantity,
            size,
            price: productData.Discounted_price || productData.price,
          };
        } catch (err) {
          console.warn(Skipping product ${productId}: ${err.message});
          return null;
        }
      });

      const items = (await Promise.all(itemPromises)).filter(Boolean);
      setCartItems(items);
    } catch (err) {
      setError("Failed to load cart items.");
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = (productId, size) => {
    const cartData = JSON.parse(localStorage.getItem("cart")) || {};
    const cartKey = ${productId}-${size};
    delete cartData[cartKey];

    localStorage.setItem("cart", JSON.stringify(cartData));
    fetchCartItems();
  };

  const subTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalPrice = subTotal + DELIVERY_CHARGE;

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setOrderSubmitting(true);

    const formData = new FormData(e.target);
    const orderData = {
      customerName: formData.get("customerName"),
      customerEmail: formData.get("customerEmail"),
      customerPhone: formData.get("customerPhone"),
      customerAddress: formData.get("customerAddress"),
      subTotal,
      deliveryCharge: DELIVERY_CHARGE,
      totalPrice,
      products: cartItems.map((item) => ({
        productId: item._id,
        size: item.size,
        quantity: item.quantity,
      })),
    };

    try {
      console.log("Sending order data:", orderData);

      const response = await fetch("https://mmtrjy-3000.csb.app/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      console.log("API Response:", result);

      if (!response.ok) throw new Error(result.message || "Failed to place order");

      console.log("Order placed successfully:", result);

      try {
        await emailjs.send(
          "service_o8c3xn6",
          "template_v4qyx26",
          {
            customer_name: orderData.customerName,
            customer_email: orderData.customerEmail,
            customer_phone: orderData.customerPhone,
            customer_address: orderData.customerAddress,
            order_subtotal: subTotal,
            delivery_charge: DELIVERY_CHARGE,
            order_total: totalPrice,
            order_details: orderData.products
              .map((p) => Product ID: ${p.productId}, Size: ${p.size}, Quantity: ${p.quantity})
              .join("\n"),
            admin_email: "rouchacielo@gmail.com",
          },
          "Lvg2aCFJfEAExM5kw"
        );

        console.log("Admin email sent successfully.");
      } catch (emailError) {
        console.error("EmailJS error:", emailError);
      }

      localStorage.removeItem("cart");
      setCartItems([]);
      navigate("/thankyou");
    } catch (error) {
      console.error("Order submission error:", error);
      alert("There was an error placing your order. Please try again.");
    } finally {
      setOrderSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-6">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <p className="text-lg text-center">Your cart is empty.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {cartItems.map((item) => (
              <div key={${item._id}-${item.size}} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center">
                <img
                  src={https://mmtrjy-3000.csb.app${item.picture}}
                  alt={item.name}
                  className="w-32 h-32 object-cover rounded-md cursor-pointer mx-auto"
                />
                <h2 className="text-xl font-semibold mt-3">{item.name}</h2>
                <h2 className="text-xl font-semibold mt-3">Size: {item.size}</h2>
                <p>Price: <span className="font-bold">{item.price} RS</span></p>
                <p>Quantity: {item.quantity}</p>
                <button
                  onClick={() => removeFromCart(item._id, item.size)}
                  className="mt-3 bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {cartItems.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Place Your Order</h2>
            <form onSubmit={handleOrderSubmit}>
              <input type="text" name="customerName" required placeholder="Full Name" className="w-full p-2 text-black border rounded-md mb-3" />
              <input type="email" name="customerEmail" required placeholder="Email" className="w-full p-2 text-black border rounded-md mb-3" />
              <input type="tel" name="customerPhone" required placeholder="Phone Number" className="w-full p-2 text-black border rounded-md mb-3" />
              <input type="text" name="customerCity" required placeholder="City" className="w-full p-2 text-black border rounded-md mb-3" />
              <textarea name="customerAddress" required placeholder="Shipping Address" className="w-full p-2 text-black border rounded-md mb-3"></textarea>

              <p className="text-lg font-bold">Subtotal: {subTotal} RS</p>
              <p className="text-lg font-bold">Delivery Charges: {DELIVERY_CHARGE} RS</p>
              <p className="text-lg font-bold">Total Price: {totalPrice} RS</p>

              <button type="submit" disabled={orderSubmitting} className="w-full bg-blue-600 text-white py-2 rounded-md mt-4">
                {orderSubmitting ? "Placing Order..." : "Place Order"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
"By using this"



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

  // Fetch orders when the component mounts
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

  // Initialize AOS for animations
  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  // Handle the order popup toggle
  const handleOrderPopup = () => {
    setOrderPopup(!orderPopup);
  };

  // Handler for marking an order as completed (deleting it)
  const handleComplete = async (orderId) => {
    try {
      const response = await fetch(
        https://mmtrjy-3000.csb.app/api/orders/${orderId}/delete,
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
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
    } catch (err) {
      console.error(err);
      alert("Error deleting order");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error: {error}
      </div>
    );

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
      <Dash handleOrderPopup={handleOrderPopup} />
      <Admin_All_Products />
      <Popup orderPopup={orderPopup} setOrderPopup={setOrderPopup} />

      {/* Admin Order Panel */}
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-6">Admin Order Panel</h1>
          {orders.length === 0 ? (
            <p className="text-lg text-center">No orders found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
                >
                  <h2 className="text-xl font-bold mb-2">Order ID: {order._id}</h2>
                  <div className="mb-2">
                    <p><span className="font-semibold">Customer:</span> {order.customerName}</p>
                    <p><span className="font-semibold">Email:</span> {order.customerEmail}</p>
                    <p><span className="font-semibold">Phone:</span> {order.customerPhone}</p>
                    <p><span className="font-semibold">Address:</span> {order.customerAddress}</p>
                    <p><span className="font-semibold">Total Price:</span> {order.totalPrice} RS</p>
                  </div>
                  
                  {/* Products List */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Products:</h3>
                    {order.products.map((prod, index) => (
                      <div
                        key={index}
                        className="border border-gray-300 rounded p-2 mb-2 flex items-center"
                      >
                        {prod.productId && prod.productId.name ? (
                          <>
                            <img
                              src={https://mmtrjy-3000.csb.app${prod.productId.picture}}
                              alt={prod.productId.name}
                              className="w-16 h-16 object-cover rounded mr-2"
                            />
                            <div>
                              <p className="font-semibold">{prod.productId.name}</p>
                              <p>Quantity: {prod.quantity}</p>
                              {/* Display Size if available */}
                              {prod.size ? (
                                <p>Size: {prod.size}</p>
                              ) : (
                                <p className="text-gray-500 text-sm">Size: N/A</p>
                              )}
                            </div>
                          </>
                        ) : (
                          <div>
                            <p className="font-semibold">Product ID: {prod.productId}</p>
                            <p>Quantity: {prod.quantity}</p>
                            {/* Display Size if available */}
                            {prod.size ? (
                              <p>Size: {prod.size}</p>
                            ) : (
                              <p className="text-gray-500 text-sm">Size: N/A</p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <p className="text-sm text-gray-500 mt-2">
                    Ordered on: {new Date(order.createdAt).toLocaleString()}
                  </p>

                  {/* Completed Button */}
                  <button
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleComplete(order._id)}
                  >
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
