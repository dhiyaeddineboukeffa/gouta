import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import axios from "axios";

const Orders = () => {
  const { backendUrl, token, currency, t } = useContext(ShopContext);

  const [activeOrders, setActiveOrders] = useState([]);
  const [archivedOrders, setArchivedOrders] = useState([]);

  const loadorderData = async () => {
    try {
      if (!token) {
        return null;
      }

      const response = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        let active = [];
        let archived = [];

        response.data.orders.reverse().forEach((order) => {
          if (["Shipped", "Completed", "Cancelled"].includes(order.status)) {
            archived.push(order);
          } else {
            active.push(order);
          }
        });

        setActiveOrders(active);
        setArchivedOrders(archived);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadorderData();
  }, [token]);

  const OrderCard = ({ order }) => (
    <div className="py-5 border-b border-gray-200 text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex flex-col gap-2">
        <div>
          <p className="text-sm text-gray-500 font-semibold mb-1">
            {t('ORDER_DATE')}: {new Date(order.date).toLocaleString()}
          </p>
          <p className="text-lg font-bold text-[#1E3A8A]">
            {order.items.length} {order.items.length > 1 ? t('ITEMS') : t('ITEM')} - {t('TOTAL')}: {currency}{order.amount}
          </p>
        </div>
        <div className="flex gap-2 items-center flex-wrap mt-2">
          {order.items.slice(0, 4).map((item, index) => (
            <img key={index} src={item.image[0]} className="w-12 h-12 rounded object-cover shadow-sm" alt="item" />
          ))}
          {order.items.length > 4 && (
            <div className="w-12 h-12 rounded bg-gray-100 text-gray-500 flex items-center justify-center font-bold text-xs shadow-sm">
              +{order.items.length - 4}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-col md:items-end justify-between gap-3">
        <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-[#1E3A8A] rounded-full border border-blue-200">
          <p className="min-w-2 h-2 rounded-full bg-yellow-500"></p>
          <p className="text-sm font-semibold">{order.status}</p>
        </div>
        <Link
          to={`/order/${order._id}`}
          className="text-sm bg-[#1E3A8A] text-white px-5 py-2 rounded hover:bg-[#1E40AF] font-semibold text-center transition-colors"
        >
          {t('VIEW_DETAILS')}
        </Link>
      </div>
    </div>
  );

  return (
    <div className="border-t pt-10 min-h-[70vh]">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-[#1E3A8A] mb-2">{t('MY_ORDERS')}</h2>
        <p className="text-gray-600">{t('TRACK_AND_MANAGE')}</p>
      </div>

      <div className="max-w-4xl mx-auto">
        
        {/* Active Orders Section */}
        <div className="mb-10">
          <h3 className="text-xl font-bold text-green-600 mb-4 border-b pb-2">{t('ACTIVE_ORDERS')}</h3>
          {activeOrders.length === 0 ? (
            <p className="text-center text-gray-500 py-6">{t('NO_ACTIVE_ORDERS')}</p>
          ) : (
            activeOrders.map((order) => <OrderCard key={order._id} order={order} />)
          )}
        </div>

        {/* Archived Orders Section */}
        <div className="mb-10">
          <h3 className="text-xl font-bold text-gray-500 mb-4 border-b pb-2">{t('ARCHIVED_ORDERS')}</h3>
          {archivedOrders.length === 0 ? (
            <p className="text-center text-gray-500 py-6">{t('NO_PAST_ORDERS')}</p>
          ) : (
            archivedOrders.map((order) => <OrderCard key={order._id} order={order} />)
          )}
        </div>

      </div>
    </div>
  );
};

export default Orders;
