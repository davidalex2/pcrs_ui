import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { rentalOrdersService } from '../services/rentalOrdersService';
import { rentalItemsService } from '../services/rentalItemsService';
import type { RentalItem, RentalOrder } from '../types';
import ImageCarousel from '../components/ImageCarousel';

const YourOrders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<RentalOrder[]>([]);
  const [itemsMap, setItemsMap] = useState<Record<string, RentalItem>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.user_id) {
      setLoading(false);
      setOrders([]);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        // user.user_id is defined because we checked earlier
        const [ordersResp, allItems] = await Promise.all([
         rentalOrdersService.getByUserId(user.user_id as string),
          rentalItemsService.getAll(),
        ]);

        // build map of items by id for quick lookup
        const map: Record<string, RentalItem> = {};
        allItems.forEach((it) => {
          if (it.item_id) map[it.item_id] = it;
        });

        setItemsMap(map);
        setOrders(ordersResp || []);
      } catch (err: any) {
        setError('Failed to load your orders');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user?.user_id]);

  if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;

  if (!user?.user_id) return <div className="p-6">Please login to see your orders.</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
      {error && <div className="mb-4 text-red-600">{error}</div>}

      {orders.length === 0 ? (
        <div className="card p-6">You have no orders yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => {
            const item = itemsMap[order.itemId];
            const images = (item?.image_names && item.image_names.split(',').map(s => s.trim()).filter(Boolean)) || item?.item_images || [];

            return (
              <div key={order.orderId} className="card p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <ImageCarousel images={images} alt={item?.item_name || 'item'} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{item?.item_name || 'Unknown item'}</h3>
                    <p className="text-sm text-gray-600">{item?.description || item?.item_description}</p>
                    <div className="mt-3">
                      <div className="text-sm text-gray-500">Dates</div>
                      <div className="font-medium">{order.startDate} → {order.endDate}</div>
                    </div>
                    <div className="mt-3">
                      <div className="text-sm text-gray-500">Total</div>
                      <div className="text-lg font-bold">₹{(order.totalPrice ?? 0).toLocaleString()}</div>
                    </div>
                    <div className="mt-3">
                      <div className="text-sm text-gray-500">Status</div>
                      <div className="font-medium">{order.bookingStatus || 'Pending'}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default YourOrders;
