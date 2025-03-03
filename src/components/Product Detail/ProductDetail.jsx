import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`https://mmtrjy-3000.csb.app/api/products/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    const cart = JSON.parse(localStorage.getItem("cart")) || {};
    const productId = product._id || product.id; // Ensure correct ID usage
    cart[productId] = (cart[productId] || 0) + quantity;
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Product added to cart!");
  };

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto bg-white p-6 shadow-lg rounded-lg dark:bg-gray-800">
        <img
          src={`https://mmtrjy-3000.csb.app${product.picture}`}
          alt={product.name}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">{product.name}</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300">{product.description}</p>
        <div className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">${product.price}</div>
        <div className="flex items-center mb-4">
          <label htmlFor="quantity" className="mr-2 text-gray-700 dark:text-gray-300">Quantity:</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-16 p-2 border rounded dark:bg-gray-700 dark:text-white"
          />
        </div>
        <button
          onClick={handleAddToCart}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
