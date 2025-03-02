import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Products from "./components/Products/Products";
import AOS from "aos";
import "aos/dist/aos.css";
import TopProducts from "./components/TopProducts/TopProducts";
import Banner from "./components/Banner/Banner";
import Subscribe from "./components/Subscribe/Subscribe";
import Testimonials from "./components/Testimonials/Testimonials";
import Footer from "./components/Footer/Footer";
import Popup from "./components/Popup/Popup";

// Page components
import About from "./About_Page";
import Contact from "./Contact_Page";
import ProductPage from "./Product_Page";
import Pd from "./components/Product Detail/ProductDetail";
import Top from "./components/TopProducts/TopProducts"
import Admin from "./Admin_Dashboard"
import Cart from "./Cart"
import Checkout from "./Checkout";
import OrderSuccess from "./thanks";
import AdminPro from "./Admin_All_Products";


import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


const App = () => {
  const [orderPopup, setOrderPopup] = React.useState(false);

  const handleOrderPopup = () => {
    setOrderPopup(!orderPopup);
  };

  React.useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
  }, []);

  return (
    <Router>
      <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
        <Navbar handleOrderPopup={handleOrderPopup} />
        <Routes>
          {/* Home Route */}
          <Route
            path="/"
            element={
              <>
                <Hero handleOrderPopup={handleOrderPopup} />
                {/* <Products /> */}
                <TopProducts handleOrderPopup={handleOrderPopup} />
                <Banner />
                <Subscribe />
                <Testimonials />
                <Footer />
              </>
            }
          />


          {/* Product Detail Route */}
          <Route
            path="/ProductD/:id"
            element={
              <>
                <Pd />
                <Footer />
              </>
            }
          />

          {/* Product Detail Route */}
          <Route
            path="/TOPPRO"
            element={
              <>
                <Top />
                <Footer />
              </>
            }
          />

          {/* About Route */}
          <Route
            path="/about"
            element={
              <>
                <About />
                <Footer />
              </>
            }
          />

          {/* Contact Route */}
          <Route
            path="/contact"
            element={
              <>
                <Contact />
                <Footer />
              </>
            }
          />
          
          {/* Products Route */}
          <Route
            path="/products"
            element={
              <>
                <ProductPage />
                <Footer />
              </>
            }
          />

          {/* Cart Route */}
          <Route
            path="/cart"
            element={
              <>
                <Cart />
                <Footer />
              </>
            }
          />
          <Route
            path="/thankYou"
            element={
              <>
                <OrderSuccess />
                <Footer />
              </>
            }
          />

            {/* Cart Route */}
          <Route
            path="/checkout"
            element={
              <>
                <Checkout />
                <Footer />
              </>
            }
          />

            {/* Products Route */}
            <Route
            path="/admin"
            element={
              <>
                <Admin />
                <Footer />
              </>
            }
          />

              {/* Products Route */}
              <Route
            path="/adminpro"
            element={
              <>
                <AdminPro />
                <Footer />
              </>
            }
          />

        </Routes>
        <Popup orderPopup={orderPopup} setOrderPopup={setOrderPopup} />
      </div>
    </Router>
  );
};

export default App;
