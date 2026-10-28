import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price, stockQuantity }) => {
  const { currency } = useContext(ShopContext);
  const isOutOfStock = stockQuantity === 0;

  return (
    <div className={`group ${isOutOfStock ? 'opacity-70' : ''}`}>
      <Link className="text-gray-700 cursor-pointer block" to={`/product/${id}`}>
        <div className="overflow-hidden bg-white border border-gray-100 rounded-xl shadow-sm group-hover:shadow-md group-hover:border-[#1E3A8A] transition-all flex items-center justify-center p-4 aspect-square relative">
          <img
            className="group-hover:scale-110 transition ease-in-out duration-500 w-full h-full object-contain mix-blend-multiply"
            src={image && image[0] ? image[0] : ""}
            alt={name}
          />
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/40 flex items-center justify-center">
              <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded shadow">OUT OF STOCK</span>
            </div>
          )}
        </div>
        <div className="pt-4 flex flex-col items-center text-center px-2">
          <p className="pb-1 text-sm font-bold text-gray-800 line-clamp-1">{name}</p>
          <p className="text-[15px] font-bold text-[#1E3A8A]">
            {currency} {price}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ProductItem;
