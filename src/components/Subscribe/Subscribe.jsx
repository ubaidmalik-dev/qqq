import React, { useState } from "react";
import Banner from "../../assets/website/Terminal.png";

const BannerImg = {
  backgroundImage: `url(${Banner})`,
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  height: "100%",
  width: "100%",
  position: "relative",
};

const Subscribe = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (!email) {
      alert("⚠️ Please enter a valid email address.");
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      alert("✅ Subscription successful! Thank you for subscribing.");
      setEmail("");
      setLoading(false);
    }, 1000);
  };

  return (
    <div
      data-aos="zoom-in"
      className="mb-20 bg-gray-100 dark:bg-gray-800 text-white"
      style={BannerImg}
    >
      <div className="container backdrop-blur-sm py-10">
        <div className="space-y-6 max-w-xl mx-auto text-center">
          <h1 className="text-2xl sm:text-4xl font-semibold">
            Get Notified About New Products
          </h1>
          <form
            onSubmit={handleSubscribe}
            data-aos="fade-up"
            className="flex items-center justify-center bg-white dark:bg-gray-800 p-1 rounded-full shadow-md max-w-md mx-auto relative z-10"
          >
            <input
              type="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full p-3 rounded-full text-black bg-white outline-none relative z-10"
              required
            />
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-medium relative z-10"
              disabled={loading}
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
