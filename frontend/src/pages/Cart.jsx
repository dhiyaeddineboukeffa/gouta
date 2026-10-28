import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate, t } =
    useContext(ShopContext);

  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            tempData.push({
              _id: items,
              size: item,
              quantity: cartItems[items][item],
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  return (
    <div className="border-t pt-14 min-h-[70vh]">
      <div className="text-2xl mb-3">
        <Title text1={t('CART').split(' ')[0]} text2={t('CART').split(' ')[1] || ''} />
      </div>

      <div>
        {cartData.map((item, index) => {
          const productData = products.find(
            (product) => product._id === item._id
          );

          if (!productData) return null;

          return (
            <div
              key={index}
              className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 sm:w-20 bg-white border border-gray-100 rounded shadow-sm aspect-square flex items-center justify-center p-1">
                  <img
                    className="w-full h-full object-contain mix-blend-multiply"
                    src={productData.image[0]}
                    alt=""
                  />
                </div>
                <div>
                  <p className="text-sm sm:text-lg font-bold text-[#1E3A8A]">
                    {productData.name}
                  </p>
                  <div className="flex items-center gap-5 mt-2">
                    <p className="font-semibold text-gray-800">
                      {currency}
                      {productData.price}
                    </p>
                  </div>
                </div>
              </div>
              <input
                onChange={(e) =>
                  e.target === "" || e.target.value === "0"
                    ? null
                    : updateQuantity(
                        item._id,
                        item.size,
                        Number(e.target.value)
                      )
                }
                className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1 rounded"
                type="number"
                min={1}
                defaultValue={item.quantity}
              />
              <img
                onClick={() => updateQuantity(item._id, item.size, 0)}
                className="w-4 mr-4 sm:w-5 cursor-pointer hover:opacity-75"
                src={assets.bin_icon}
                alt="bin_icon"
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            <button
              onClick={() => navigate("/place-order")}
              className="bg-[#1E3A8A] hover:bg-[#1E40AF] text-white font-semibold text-sm my-8 px-8 py-4 rounded transition-colors"
            >
              {t('PROCEED_TO_CHECKOUT')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
