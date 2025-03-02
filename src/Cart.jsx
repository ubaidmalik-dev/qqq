import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser"; // Import EmailJS

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const cartData = JSON.parse(localStorage.getItem("cart")) || {};
        const itemPromises = Object.entries(cartData).map(async ([id, quantity]) => {
          const response = await fetch(`https://mmtrjy-3000.csb.app/products/${id}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch product ${id}`);
          }
          const productData = await response.json();
          return {
            ...productData,
            quantity,
            price: productData.Discounted_price || productData.price,
          };
        });
        const items = await Promise.all(itemPromises);
        setCartItems(items);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setOrderSubmitting(true);

    const formData = new FormData(e.target);
    const orderData = {
      customerName: formData.get("customerName"),
      customerEmail: formData.get("customerEmail"),
      customerPhone: formData.get("customerPhone"),
      customerAddress: formData.get("customerAddress"),
      totalPrice,
      products: cartItems.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await fetch("https://mmtrjy-3000.csb.app/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) {
        throw new Error("Failed to place order");
      }
      const result = await response.json();
      console.log("Order placed successfully:", result);

      // Send Email Notification to Admin via EmailJS
      const emailParams = {
        to_admin_email: "rouchacielo@gmail.com", // Replace with admin's email
        customer_name: orderData.customerName,
        customer_email: orderData.customerEmail,
        customer_phone: orderData.customerPhone,
        customer_address: orderData.customerAddress,
        total_price: totalPrice,
        products_list: cartItems
          .map((item) => `${item.name} (x${item.quantity}) - ${item.price} RS`)
          .join("\n"),
      };

      emailjs
        .send(
          "service_o8c3xn6", // Replace with your EmailJS Service ID
          "template_v4qyx26", // Replace with your EmailJS Template ID
          emailParams,
          "Lvg2aCFJfEAExM5kw" // Replace with your EmailJS Public Key
        )
        .then(() => {
          console.log("Admin alert email sent successfully!");
        })
        .catch((error) => {
          console.error("Error sending email:", error);
        });

      // Clear cart and navigate to thank-you page
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

  if (loading)
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error)
    return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-6">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <p className="text-lg text-center">Your cart is empty.</p>
        ) : (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Place Your Order</h2>
            <form onSubmit={handleOrderSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input type="text" name="customerName" required className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email Address</label>
                <input type="email" name="customerEmail" required className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input type="tel" name="customerPhone" required className="w-full px-3 py-2 border rounded-md" />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Shipping Address</label>
                <textarea name="customerAddress" required className="w-full px-3 py-2 border rounded-md"></textarea>
              </div>
              <div className="mb-4">
                <p className="text-lg font-bold">Total Price: {totalPrice} RS</p>
              </div>
              <button type="submit" disabled={orderSubmitting} className="w-full bg-blue-600 text-white py-2 rounded-md">
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
