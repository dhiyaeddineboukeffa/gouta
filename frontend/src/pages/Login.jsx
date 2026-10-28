import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const { token, setToken, navigate, backendUrl, t } = useContext(ShopContext);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(backendUrl + "/api/user/enter", {
        name,
        phone,
      });

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{t('WELCOME_TO_GOUTRA')}</p>
        <hr className="border-none h-[1.5px] w-8 bg-[#1E3A8A]" />
      </div>
      <p className="text-center text-gray-500 mb-4">{t('ENTER_YOUR_DETAILS')}</p>
      
      <input
        onChange={(e) => setName(e.target.value)}
        value={name}
        type="text"
        className="w-full px-3 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#1E3A8A]"
        placeholder={t('FULL_NAME')}
        required
      />
      <input
        onChange={(e) => setPhone(e.target.value)}
        value={phone}
        type="tel"
        className="w-full px-3 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#1E3A8A]"
        placeholder={t('PHONE_NUMBER')}
        required
      />
      
      <button className="w-full bg-[#1E3A8A] text-white font-semibold rounded px-8 py-3 mt-4 hover:bg-[#1E40AF] transition-colors">
        {t('ENTER_APP')}
      </button>
    </form>
  );
};

export default Login;
