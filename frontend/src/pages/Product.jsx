import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, t } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  const fetchProductData = async () => {
    products.forEach((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image && item.image[0] ? item.image[0] : "");
      }
    });
  };

  useEffect(() => {
    if (products.length > 0) {
      fetchProductData();
    }
  }, [productId, products]);

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* ------------- Product Data ------------- */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* ------------- Product Images ------------- */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer rounded-lg border border-gray-200 hover:border-[#1E3A8A] object-contain aspect-square bg-white shadow-sm p-2 mix-blend-multiply transition-colors"
                alt=""
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%] bg-white border border-gray-100 rounded-xl shadow-sm flex items-center justify-center p-8 aspect-[4/5] sm:aspect-auto sm:min-h-[500px]">
            <img className="w-full h-full object-contain mix-blend-multiply" src={image} alt="" />
          </div>
        </div>

        {/* ------------ Product Info ------------- */}
        <div className="flex-1">
          <h1 className="font-medium text-3xl mt-2 text-[#1E3A8A]">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} alt="star_icon" className="w-4" />
            <img src={assets.star_icon} alt="star_icon" className="w-4" />
            <img src={assets.star_icon} alt="star_icon" className="w-4" />
            <img src={assets.star_icon} alt="star_icon" className="w-4" />
            <img src={assets.star_icon} alt="star_icon" className="w-4" />
            <p className="pl-2 text-gray-500">(150+ {t('REVIEWS')})</p>
          </div>
          <p className="mt-5 text-4xl font-bold text-gray-800">
            {currency}{productData.price}
          </p>
          <div className="mt-4 flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${productData.stockQuantity > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <p className="text-sm font-medium text-gray-700">
              {productData.stockQuantity > 0 ? `${productData.stockQuantity} ${t('IN_STOCK')}` : t('OUT_OF_STOCK')}
            </p>
          </div>
          <p className="mt-5 text-gray-600 md:w-4/5 leading-relaxed">
            {productData.description}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center border border-gray-300 rounded overflow-hidden">
              <button 
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))} 
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-colors"
                disabled={productData.stockQuantity <= 0}
              >-</button>
              <input 
                type="number" 
                min="1"
                max={productData.stockQuantity}
                value={quantity}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val > 0 && val <= productData.stockQuantity) {
                    setQuantity(val);
                  }
                }}
                className="w-16 text-center py-3 font-semibold focus:outline-none" 
                disabled={productData.stockQuantity <= 0}
              />
              <button 
                onClick={() => setQuantity(prev => Math.min(productData.stockQuantity, prev + 1))} 
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition-colors"
                disabled={productData.stockQuantity <= 0}
              >+</button>
            </div>

            <button
              onClick={() => addToCart(productData._id, "Default", quantity)}
              disabled={productData.stockQuantity <= 0}
              className={`px-8 py-3 text-sm font-bold uppercase rounded ${productData.stockQuantity > 0 ? 'bg-[#1E3A8A] hover:bg-[#1E40AF] text-white active:bg-blue-900' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              {productData.stockQuantity > 0 ? t('ADD_TO_CART') : t('OUT_OF_STOCK')}
            </button>
          </div>
          
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p className="flex items-center gap-2">{t('QUALITY_GUARANTEE_DESC')}</p>
            <p className="flex items-center gap-2">{t('CASH_ON_DELIVERY')}</p>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
