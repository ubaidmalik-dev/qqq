import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("M");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`https://mmtrjy-3000.csb.app/products/${id}`);
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

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleQuantityChange = (e) => {
    setQuantity(Math.max(1, parseInt(e.target.value)));
  };

  const handleAddToCart = () => {
    if (!product) return;

    const cart = JSON.parse(localStorage.getItem("cart")) || {};
    const cartKey = `${product._id}-${size}`;

    cart[cartKey] = (cart[cartKey] || 0) + quantity;
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found!</div>;

  const discountedPrice = product.Discounted_price || product.price;
  const hasDiscount = product.Discounted_price && product.Discounted_price < product.price;
  const discountPercentage = hasDiscount ? Math.round(((product.price - product.Discounted_price) / product.price) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100">
      <div className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
          <div className="flex-1 relative">
            <img src={`https://mmtrjy-3000.csb.app${product.picture}`} alt={product.name} className="w-full h-auto object-cover rounded-md" />
            {hasDiscount && <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold py-1 px-2 rounded">{discountPercentage}% OFF</div>}
          </div>

          <div className="flex-1 md:ml-8">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-sm mb-4 text-gray-600 dark:text-gray-400">{product.description}</p>
            
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Category</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{product.category}</p>
            </div>

            <div className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
              {hasDiscount ? (
                <>
                  <span className="line-through text-red-500 mr-2">{product.price.toFixed(2)} RS</span>
                  <span className="text-green-500">{discountedPrice.toFixed(2)} RS</span>
                </>
              ) : (
                <span>{product.price.toFixed(2)} RS</span>
              )}
            </div>

            {/* Size Selector */}
            <div className="mb-4">
              <label htmlFor="size" className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                Size
              </label>
              <select 
                id="size" 
                value={size} 
                onChange={(e) => setSize(e.target.value)} 
                className="w-full p-2 border rounded-md bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-600"
              >
                <option value="S">Small</option>
                <option value="M">Medium</option>
                <option value="L">Large</option>
              </select>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center mb-6">
              <label htmlFor="quantity" className="mr-2 font-medium text-gray-700 dark:text-gray-300">Quantity</label>
              <input 
                type="number" 
                id="quantity" 
                value={quantity} 
                onChange={handleQuantityChange} 
                min="1" 
                className="w-16 p-2 border rounded-md bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600"
              />
            </div>

            <button onClick={handleAddToCart} className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md transition">
              {isAdded ? "Item Added!" : "Add to Cart"}
            </button>
          </div>
        </div>

        {/* Size Chart */}
        <div className="container mx-auto mt-10 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200 text-center">Size Chart</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700">
                  <th className="border p-2">Size</th>
                  <th className="border p-2">Body Length</th>
                  <th className="border p-2">Chest Width</th>
                  <th className="border p-2">Bottom Width</th>
                  <th className="border p-2">Shoulder Seam</th>
                  <th className="border p-2">Neck Width</th>
                  <th className="border p-2">Sleeve Length (Long)</th>
                  <th className="border p-2">Sleeve Length (Short)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-200 dark:bg-gray-700">
                  <td className="border p-2">Small</td>
                  <td className="border p-2">68 CM / 27 In</td>
                  <td className="border p-2">52 CM / 21 In</td>
                  <td className="border p-2">52 CM / 21 In</td>
                  <td className="border p-2">48 CM / 19 In</td>
                  <td className="border p-2">18.5 CM / 8 In</td>
                  <td className="border p-2">59.5 CM / 24 In</td>
                  <td className="border p-2">21 CM / 9 In</td>
                </tr>
                <tr className="bg-gray-200 dark:bg-gray-700">
                  <td className="border p-2">Medium</td>
                  <td className="border p-2">70 CM / 28 In</td>
                  <td className="border p-2">55 CM / 22 In</td>
                  <td className="border p-2">55 CM / 22 In</td>
                  <td className="border p-2">50 CM / 20 In</td>
                  <td className="border p-2">19 CM / 8 In</td>
                  <td className="border p-2">61 CM / 25 In</td>
                  <td className="border p-2">22 CM / 9 In</td>
                </tr>
                <tr className="bg-gray-200 dark:bg-gray-700">
                  <td className="border p-2">Large</td>
                  <td className="border p-2">72 CM / 29 In</td>
                  <td className="border p-2">58 CM / 23 In</td>
                  <td className="border p-2">58 CM / 23 In</td>
                  <td className="border p-2">52 CM / 21 In</td>
                  <td className="border p-2">19.5 CM / 8 In</td>
                  <td className="border p-2">62.5 CM / 25 In</td>
                  <td className="border p-2">23 CM / 10 In</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
