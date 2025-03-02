import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const navigate = useNavigate();

  // Fetch cart items and product details from localStorage and API
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

  // Remove an item from the cart
  const removeFromCart = (itemId) => {
    const updatedCart = cartItems.filter((item) => item._id !== itemId);
    setCartItems(updatedCart);
    const cartData = updatedCart.reduce((acc, item) => {
      acc[item._id] = item.quantity;
      return acc;
    }, {});
    localStorage.setItem("cart", JSON.stringify(cartData));
  };

  // Update the quantity of an item in the cart
  const handleQuantityChange = (itemId, newQuantity) => {
    const updatedCart = cartItems.map((item) =>
      item._id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    const cartData = updatedCart.reduce((acc, item) => {
      acc[item._id] = item.quantity;
      return acc;
    }, {});
    localStorage.setItem("cart", JSON.stringify(cartData));
  };

  // Navigate to the product details page
  const handleProductClick = (id) => {
    navigate(`/ProductD/${id}`);
  };

  // Calculate the overall total price
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Handle the order form submission
  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setOrderSubmitting(true);

    // Create the order data from form fields and cart items
    const formData = new FormData(e.target);
    const orderData = {
      customerName: formData.get("customerName"),
      customerEmail: formData.get("customerEmail"),
      customerPhone: formData.get("customerPhone"),
      customerAddress: formData.get("customerAddress"),
      totalPrice,
      // Build an array of product objects with _id and quantity
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
      // Optionally clear the cart and navigate to a thank-you page
      localStorage.removeItem("cart");
      setCartItems([]);
      navigate("/thankyou"); // Create a thank-you route if desired
    } catch (error) {
      console.error("Order submission error:", error);
      alert("There was an error placing your order. Please try again.");
    } finally {
      setOrderSubmitting(false);
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-6">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <p className="text-lg text-center">Your cart is empty.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col items-center text-center"
              >
                <img
                  onClick={() => handleProductClick(item._id)}
                  src={`https://mmtrjy-3000.csb.app${item.picture}`}
                  alt={item.name}
                  className="w-32 h-32 object-cover rounded-md hover:shadow-xl cursor-pointer transition duration-300"
                />
                <h2 className="text-xl font-semibold mt-3">{item.name}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Price: <span className="font-bold">{item.price} RS</span>
                </p>
                <div className="mt-3">
                  <span className="mr-2 font-medium">Quantity:</span>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    readOnly
                    className="text-black w-16 text-center rounded-md border-gray-300 bg-gray-200 cursor-not-allowed"
                  />
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Details Form */}
        {cartItems.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Place Your Order</h2>
            <form onSubmit={handleOrderSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="customerName"
                  className="block text-sm font-medium mb-1"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  required
                  className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="customerEmail"
                  className="block text-sm font-medium mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="customerEmail"
                  name="customerEmail"
                  required
                  className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="customerPhone"
                  className="block text-sm font-medium mb-1"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="customerPhone"
                  name="customerPhone"
                  required
                  className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="customerAddress"
                  className="block text-sm font-medium mb-1"
                >
                  Shipping Address
                </label>
                <textarea
                  id="customerAddress"
                  name="customerAddress"
                  required
                  className="text-black text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                ></textarea>
              </div>
              <div className="mb-4">
                <p className="text-lg font-bold">
                  Total Price: {totalPrice} RS
                </p>
              </div>
              <button
                type="submit"
                disabled={orderSubmitting}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
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













// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const Cart = () => {
//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   // Fetch cart items and product details from localStorage and API
//   useEffect(() => {
//     const fetchCartItems = async () => {
//       try {
//         const cartData = JSON.parse(localStorage.getItem("cart")) || {};
//         const itemPromises = Object.entries(cartData).map(async ([id, quantity]) => {
//           if (!response.ok) {
//             throw new Error(`Failed to fetch product ${id}`);
//           }
//           const productData = await response.json();
//           return {
//             ...productData,
//             quantity,
//             price: productData.Discounted_price || productData.price,
//           };
//         });
//         const items = await Promise.all(itemPromises);
//         setCartItems(items);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCartItems();
//   }, []);

// // Remove an item from the cart
// const removeFromCart = (itemId) => {
//   const updatedCart = cartItems.filter((item) => item._id !== itemId);
//   setCartItems(updatedCart);

//   const cartData = updatedCart.reduce((acc, item) => {
//     acc[item._id] = item.quantity;
//     return acc;
//   }, {});
//   localStorage.setItem("cart", JSON.stringify(cartData));
// };

// // Update the quantity of an item in the cart
// const handleQuantityChange = (itemId, newQuantity) => {
//   const updatedCart = cartItems.map((item) =>
//     item._id === itemId ? { ...item, quantity: newQuantity } : item
//   );
//   setCartItems(updatedCart);

//   const cartData = updatedCart.reduce((acc, item) => {
//     acc[item._id] = item.quantity;
//     return acc;
//   }, {});
//   localStorage.setItem("cart", JSON.stringify(cartData));
// };


//   // Navigate to the checkout page
//   const handleBuy = () => {
//     navigate("/checkout");
//   };
//   const handleProductClick = (id) => {
//     navigate(`/ProductD/${id}`);
//   };
//   // Calculate the overall total price
//   const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

//   // Generate a summary of the order details for sending via FormSubmit
//   const generateOrderSummary = () => {
//     if (cartItems.length === 0) return "No items in cart.";
//     return cartItems
//       .map((item) => {
//         return `Item: ${item.name}
// Price: ${item.price} RS
// Quantity: ${item.quantity}
// Subtotal: ${item.price * item.quantity} RS
// ------------------------`;
//       })
//       .join("\n");
//   };

//   if (loading)
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Loading...
//       </div>
//     );
//   if (error)
//     return (
//       <div className="min-h-screen flex items-center justify-center text-red-500">
//         Error: {error}
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 py-8">
//       <div className="container mx-auto px-4" >
//         <h1 className="text-3xl font-bold text-center mb-6">Shopping Cart</h1>

//         {cartItems.length === 0 ? (
//           <p className="text-lg text-center">Your cart is empty.</p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
//             {cartItems.map((item) => (
//               <div 
//                 key={item.id}
//                 className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col items-center text-center "
//               >
//                 <img
//                 onClick={() => handleProductClick(item._id)}
//                   alt={item.name}
//                   className="w-32 h-32 object-cover rounded-md hover:shadow-[0_0_15px_rgba(0,0,0,0.2)] cursor-pointer hover:border-gray-600 hover:shadow-xl transition duration-300"
//                 />
//                 <h2 className="text-xl font-semibold mt-3">{item.name}</h2>
//                 <p className="text-sm text-gray-600 dark:text-gray-300">
//                   Price: <span className="font-bold">{item.price} RS</span>
//                 </p>
//                 <div className="mt-3 flex items-center">
//                 <div className="mt-3 flex items-center">
//                    <div
//                     type="number"
//                     onChange={(e) =>
//                       handleQuantityChange(
//                         item.id,
//                         Math.max(1, parseInt(e.target.value) || 1)
//                       )
//                     }
//                     className="w-32 text-center mx-2   rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">Quantity: {item.quantity}</div>
                  
               
//                 </div>
//                 </div>
//                 <div className="mt-4 flex space-x-2">
//                   {/* <button
//                     onClick={handleBuy}
//                     className="bg-green-500 text-white px-4 py-2 rounded-md"
//                   >
//                     Buy Now
//                   </button> */}
//                   <button
//   onClick={() => removeFromCart(item._id)}
//   className="bg-red-500 text-white px-4 py-2 rounded-md"
// >
//   Remove
// </button>

//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Order Details Form */}
//         {cartItems.length > 0 && (
//           <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
//             <h2 className="text-2xl font-bold mb-4">Place Your Order</h2>
//             <form   action="https://formspree.io/f/meoezpog" method="POST">
//               {/* Optional: Disable the default captcha provided by FormSubmit */}
//               <input type="hidden" name="_captcha" value="false" />

//               {/* Hidden fields for order details */}
//               <input
//                 type="hidden"
//                 name="order_summary"
//                 value={generateOrderSummary()}
//               />
//               <input type="hidden" name="total_price" value={totalPrice} />

//               {/* Customer Personal Details */}
//               <div className="mb-4">
//                 <label
//                   htmlFor="customerName"
//                   className="block text-sm font-medium mb-1"
//                 >
//                   Full Name
//                 </label>
//                 <input
//                   type="text"
//                   id="customerName"
//                   name="customerName"
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label
//                   htmlFor="customerEmail"
//                   className="block text-sm font-medium mb-1"
//                 >
//                   Email Address
//                 </label>
//                 <input
//                   type="email"
//                   id="customerEmail"
//                   name="customerEmail"
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label
//                   htmlFor="customerPhone"
//                   className="block text-sm font-medium mb-1"
//                 >
//                   Phone Number
//                 </label>
//                 <input
//                   type="tel"
//                   id="customerPhone"
//                   name="customerPhone"
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label
//                   htmlFor="customerAddress"
//                   className="block text-sm font-medium mb-1"
//                 >
//                   Shipping Address
//                 </label>
//                 <textarea
//                   id="customerAddress"
//                   name="customerAddress"
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
//                 ></textarea>
//               </div>

//               <button
//                 type="submit"
//                 className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
//               >
//                 Place Order
//               </button>
//             </form>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Cart;









// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const Cart = () => {
//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   // Fetch cart items and product details from localStorage and API
//   useEffect(() => {
//     const fetchCartItems = async () => {
//       try {
//         const cartData = JSON.parse(localStorage.getItem("cart")) || {};
//         const itemPromises = Object.entries(cartData).map(async ([id, quantity]) => {
//           if (!response.ok) {
//             throw new Error(`Failed to fetch product ${id}`);
//           }
//           const productData = await response.json();
//           return {
//             ...productData,
//             quantity,
//             price: productData.Discounted_price || productData.price,
//           };
//         });
//         const items = await Promise.all(itemPromises);
//         setCartItems(items);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCartItems();
//   }, []);

//   // Remove an item from the cart
//   const removeFromCart = (itemId) => {
//     const updatedCart = cartItems.filter((item) => item.id !== itemId);
//     setCartItems(updatedCart);

//     const cartData = updatedCart.reduce((acc, item) => {
//       acc[item.id] = item.quantity;
//       return acc;
//     }, {});
//     localStorage.setItem("cart", JSON.stringify(cartData));
//   };

//   // Update the quantity of an item in the cart
//   const handleQuantityChange = (itemId, newQuantity) => {
//     const updatedCart = cartItems.map((item) =>
//       item.id === itemId ? { ...item, quantity: newQuantity } : item
//     );
//     setCartItems(updatedCart);

//     const cartData = updatedCart.reduce((acc, item) => {
//       acc[item.id] = item.quantity;
//       return acc;
//     }, {});
//     localStorage.setItem("cart", JSON.stringify(cartData));
//   };

//   // Navigate to the checkout page
//   const handleBuy = () => {
//     navigate("/checkout");
//   };
//   const handleProductClick = (id) => {
//     navigate(`/ProductD/${id}`);
//   };
//   // Calculate the overall total price
//   const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

//   // Generate a summary of the order details for sending via FormSubmit
//   const generateOrderSummary = () => {
//     if (cartItems.length === 0) return "No items in cart.";
//     return cartItems
//       .map((item) => {
//         return `Item: ${item.name}
// Price: ${item.price} RS
// Quantity: ${item.quantity}
// Subtotal: ${item.price * item.quantity} RS
// ------------------------`;
//       })
//       .join("\n");
//   };

//   if (loading)
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Loading...
//       </div>
//     );
//   if (error)
//     return (
//       <div className="min-h-screen flex items-center justify-center text-red-500">
//         Error: {error}
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 py-8">
//       <div className="container mx-auto px-4" >
//         <h1 className="text-3xl font-bold text-center mb-6">Shopping Cart</h1>

//         {cartItems.length === 0 ? (
//           <p className="text-lg text-center">Your cart is empty.</p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
//             {cartItems.map((item) => (
//               <div 
//                 key={item.id}
//                 className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col items-center text-center "
//               >
//                 <img
//                 onClick={() => handleProductClick(item._id)}
//                   alt={item.name}
//                   className="w-32 h-32 object-cover rounded-md hover:shadow-[0_0_15px_rgba(0,0,0,0.2)] cursor-pointer hover:border-gray-600 hover:shadow-xl transition duration-300"
//                 />
//                 <h2 className="text-xl font-semibold mt-3">{item.name}</h2>
//                 <p className="text-sm text-gray-600 dark:text-gray-300">
//                   Price: <span className="font-bold">{item.price} RS</span>
//                 </p>
//                 <div className="mt-3 flex items-center">

//                   <div
//                     type="number"
                    
//                     onChange={(e) =>
//                       handleQuantityChange(
//                         item.id,
//                         Math.max(1, parseInt(e.target.value) || 1)
//                       )
//                     }
//                     className="w-32 text-center mx-2   rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">Quantity= {item.quantity}</div>
                  
               
//                 </div>
//                 <div className="mt-4 flex space-x-2">
//                   <button
//                     onClick={handleBuy}
//                     className="bg-green-500 text-white px-4 py-2 rounded-md"
//                   >
//                     Buy Now
//                   </button>
//                   <button
//                     onClick={() => removeFromCart(item.id)}
//                     className="bg-red-500 text-white px-4 py-2 rounded-md"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Order Details Form */}
//         {cartItems.length > 0 && (
//           <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
//             <h2 className="text-2xl font-bold mb-4">Place Your Order</h2>
//             <form   action="https://formspree.io/f/meoezpog" method="POST">
//               {/* Optional: Disable the default captcha provided by FormSubmit */}
//               <input type="hidden" name="_captcha" value="false" />

//               {/* Hidden fields for order details */}
//               <input
//                 type="hidden"
//                 name="order_summary"
//                 value={generateOrderSummary()}
//               />
//               <input type="hidden" name="total_price" value={totalPrice} />

//               {/* Customer Personal Details */}
//               <div className="mb-4">
//                 <label
//                   htmlFor="customerName"
//                   className="block text-sm font-medium mb-1"
//                 >
//                   Full Name
//                 </label>
//                 <input
//                   type="text"
//                   id="customerName"
//                   name="customerName"
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label
//                   htmlFor="customerEmail"
//                   className="block text-sm font-medium mb-1"
//                 >
//                   Email Address
//                 </label>
//                 <input
//                   type="email"
//                   id="customerEmail"
//                   name="customerEmail"
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label
//                   htmlFor="customerPhone"
//                   className="block text-sm font-medium mb-1"
//                 >
//                   Phone Number
//                 </label>
//                 <input
//                   type="tel"
//                   id="customerPhone"
//                   name="customerPhone"
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
//                 />
//               </div>
//               <div className="mb-4">
//                 <label
//                   htmlFor="customerAddress"
//                   className="block text-sm font-medium mb-1"
//                 >
//                   Shipping Address
//                 </label>
//                 <textarea
//                   id="customerAddress"
//                   name="customerAddress"
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
//                 ></textarea>
//               </div>

//               <button
//                 type="submit"
//                 className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
//               >
//                 Place Order
//               </button>
//             </form>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Cart;
