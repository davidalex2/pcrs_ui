import React, { useEffect, useState } from 'react';
import type { RentalItem, RentalOrder } from '../types';
import { rentalItemsService } from '../services/rentalItemsService';
import { rentalOrdersService } from '../services/rentalOrdersService';
import { ShoppingCart } from 'lucide-react';
import ImageCarousel from '../components/ImageCarousel';

// View modal state
interface ViewState {
  open: boolean;
  item: RentalItem | null;
}

const Orders: React.FC = () => {
  const [items, setItems] = useState<RentalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RentalItem | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [creating, setCreating] = useState(false);
  const [view, setView] = useState<ViewState>({ open: false, item: null });


  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await rentalItemsService.getAll();
      setItems(data);
    } catch (err: any) {
      setError('Failed to load items for ordering');
    } finally {
      setLoading(false);
    }
  };

  const openOrderModal = (item: RentalItem) => {
    setSelectedItem(item);
    setStartDate('');
    setEndDate('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const s = new Date(startDate);
    const e = new Date(endDate);
    const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 0;
  };

  const handleCreateOrder = async () => {
    if (!selectedItem) return;
    if (!startDate || !endDate) {
      setError('Please select start and end dates');
      return;
    }

    const days = calculateDays();
  const pricePerDay = selectedItem.amount ?? selectedItem.item_price ?? 0;
    const total = days * pricePerDay;

    const order: RentalOrder = {
      itemId: selectedItem.item_id!,
      startDate,
      endDate,
      totalPrice: total,
    };

    try {
      setCreating(true);
      await rentalOrdersService.create(order);
      closeModal();
      // reload items/orders UI as needed
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create order');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Rental Orders</h1>
          <p className="text-gray-600">Select an item to place an order</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
      )}

      {items.length === 0 ? (
        <div className="card text-center py-12">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No items available for order</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.item_id} className="card hover:shadow-lg transition-shadow p-4">
              {/* Image area */}
              <div className="mb-4">
                <ImageCarousel images={(item.image_names && item.image_names.split(',').map(s => s.trim()).filter(Boolean)) || item.item_images || []} alt={item.item_name} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.item_name}</h3>
              <p className="text-gray-600 text-sm mb-4">{item.description || item.item_description || 'No description'}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{item.address || item.item_location || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-bold text-primary-600">₹{(item.amount ?? item.item_price)?.toLocaleString() || '0'}/day</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={() => setView({ open: true, item })} className="btn btn-outline">View</button>
                <button onClick={() => openOrderModal(item)} className="btn btn-primary flex-1">Order</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order modal */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Order: {selectedItem.item_name}</h2>
              <button onClick={closeModal} className="text-gray-500">Close</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="label">Start Date</label>
                <input type="date" className="input" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div>
                <label className="label">End Date</label>
                <input type="date" className="input" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>

              <div>
                <label className="label">Days</label>
                <div className="text-lg">{calculateDays()}</div>
              </div>

              <div>
                <label className="label">Total Price</label>
                  <div className="text-2xl font-bold">₹{(calculateDays() * (selectedItem.amount ?? selectedItem.item_price ?? 0)).toLocaleString()}</div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button onClick={closeModal} className="btn btn-secondary" disabled={creating}>Cancel</button>
                <button onClick={handleCreateOrder} className="btn btn-primary" disabled={creating}>{creating ? 'Placing...' : 'Place Order'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View modal */}
      {view.open && view.item && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full p-6">
            <div className="flex items-start gap-6">
              <div className="w-1/2">
                <ImageCarousel images={(view.item.image_names && view.item.image_names.split(',').map(s => s.trim()).filter(Boolean)) || view.item.item_images || []} alt={view.item.item_name} />
              </div>
              <div className="w-1/2">
                <h2 className="text-2xl font-bold mb-2">{view.item.item_name}</h2>
                <p className="text-gray-600 mb-4">{view.item.description || view.item.item_description}</p>
                <div className="mb-3">
                  <div className="text-sm text-gray-500">Location</div>
                  <div className="font-medium">{view.item.address || view.item.item_location || 'N/A'}</div>
                </div>
                <div className="mb-3">
                  <div className="text-sm text-gray-500">Price</div>
                  <div className="text-2xl font-bold">₹{(view.item.amount ?? view.item.item_price ?? 0).toLocaleString()}/day</div>
                </div>
                <div className="mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${view.item.item_availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {view.item.item_availability ? 'Available' : 'Unavailable'}
                  </span>
                </div>

                <div className="flex items-center gap-3 mt-6">
                  <button onClick={() => setView({ open: false, item: null })} className="btn btn-secondary">Close</button>
                  <button onClick={() => { setView({ open: false, item: null }); openOrderModal(view.item!); }} className="btn btn-primary">Order</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;

