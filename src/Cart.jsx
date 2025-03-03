
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "emailjs-com";

const DELIVERY_CHARGE = 250; // Set your delivery charge

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

  const removeFromCart = (itemId) => {
    const updatedCart = cartItems.filter((item) => item._id !== itemId);
    setCartItems(updatedCart);
    const cartData = updatedCart.reduce((acc, item) => {
      acc[item._id] = item.quantity;
      return acc;
    }, {});
    localStorage.setItem("cart", JSON.stringify(cartData));
  };

  const subTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalPrice = subTotal + DELIVERY_CHARGE; // Adding delivery charge

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

      // Send email notification to admin
      emailjs.send(
        "service_lme0azd",  
        "template_40iexvh", 
        {
          customer_name: orderData.customerName,
          customer_email: orderData.customerEmail,
          customer_phone: orderData.customerPhone,
          customer_address: orderData.customerAddress,
          order_subtotal: subTotal,
          delivery_charge: DELIVERY_CHARGE,
          order_total: totalPrice,
          order_details: orderData.products.map(
            ((p) => `Product ID: ${p.productId}, Quantity: ${p.quantity}`)
          ).join("\n"),
          admin_email: "jawadali123yahoo@gmail.com",
        },
        "3BqPO0n5X5DBWItb5"
      ).then(() => {
        console.log("Admin email sent successfully.");
      }).catch((err) => {
        console.error("Error sending admin email:", err);
      });

      // Clear cart and navigate
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
              <div key={item._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center">
                <img
                  src={`https://mmtrjy-3000.csb.app${item.picture}`}
                  alt={item.name}
                  className="w-32 h-32 object-cover rounded-md cursor-pointer"
                />
                <h2 className="text-xl font-semibold mt-3">{item.name}</h2>
                <p>Price: <span className="font-bold">{item.price} RS</span></p>
                <p>Quantity: {item.quantity}</p>
                <button
                  onClick={() => removeFromCart(item._id)}
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
              <input type="text" name="customerName" required placeholder="Full Name" className="w-full p-2 border rounded-md mb-3" />
              <input type="email" name="customerEmail" required placeholder="Email" className="w-full p-2 border rounded-md mb-3" />
              <input type="tel" name="customerPhone" required placeholder="Phone Number" className="w-full p-2 border rounded-md mb-3" />
              <textarea name="customerAddress" required placeholder="Shipping Address" className="w-full p-2 border rounded-md mb-3"></textarea>
              
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
