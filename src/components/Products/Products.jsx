import React from "react";
import Img1 from "../../assets/Product/Tshirt.jpg";
import { FaStar } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const ProductsData = [
  {
    id: 1,
    img: Img1,
    title: "Product Name",
    price: "1,490.00",
    originalPrice: "1,990.00",
    aosDelay: "0",
  },
  {
    id: 2,
    img: Img1,
    title: "Product Name",
    price: "1,490.00",
    originalPrice: "1,990.00",
    aosDelay: "200",
  },
  {
    id: 3,
    img: Img1,
    title: "Product Name",
    price: "1,490.00",
    originalPrice: "1,990.00",
    aosDelay: "400",
  },
  {
    id: 4,
    img: Img1,
    title: "Product Name",
    price: "1,490.00",
    originalPrice: "1,990.00",
    aosDelay: "600",
  },
];

const Products = () => {
  const navigate = useNavigate();

  const handleProductClick = (id) => {
    navigate(`/ProductD/${id}`);
  };

  const handleViewAll = () => {
    navigate("/products");
  };

  return (
    <div className="mt-14 mb-12">
      <div className="container">
        {/* Header section */}
        <div className="text-center mb-10">
          <h1 data-aos="fade-up" className="text-3xl font-bold text-gray-900">
            HOT SELLING
          </h1>
        </div>
        {/* Body section */}
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* card section */}
            {ProductsData.map((data) => (
              <div
                key={data.id}
                data-aos="fade-up"
                data-aos-delay={data.aosDelay}
                className="group cursor-pointer"
                onClick={() => handleProductClick(data.id)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={data.img}
                    alt={data.title}
                    className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="font-medium text-gray-900">{data.title}</h3>
                  <div className="mt-2">
                    <span className="text-gray-900 font-medium">Rs.{data.price}</span>
                    <span className="ml-2 text-gray-500 line-through">Rs.{data.originalPrice}</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Save Rs.500.00
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* view all button */}
          <div className="flex justify-center mt-10">
            <button
              onClick={handleViewAll}
              className="bg-black hover:bg-gray-800 text-white py-3 px-8 rounded-none text-lg font-semibold transition-all duration-300"
            >
              Show More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
