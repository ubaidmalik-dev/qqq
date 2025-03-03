import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [isAdded, setIsAdded] = useState(false);

  // Fetch Product Details
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(https://mmtrjy-3000.csb.app/products/${id});
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  // Handle Theme Change
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Handle Quantity Change
  const handleQuantityChange = (e) => {
    setQuantity(Math.max(1, parseInt(e.target.value)));
  };

  // Add to Cart Functionality
  const handleAddToCart = () => {
    if (!product) return;

    // Get existing cart from localStorage or initialize empty object
    const cart = JSON.parse(localStorage.getItem("cart")) || {};

    // Update quantity for this product ID (using product._id for consistency)
    cart[product._id] = (cart[product._id] || 0) + quantity;

    // Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Dispatch a custom event to notify Navbar to update the cart count
    window.dispatchEvent(new Event("cartUpdated"));

    // Set item added state for user feedback
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
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
  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Product not found!
      </div>
    );

  const discountedPrice = product.Discounted_price || product.price;
  const hasDiscount =
    product.Discounted_price && product.Discounted_price < product.price;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.price - product.Discounted_price) / product.price) * 100
      )
    : 0;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
      <div className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
          {/* Left Side - Product Image */}
          <div className="flex-1 relative">
            <img
              src={https://mmtrjy-3000.csb.app${product.picture}}
              alt={product.name}
              className="w-full h-auto object-cover rounded-md"
            />

            {/* Discount Tag */}
            {hasDiscount && (
              <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded">
                {discountPercentage}% OFF
              </div>
            )}
          </div>

          {/* Right Side - Product Info */}
          <div className="flex-1 md:ml-8">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-sm mb-4 text-gray-600 dark:text-gray-400">
              {product.description}
            </p>

            {/* Category */}
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Category
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {product.category}
              </p>
            </div>

            {/* Price */}
            <div className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
              {hasDiscount ? (
                <>
                  <span className="line-through text-red-500 mr-2">
                    {product.price.toFixed(2)} RS
                  </span>
                  <span className="text-green-500">
                    {discountedPrice.toFixed(2)} RS
                  </span>
                </>
              ) : (
                <span>{product.price.toFixed(2)} RS</span>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center mb-6">
              <label
                htmlFor="quantity"
                className="mr-2 font-medium text-gray-700 dark:text-gray-300"
              >
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
                className="w-16 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md transition"
            >
              {isAdded ? "Item Added!" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
