import React from "react";
import Image1 from "../../assets/hero/Hoodie.png";
import Image2 from "../../assets/hero/Tshirt.png";
import Image3 from "../../assets/hero/T-shirt-Model.png"
import Image4 from "../../assets/hero/T-shirt-Model-2.png"
import Slider from "react-slick";
import { Link } from "react-router-dom";

const ImageList = [
  {
    id: 1,
    img: Image4,
    title: "MAKE YOUR SUMMER MEMORABLE WITH US",
    description: "Shop Now",
  },
  {
    id: 2,
    img: Image3,
    title: "MAKE YOUR SUMMER MEMORABLE WITH US",
    description: "Shop Now",
  },
];

const Hero = ({ handleOrderPopup }) => {
  var settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 800,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "ease-in-out",
    pauseOnHover: false,
    pauseOnFocus: true,
  };

  return (
    <div className="relative overflow-hidden min-h-[550px] sm:min-h-[650px] bg-white flex justify-center items-center dark:bg-gray-950 dark:text-white duration-200">
      {/* background pattern */}
      <div className="h-[700px] w-[700px] bg-primary/40 absolute -top-1/2 right-0 rounded-3xl rotate-45 -z[8]"></div>
      {/* hero section */}
      <div className="container pb-8 sm:pb-0">
        <Slider {...settings}>
          {ImageList.map((data) => (
            <div key={data.id}>
              <div className="grid grid-cols-1 sm:grid-cols-2">
                {/* text content section */}
                <div className="flex flex-col justify-center gap-4 pt-12 sm:pt-0 text-center sm:text-left order-2 sm:order-1 relative z-10">
                  <h2
                    data-aos="zoom-out"
                    data-aos-duration="500"
                    data-aos-once="true"
                    className="text-4xl font-bold sm:text-5xl lg:text-6xl text-gray-900"
                  >
                    {data.title}
                  </h2>
                  <div
                    data-aos="fade-up"
                    data-aos-duration="500"
                    data-aos-delay="300"
                    className="mt-6"
                  >
                    <Link to="/products">
                      <button className="bg-black hover:bg-gray-800 text-white py-3 px-8 rounded-none text-lg font-semibold transition-all duration-300">
                        {data.description}
                      </button>
                    </Link>
                  </div>
                </div>
                {/* image section */}
                <div className="order-1 sm:order-2">
                  <div
                    data-aos="zoom-in"
                    data-aos-once="true"
                    className="relative z-10"
                  >
                    <img
                      src={data.img}
                      alt=""
                      className="w-full h-[500px] sm:h-[600px] object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Hero;
