import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import Title from "../components/Title";

const OrderDetails = () => {
  const { orderId } = useParams();
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!token) return;
        const response = await axios.post(
          backendUrl + "/api/order/userorders",
          {},
          { headers: { token } }
        );
        if (response.data.success) {
          const found = response.data.orders.find((o) => o._id === orderId);
          if (found) setOrder(found);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchOrder();
  }, [token, orderId]);

  if (!order) return <div className="py-20 text-center">Loading order details...</div>;

  return (
    <div className="border-t pt-10 min-h-[70vh]">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#1E3A8A]">Order Details</h2>
          <Link to="/orders" className="text-sm font-semibold text-gray-500 hover:text-[#1E3A8A] underline">
            Back to Orders
          </Link>
        </div>

        <div className="bg-gray-50 border rounded p-6 shadow-sm mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Date Placed</p>
              <p className="text-sm font-bold text-gray-800">{new Date(order.date).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Status</p>
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 font-bold text-xs rounded-full">
                {order.status}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Total Amount</p>
              <p className="text-lg font-bold text-[#1E3A8A]">{currency}{order.amount}</p>
            </div>
            <div className="sm:col-span-2 mt-4">
              <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Delivery Address</p>
              <div className="text-sm text-gray-800 bg-white border p-3 rounded">
                {typeof order.address === 'string' ? (
                  <p className="whitespace-pre-wrap">{order.address}</p>
                ) : (
                  <div className="flex flex-col gap-1">
                    {order.address?.name && <p className="font-semibold">{order.address.name}</p>}
                    {order.address?.phone && <p className="font-semibold text-[#1E3A8A]">{order.address.phone}</p>}
                    <p className="whitespace-pre-wrap mt-1">{order.address?.location || "No Location Provided"}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-bold text-[#1E3A8A] mb-4 border-b pb-2">Items Ordered</h3>
        <div className="flex flex-col gap-3">
          {order.items.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white border border-gray-100 rounded shadow-sm aspect-square flex items-center justify-center p-1">
                  <img className="w-full h-full object-contain mix-blend-multiply" src={item.image[0]} alt="" />
                </div>
                <div>
                  <p className="font-bold text-[#1E3A8A]">{item.name}</p>
                  <p className="text-xs text-gray-500">{currency}{item.price} each</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-800">Qty: {item.quantity}</p>
                <p className="font-bold text-md text-[#1E3A8A]">{currency}{item.price * item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
