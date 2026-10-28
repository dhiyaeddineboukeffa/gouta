import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Transport = ({ token }) => {
  const [transports, setTransports] = useState([]);
  const [name, setName] = useState('');
  const [fee, setFee] = useState('');

  const fetchTransports = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/transport/list');
      if (response.data.success) {
        setTransports(response.data.transports);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchTransports();
  }, []);

  const addTransport = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        backendUrl + '/api/transport/add',
        { name, fee: Number(fee) },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setName('');
        setFee('');
        fetchTransports();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeTransport = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/transport/remove',
        { id },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        fetchTransports();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className='flex flex-col gap-8 max-w-2xl'>
      <div className='bg-white border rounded p-6 shadow-sm'>
        <h3 className='text-xl font-bold text-[#1E3A8A] mb-4'>Add Transportation Option</h3>
        <form onSubmit={addTransport} className='flex flex-col gap-4'>
          <div>
            <p className='text-sm text-gray-600 font-semibold mb-1'>Location Name</p>
            <input 
              type='text' 
              required
              value={name} 
              onChange={(e) => setName(e.target.value)}
              placeholder='e.g., Alger Center'
              className='w-full border p-2 rounded outline-none focus:border-[#1E3A8A]'
            />
          </div>
          <div>
            <p className='text-sm text-gray-600 font-semibold mb-1'>Fee (in DZD)</p>
            <input 
              type='number' 
              required
              value={fee} 
              onChange={(e) => setFee(e.target.value)}
              placeholder='e.g., 500'
              className='w-full border p-2 rounded outline-none focus:border-[#1E3A8A]'
            />
          </div>
          <button type='submit' className='bg-[#1E3A8A] text-white py-2 rounded font-semibold hover:bg-[#1E40AF]'>
            Add Option
          </button>
        </form>
      </div>

      <div className='bg-white border rounded p-6 shadow-sm'>
        <h3 className='text-xl font-bold text-[#1E3A8A] mb-4'>Manage Options</h3>
        <div className='flex flex-col gap-3'>
          {transports.length === 0 ? (
            <p className='text-gray-500'>No options added yet.</p>
          ) : (
            transports.map((t) => (
              <div key={t._id} className='flex justify-between items-center border p-3 rounded'>
                <div>
                  <p className='font-bold text-gray-800'>{t.name}</p>
                  <p className='text-sm text-gray-500'>{t.fee === 0 ? 'Free' : t.fee + ' DZD'}</p>
                </div>
                <button 
                  onClick={() => removeTransport(t._id)}
                  className='text-red-500 hover:bg-red-50 px-3 py-1 rounded text-sm font-semibold border border-red-200'
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Transport;
