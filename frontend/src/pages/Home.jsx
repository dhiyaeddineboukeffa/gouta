import React, { useContext } from "react";
import LatestCollection from "../components/LatestCollection";
import { ShopContext } from "../context/ShopContext";

const Home = () => {
  const { t } = useContext(ShopContext);
  return (
    <div>
      <div className="py-10 text-center">
        <h1 className="text-4xl font-bold text-[#1E3A8A] mb-4">{t('WHOLESALE_WATER_DELIVERY')}</h1>
        <p className="text-gray-600">{t('SELECT_WATER_PRODUCTS')}</p>
      </div>
      <LatestCollection />
    </div>
  );
};

export default Home;
