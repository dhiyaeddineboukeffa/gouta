import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  
  // States for the inline edit form
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");

      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const updateStock = async (productId, newStock) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/product/updateStock",
        { productId, stockQuantity: newStock },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setEditName(item.name);
    setEditPrice(item.price);
    setEditStock(item.stockQuantity);
    setEditDesc(item.description);
  };

  const saveEdit = async (productId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/product/edit",
        { 
          productId, 
          name: editName, 
          description: editDesc, 
          price: editPrice, 
          stockQuantity: editStock 
        },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setEditingId(null);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className="mb-2 font-bold text-lg text-[#1E3A8A]">All Products List</p>
      <div className="flex flex-col gap-2">
        {/* -------- List Table Title -------- */}
        <div className="hidden md:grid grid-cols-[1fr_2.5fr_1fr_1.5fr_1.5fr] items-center py-2 px-4 border bg-blue-50 text-sm font-semibold text-[#1E3A8A]">
          <b>Image</b>
          <b>Name / Description</b>
          <b>Price</b>
          <b>Stock Quantity</b>
          <b className="text-center">Action</b>
        </div>

        {/* -------- Product List -------- */}
        {list.map((item, index) => {
          if (editingId === item._id) {
            // Edit Mode Row
            return (
              <div
                className="grid grid-cols-1 md:grid-cols-[1fr_2.5fr_1fr_1.5fr_1.5fr] items-start gap-3 py-3 px-4 border text-sm bg-gray-50 rounded shadow-sm"
                key={index}
              >
                <img className="w-16 h-16 object-cover rounded shadow" src={item.image[0]} alt="" />
                <div className="flex flex-col gap-2">
                  <input 
                    type="text" 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)} 
                    className="border p-1 rounded" 
                    placeholder="Name" 
                  />
                  <textarea 
                    value={editDesc} 
                    onChange={(e) => setEditDesc(e.target.value)} 
                    className="border p-1 rounded resize-none" 
                    placeholder="Description"
                    rows="2"
                  ></textarea>
                </div>
                <div className="flex items-center">
                  <span className="mr-1">{currency}</span>
                  <input 
                    type="number" 
                    value={editPrice} 
                    onChange={(e) => setEditPrice(e.target.value)} 
                    className="border p-1 rounded w-16" 
                  />
                </div>
                <div>
                  <input 
                    type="number" 
                    value={editStock} 
                    onChange={(e) => setEditStock(e.target.value)} 
                    className="border p-1 rounded w-20" 
                  />
                </div>
                <div className="flex flex-col gap-2 md:items-center">
                  <button onClick={() => saveEdit(item._id)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 font-bold">Save</button>
                  <button onClick={() => setEditingId(null)} className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 font-bold">Cancel</button>
                </div>
              </div>
            );
          }

          // Normal Row
          return (
            <div
              className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_2.5fr_1fr_1.5fr_1.5fr] items-center gap-3 py-3 px-4 border text-sm hover:bg-gray-50 transition-colors rounded"
              key={index}
            >
              <img className="w-12 h-12 object-cover rounded shadow-sm" src={item.image[0]} alt="" />
              <div>
                <p className="font-bold text-[#1E3A8A]">{item.name}</p>
                <p className="text-xs text-gray-500 hidden md:block mt-1">{item.description}</p>
              </div>
              <p className="font-semibold text-gray-700">
                {currency}
                {item.price}
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="border p-1 w-20 rounded focus:border-[#1E3A8A] focus:outline-none"
                  defaultValue={item.stockQuantity}
                  onBlur={(e) => {
                    if (e.target.value !== String(item.stockQuantity)) {
                      updateStock(item._id, e.target.value);
                    }
                  }}
                />
              </div>
              <div className="flex justify-end md:justify-center items-center gap-4">
                <button
                  onClick={() => startEdit(item)}
                  className="text-blue-500 hover:text-blue-700 font-bold text-sm"
                >
                  Edit
                </button>
                <p
                  onClick={() => removeProduct(item._id)}
                  className="cursor-pointer text-red-500 font-bold hover:text-red-700 text-lg"
                >
                  X
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default List;
