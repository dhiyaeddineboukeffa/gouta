import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState("Active");

  const fetchAllOrders = async () => {
    if (!token) {
      return null;
    }

    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        const fetchedOrders = response.data.orders.reverse();
        setOrders(fetchedOrders);
        
        // If we are viewing a specific order, update it with new data
        if (selectedOrder) {
          const updatedSelected = fetchedOrders.find(o => o._id === selectedOrder._id);
          if (updatedSelected) {
            setSelectedOrder(updatedSelected);
          }
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const statusHandler = async (event, orderId) => {
    const newStatus = event.target.value;
    
    // Optimistic UI update
    if (selectedOrder && selectedOrder._id === orderId) {
      setSelectedOrder(prev => ({ ...prev, status: newStatus }));
    }
    
    // Optimistically update the list as well
    setOrders(prevOrders => 
      prevOrders.map(o => o._id === orderId ? { ...o, status: newStatus } : o)
    );

    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status: newStatus },
        { headers: { token } }
      );
      if (response.data.success) {
        // Backend successfully updated, fetch latest in background just in case
        fetchAllOrders();
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update status");
      // Revert if necessary (optional)
      fetchAllOrders(); 
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  if (selectedOrder) {
    return (
      <div className="max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => setSelectedOrder(null)}
            className="px-4 py-2 border rounded font-semibold text-gray-600 hover:bg-gray-50 flex items-center gap-2"
          >
            &larr; Back to Orders
          </button>
          <button 
            onClick={fetchAllOrders}
            className="px-4 py-2 border rounded font-semibold text-[#1E3A8A] border-[#1E3A8A] hover:bg-blue-50 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Order
          </button>
        </div>
        
        <div className="bg-white border p-8 rounded shadow-sm">
          <div className="flex justify-between items-start border-b pb-6 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#1E3A8A]">Order Details</h2>
              <p className="text-gray-500 mt-1">Placed on: {new Date(selectedOrder.date).toLocaleString()}</p>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Update Status</label>
              <select
                onChange={(event) => statusHandler(event, selectedOrder._id)}
                value={selectedOrder.status}
                className="p-2 font-semibold bg-gray-50 border rounded outline-none cursor-pointer"
              >
                <option value="Waiting to call">Waiting to call</option>
                <option value="On hold">On hold</option>
                <option value="Shipped">Shipped</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-50 p-6 rounded border border-gray-100">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Client Information</h3>
              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Name</p>
                  <p className="font-bold text-lg text-gray-800">{selectedOrder.address?.name || "Client Name"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                  <p className="font-bold text-lg text-[#1E3A8A]">{selectedOrder.address?.phone || "No Phone Provided"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Delivery Address</p>
                  <p className="font-semibold text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {typeof selectedOrder.address === 'string' ? selectedOrder.address : selectedOrder.address?.location || "No Location Provided"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Delivery Method / Transportation</p>
                  <p className="font-semibold text-white bg-[#1E3A8A] inline-block px-2 py-1 rounded text-sm mt-1">
                    {selectedOrder.address?.transportation || "Not specified"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded border border-gray-100">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Order Summary</h3>
              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                  <p className="font-bold text-3xl text-green-600">{currency} {selectedOrder.amount}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Payment Method</p>
                  <p className="font-semibold text-gray-700">{selectedOrder.paymentMethod} ({selectedOrder.payment ? "Paid" : "Pending"})</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Items</p>
                  <p className="font-semibold text-gray-700">{selectedOrder.items.length} items</p>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 border-b pb-2">Items Ordered</h3>
          <div className="flex flex-col gap-3">
            {selectedOrder.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded bg-white">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white border border-gray-100 rounded shadow-sm flex items-center justify-center p-1">
                    <img className="w-full h-full object-contain mix-blend-multiply" src={item.image[0]} alt="" />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">{currency}{item.price} each</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-500">Qty: {item.quantity}</p>
                  <p className="font-bold text-xl text-[#1E3A8A]">{currency}{item.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const filteredOrders = orders.filter(order => {
    if (filter === "All") return true;
    if (filter === "Active") return !["Completed", "Cancelled"].includes(order.status);
    return order.status === filter;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-bold text-gray-700">Manage Orders</h3>
          <button 
            onClick={fetchAllOrders}
            className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-1.5 px-3 rounded flex items-center gap-2 transition-colors border border-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 font-semibold bg-white border border-gray-300 rounded outline-none"
        >
          <option value="Active">Active Orders</option>
          <option value="All">All Orders</option>
          <option value="Waiting to call">Waiting to call</option>
          <option value="On hold">On hold</option>
          <option value="Shipped">Shipped</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredOrders.map((order, index) => (
          <div
            key={index}
            onClick={() => setSelectedOrder(order)}
            className="border border-gray-200 rounded p-5 bg-white shadow-sm hover:shadow-md hover:border-[#1E3A8A] transition-all cursor-pointer flex flex-col justify-between h-full"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <img className="w-8" src={assets.parcel_icon} alt="parcel_icon" />
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${order.status === 'Completed' ? 'bg-green-100 text-green-700' : order.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-semibold">{new Date(order.date).toLocaleDateString()}</p>
              </div>
              
              <div className="mb-4">
                <p className="font-bold text-gray-800 text-lg mb-1 line-clamp-1">
                  {order.address?.name || "Client Name"}
                </p>
                <p className="text-sm text-[#1E3A8A] font-bold">
                  {order.address?.phone || "No Phone"}
                </p>
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                  {typeof order.address === 'string' ? order.address : order.address?.location || "No Location"}
                </p>
              </div>
            </div>

            <div className="border-t pt-4 mt-2 flex justify-between items-end">
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase">Total</p>
                <p className="font-bold text-lg text-green-600">{currency} {order.amount}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 font-semibold">{order.items.length} items</p>
              </div>
            </div>
          </div>
        ))}
        {filteredOrders.length === 0 && (
          <p className="text-gray-500 col-span-full py-10 text-center">No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default Orders;
