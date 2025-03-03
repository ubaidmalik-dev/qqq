import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import DarkLogo from "../../assets/logo.png";
import LightLogo from "../../assets/logo.png";
import { FaCartShopping } from "react-icons/fa6";
import { IoClose, IoMenu } from "react-icons/io5";

const Navbar = () => {
  const location = useLocation(); // Get the current path
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const updateCartCount = () => {
    const cartData = localStorage.getItem("cart");
    if (cartData) {
      const cartItems = JSON.parse(cartData);
      let count = 0;
      if (Array.isArray(cartItems)) {
        count = cartItems.length;
      } else if (cartItems && typeof cartItems === "object") {
        count = Object.values(cartItems).reduce(
          (acc, quantity) => acc + Number(quantity),
          0
        );
      }
      setCartCount(count);
    } else {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cartUpdated", updateCartCount);
    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  // Function to check if the link is active
  const isActive = (path) => location.pathname === path;

  return (
    <div
      className={`w-full transition-all duration-300 z-50 ${
        isScrolled
          ? "fixed top-0 left-0 shadow-lg bg-white dark:bg-gray-900"
          : "relative bg-transparent"
      }`}
    >
      {/* Sliding Discount Bar */}
      <div className="w-full bg-red-500 text-white text-center py-2 overflow-hidden">
        <marquee scrollamount="5" className="text-sm font-semibold">
          🎉 Limited Time Offer: Get 30% OFF on all products! {" "}
          <span className="font-bold">#SALE30</span> 🎉 
          Dilevery charges <span className="font-bold">250RS</span>
        </marquee>
      </div>

      {/* Upper Navbar */}
      <div className="bg-primary/40 py-2">
        <div className="container flex justify-between items-center px-4">
          {/* Logo */}
          <div className="flex items-center">
            <img
              src={theme === "dark" ? DarkLogo : LightLogo}
              alt="Logo"
              className="w-14"
            />
            <a href="#" className="font-bold text-2xl sm:text-3xl ml-2">
              Roucha Cielo
            </a>
          </div>

          {/* Cart & Theme Toggle */}
          <div className="flex items-center gap-4">
            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative bg-gradient-to-r from-primary to-secondary text-white py-1 px-4 rounded-full flex items-center gap-3"
            >
              <FaCartShopping className="text-xl" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 text-sm bg-red-500 text-white rounded-full px-2 py-0.5">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
            >
              {theme === "dark" ? "🌙" : "☀️"}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="sm:hidden p-2 rounded-full bg-gray-200 dark:bg-gray-700"
            >
              {menuOpen ? <IoClose className="text-2xl" /> : <IoMenu className="text-2xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Navbar */}
      <div className="hidden sm:flex justify-center py-4">
        <ul className="flex items-center gap-6 text-lg">
          <li>
            <Link
              to="/"
              className={`inline-block px-6 duration-200 ${
                isActive("/") ? "font-bold text-red-500" : "hover:text-primary"
              }`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/products"
              className={`inline-block px-6 duration-200 ${
                isActive("/products") ? "font-bold text-red-500" : "hover:text-primary"
              }`}
            >
              Product
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={`inline-block px-6 duration-200 ${
                isActive("/about") ? "font-bold text-red-500" : "hover:text-primary"
              }`}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className={`inline-block px-6 duration-200 ${
                isActive("/contact") ? "font-bold text-red-500" : "hover:text-primary"
              }`}
            >
              Contact
            </Link>
          </li>
        </ul>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-screen w-3/4 sm:w-1/2 bg-white dark:bg-gray-900 p-6 transition-transform transform ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } z-50 shadow-lg`}
      >
        <button
          className="absolute top-4 right-4 text-2xl"
          onClick={() => setMenuOpen(false)}
        >
          <IoClose />
        </button>
        <ul className="flex flex-col gap-6 text-lg mt-10">
          <li>
            <Link to="/" className={`block ${isActive("/") && "font-bold text-red-500"}`} onClick={() => setMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/products" className={`block ${isActive("/products") && "font-bold text-red-500"}`} onClick={() => setMenuOpen(false)}>
              Product
            </Link>
          </li>
          <li>
            <Link to="/about" className={`block ${isActive("/about") && "font-bold text-red-500"}`} onClick={() => setMenuOpen(false)}>
              About
            </Link>
          </li>
          <li>
            <Link to="/contact" className={`block ${isActive("/contact") && "font-bold text-red-500"}`} onClick={() => setMenuOpen(false)}>
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
