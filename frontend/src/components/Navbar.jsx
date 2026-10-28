import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);

  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
    language,
    setLanguage,
    t
  } = useContext(ShopContext);

  const logOut = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  };

  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "fr" : "ar");
  };

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <Link to={"/"} className="flex flex-col items-center">
        <span className="text-3xl font-extrabold tracking-widest text-[#1E3A8A]">GOUTRA</span>
      </Link>

      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to={"/"} className="flex flex-col items-center gap-1">
          <p className="text-[#1E3A8A] font-bold">{t('HOME')}</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-[#1E3A8A] hidden" />
        </NavLink>
      </ul>

      <div className="flex items-center gap-6">
        <button onClick={toggleLanguage} className="font-bold text-[#1E3A8A] border border-[#1E3A8A] px-2 py-1 rounded text-xs hover:bg-blue-50 transition-colors">
          {language === "ar" ? "FR" : "عربي"}
        </button>

        <div className="group relative">
          <img
            onClick={() => (token ? null : navigate("/login"))}
            className="w-5 cursor-pointer"
            src={assets.profile_icon}
            alt="profile_icon"
          />

          {/* Dropdown Menu */}
          {token && (
            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4 z-10">
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                <p
                  onClick={() => navigate("/orders")}
                  className="cursor-pointer hover:text-black font-semibold"
                >
                  {t('MY_ORDERS')}
                </p>
                <p onClick={logOut} className="cursor-pointer hover:text-black font-semibold">
                  {t('LOGOUT')}
                </p>
              </div>
            </div>
          )}
        </div>
        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5 min-w-5" alt="cart_icon" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-[#1E3A8A] text-white aspect-square rounded-full text-[8px]">
            {getCartCount()}
          </p>
        </Link>
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt="menu_icon"
        />
      </div>

      {/* Sidebar menu for small screen */}
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${
          visible ? "w-full z-50" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <img
              className="h-4 rotate-180"
              src={assets.dropdown_icon}
              alt=""
            />
            <p>Back</p>
          </div>
          <NavLink
            onClick={() => setVisible(false)}
            className="py-2 pl-6 border-b text-[#1E3A8A] font-bold"
            to="/"
          >
            {t('HOME')}
          </NavLink>
          <div className="py-2 pl-6 border-b">
            <button onClick={() => { toggleLanguage(); setVisible(false); }} className="font-bold text-[#1E3A8A]">
              {language === "ar" ? "Français" : "العربية"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
