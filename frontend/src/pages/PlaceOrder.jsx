import React, { useContext, useState, useEffect } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const PlaceOrder = () => {
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    setDelivery_fee,
    products,
    t
  } = useContext(ShopContext);

  const [location, setLocation] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [transportation, setTransportation] = useState("");
  const [transportationOptions, setTransportationOptions] = useState([]);

  useEffect(() => {
    const fetchTransportOptions = async () => {
      try {
        const response = await axios.get(backendUrl + '/api/transport/list');
        if (response.data.success) {
          const opts = response.data.transports.map(t => ({
            label: `${t.name} (${t.fee === 0 ? 'Free' : t.fee + ' DZD'})`,
            fee: t.fee,
            value: t.name
          }));
          setTransportationOptions(opts);
          if (opts.length > 0) {
            setTransportation(opts[0].value);
            setDelivery_fee(opts[0].fee);
          }
        }
      } catch (error) {
        console.log("Error fetching transport options", error);
      }
    };
    fetchTransportOptions();
  }, [backendUrl]);

  const handleTransportChange = (e) => {
    const selectedValue = e.target.value;
    setTransportation(selectedValue);
    const selectedOption = transportationOptions.find(opt => opt.value === selectedValue);
    setDelivery_fee(selectedOption ? selectedOption.fee : 0);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      let orderItems = [];

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items)
            );
            if (itemInfo) {
              itemInfo.size = item; // Keeping size field just in case it breaks anything, but not strictly needed
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      if (orderItems.length === 0) {
        toast.error("Your cart is empty");
        return;
      }

      let orderData = {
        address: {
          location,
          name,
          phone,
          transportation
        },
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };

      const response = await axios.post(
        backendUrl + "/api/order/place",
        orderData,
        { headers: { token } }
      );
      
      if (response.data.success) {
        setCartItems({});
        toast.success("Order Placed Successfully!");
        navigate("/orders");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
    >
      {/* ---------------- Left Side ---------------- */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={t('DELIVERY')} text2={t('INFORMATION')} />
        </div>
        
        <p className="text-gray-600 mb-2">{t('LEAVE_BLANK_USE_LOGIN')}</p>
        
        <div className="flex gap-3">
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="border border-gray-300 rounded py-2 px-3.5 w-full focus:outline-none focus:border-[#1E3A8A]"
            type="text"
            placeholder={t('NAME_OPTIONAL')}
          />
          <input
            onChange={(e) => setPhone(e.target.value)}
            value={phone}
            className="border border-gray-300 rounded py-2 px-3.5 w-full focus:outline-none focus:border-[#1E3A8A]"
            type="tel"
            placeholder={t('PHONE_OPTIONAL')}
          />
        </div>

        <select
          value={transportation}
          onChange={handleTransportChange}
          className="border border-gray-300 rounded py-2 px-3.5 w-full focus:outline-none focus:border-[#1E3A8A] bg-white cursor-pointer"
        >
          {transportationOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <textarea
          required
          onChange={(e) => setLocation(e.target.value)}
          value={location}
          className="border border-gray-300 rounded py-2 px-3.5 w-full min-h-[150px] focus:outline-none focus:border-[#1E3A8A]"
          placeholder={t('EXACT_LOCATION')}
        />
      </div>

      {/* ---------------- Right Side ---------------- */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12">
          <Title text1={t('PAYMENT')} text2={t('METHOD')} />
          {/* ---------------- Payment Method Selection ---------------- */}
          <div className="flex gap-3 flex-col lg:flex-row">
            <div className="flex items-center gap-3 border p-2 px-3 border-[#1E3A8A] bg-blue-50">
              <p className="min-w-3.5 h-3.5 border rounded-full bg-green-400"></p>
              <p className="text-[#1E3A8A] text-sm font-bold mx-4">
                {t('CASH_ON_DELIVERY')}
              </p>
            </div>
          </div>

          <div className="w-full text-end mt-8">
            <button
              type="submit"
              className="bg-[#1E3A8A] hover:bg-[#1E40AF] text-white px-16 py-3 text-sm font-semibold rounded transition-colors"
            >
              {t('PLACE_ORDER')}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
