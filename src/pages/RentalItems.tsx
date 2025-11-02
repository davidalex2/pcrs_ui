import React, { useState, useEffect } from 'react';
import { rentalItemsService } from '../services/rentalItemsService';
import type { RentalItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { data, useParams } from 'react-router-dom';
import { Plus, Edit, Package } from 'lucide-react';
import { rentalOrdersService } from '../services/rentalOrdersService';
import type { RentalOrder } from '../types';
import RentalItemModal from '../components/RentalItemModal';
import ImageCarousel from '../components/ImageCarousel';

const RentalItems: React.FC = () => {
  const [items, setItems] = useState<RentalItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RentalItem | null>(null);
  // default to showing the logged-in user's items on this page
  const [showMine, setShowMine] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const params = useParams();
  // route may provide either `userId` or `id` depending on route config
  const routeUserId = (params as any).userId || (params as any).id || undefined;
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderItem, setOrderItem] = useState<RentalItem | null>(null);
  const [orderStart, setOrderStart] = useState('');
  const [orderEnd, setOrderEnd] = useState('');
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewItem, setViewItem] = useState<RentalItem | null>(null);

  const calculateOrderDays = () => {
    if (!orderStart || !orderEnd) return 0;
    const s = new Date(orderStart);
    const e = new Date(orderEnd);
    const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 0;
  };

  const handleCreateOrder = async () => {
    if (!orderItem) return;
    if (!orderStart || !orderEnd) {
      setError('Please select start and end dates');
      return;
    }

  const days = calculateOrderDays();
  const pricePerDay = orderItem.amount ?? orderItem.item_price ?? 0;
    const total = days * pricePerDay;

    const order = {
      itemId: orderItem.item_id!,
      startDate: orderStart,
      endDate: orderEnd,
      totalPrice: total,
    } as RentalOrder;

    try {
      setCreatingOrder(true);
      await rentalOrdersService.create(order);
  setOrderModalOpen(false);
      setOrderItem(null);
      // refresh items if needed
      loadItems(showMine);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create order');
    } finally {
      setCreatingOrder(false);
    }
  };

  useEffect(() => {
    // Wait until auth finishes initializing so we can reliably read user id
    if (authLoading) return;
    // If a user id is present in the route, load that user's items.
    // Otherwise fall back to showMine toggle or all items.
    loadItems(showMine, routeUserId);
  }, [showMine, routeUserId, user, authLoading]);

  const loadItems = async (onlyMine = false, routeUserIdParam?: string) => {
    try {
      setItemsLoading(true);
      let data: RentalItem[] = [];
      // Derive a normalized current user id from common possible fields
      const currentUserId = user?.user_id ?? (user as any)?.userId ?? (user as any)?.id ?? (user as any)?.userid ?? undefined;
      if (routeUserIdParam) {
        // load items for the user id provided by the route
        data = await rentalItemsService.getByUserId(routeUserIdParam);
        console.log("got the user id:: "+user?.user_id+ " from router:: "+routeUserId)
        console.log("loading items for route user id: "+routeUserIdParam);
      } else {
        if (onlyMine) {
          if (!currentUserId) {
            setError('You must be logged in to view your items');
            data = [];
          } else {
            data = await rentalItemsService.getByUserId(currentUserId);
          }
        } else {
          // default: load all items
          data = await rentalItemsService.getAll();
          // If the current user is logged in, exclude their own items from the public listing
          // (so users don't see their own products in the general rental page). Use only when
          // not explicitly asking to show only mine or viewing a route user's page.
          if (currentUserId) {
            data = data.filter((it) => it.user_id !== currentUserId);
          }
        }
      }
      //  else {
      //   // default: load all items
      //   data = await rentalItemsService.getByUserId(user.user_id);
      //   // If the current user is logged in, exclude their own items from the public listing
      //   // (so users don't see their own products in the general rental page). Use only when
      //   // not explicitly asking to show only mine or viewing a route user's page.
      //   if (user?.user_id && !onlyMine && !routeUserIdParam) {
      //     data = data.filter((it) => it.user_id !== user.user_id);
      //   }
      // }
      // else {
      //   data = await rentalItemsService.getAll();
      // }
      setItems(data);
    } catch (err: any) {
      console.log(data)
      setError('Failed to load rental items');
    } finally {
      setItemsLoading(false);
    }
  };
   console.log("got the user details:: "+user?.address)
console.log("got the user id:: "+user?.user_id+ " from router:: "+routeUserId)
  const handleCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: RentalItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await rentalItemsService.delete(id);
      loadItems();
    } catch (err: any) {
      alert('Failed to delete item');
    }
  };

  const handleModalClose = (shouldReload = false) => {
    setIsModalOpen(false);
    setEditingItem(null);
    if (shouldReload) {
      loadItems();
    }
  };

  if (itemsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 animate-fade-in-up">
          <div>
            <h1 className="text-3xl font-bold text-primary-900 mb-2 animate-slide-in">Rental Items</h1>
            <p className="text-gray-600 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>Manage your rental inventory</p>
          </div>
          <div className="flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <button 
              onClick={handleCreate} 
              className="btn btn-primary flex items-center group hover:scale-105 transition-transform duration-300"
            >
              <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              Add Item
            </button>

            <button
              onClick={() => setShowMine((s) => !s)}
              className={`btn ${showMine ? 'btn-outline' : 'btn-ghost'} hover:scale-105 transition-transform duration-300`}
            >
              {showMine ? 'Showing: My Items' : 'Show My Items'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 animate-scale-in">
            {error}
          </div>
        )}

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-primary-100 text-center py-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Package className="w-16 h-16 text-primary-300 mx-auto mb-4 animate-scale-in hover:scale-110 transition-transform duration-300" style={{ animationDelay: '0.5s' }} />
          <p className="text-primary-600 mb-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>No rental items found</p>
          <button onClick={handleCreate} className="btn btn-primary animate-scale-in hover:scale-105 transition-transform duration-300" style={{ animationDelay: '0.7s' }}>
            Add First Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <div 
              key={item.item_id} 
              className="bg-white rounded-2xl shadow-sm border border-primary-100 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div>
                  <ImageCarousel
                    images={(item.image_names && item.image_names.split(',').map(s => s.trim()).filter(Boolean)) || item.item_images || []}
                    alt={item.item_name}
                  />
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-primary-900 mb-2 group-hover:text-primary-700 transition-colors duration-300">{item.item_name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 group-hover:text-primary-600 transition-colors duration-300">{item.description || item.item_description || 'No description'}</p>

                  <div className="flex items-center justify-between mb-4 animate-fade-in-up" style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium text-primary-700">{item.address || item.item_location || 'N/A'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Price</p>
                      <p className="font-bold text-primary-600 group-hover:scale-110 transition-transform duration-300">₹{(item.amount ?? item.item_price ?? 0).toLocaleString()}/day</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mb-4 animate-fade-in-up" style={{ animationDelay: `${0.4 + index * 0.1}s` }}>
                    {typeof item.available === 'number' && item.available === 0 ? (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 animate-pulse-soft">Unavailable</span>
                    ) : (
                      <>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 animate-pulse-soft">Available</span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 animate-pulse-soft">Count: {typeof item.available === 'number' ? item.available : 0}</span>
                      </>
                    )}
                  </div>

                  <div className="mt-4">
                    {(() => {
                      const canEdit = !!(user?.user_id && item.user_id === user.user_id) || (routeUserId && routeUserId === user?.user_id);
                      if (canEdit) {
                        return (
                          <div className="flex space-x-2 animate-fade-in-up" style={{ animationDelay: `${0.5 + index * 0.1}s` }}>
                            <button 
                              onClick={() => handleEdit(item)} 
                              className="btn btn-secondary flex-1 hover:scale-105 transition-transform duration-300 group"
                            >
                              <Edit className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300"/>
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(item.item_id!)} 
                              className="btn btn-danger hover:scale-105 transition-transform duration-300"
                            >
                              Delete
                            </button>
                          </div>
                        );
                      }

                      return (
                        <div className="flex gap-2">
                          <button className="btn btn-outline" onClick={() => { setViewItem(item); setViewModalOpen(true); }}>View</button>
                          <button className="btn btn-primary flex-1" onClick={() => { setOrderItem(item); setOrderStart(''); setOrderEnd(''); setOrderModalOpen(true); }}>Order</button>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <RentalItemModal item={editingItem} onClose={handleModalClose} />
      )}

      {/* View details modal */}
      {viewModalOpen && viewItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full p-6">
            <div className="flex items-start gap-6">
              <div className="w-1/2">
                <ImageCarousel images={(viewItem.image_names && viewItem.image_names.split(',').map(s => s.trim()).filter(Boolean)) || viewItem.item_images || []} alt={viewItem.item_name} />
              </div>
              <div className="w-1/2">
                <h2 className="text-2xl font-bold mb-2">{viewItem.item_name}</h2>
                <p className="text-gray-600 mb-4">{viewItem.description || viewItem.item_description}</p>
                <div className="mb-3">
                  <div className="text-sm text-gray-500">Location</div>
                  <div className="font-medium">{viewItem.address || viewItem.item_location || 'N/A'}</div>
                </div>
                <div className="mb-3">
                  <div className="text-sm text-gray-500">Price</div>
                  <div className="text-2xl font-bold">₹{(viewItem.amount ?? viewItem.item_price ?? 0).toLocaleString()}/day</div>
                </div>
                <div className="mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${viewItem.item_availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {viewItem.item_availability ? 'Available' : 'Unavailable'}
                  </span>
                </div>

                <div className="flex items-center gap-3 mt-6">
                  <button onClick={() => { setViewModalOpen(false); }} className="btn btn-secondary">Close</button>
                  <button onClick={() => { setOrderItem(viewItem); setOrderModalOpen(true); setViewModalOpen(false); }} className="btn btn-primary">Order</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inline Order modal for non-owners */}
      {orderModalOpen && orderItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Order: {orderItem.item_name}</h2>
              <button onClick={() => setOrderModalOpen(false)} className="text-gray-500">Close</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="label">Start Date</label>
                <input type="date" className="input" value={orderStart} onChange={(e) => setOrderStart(e.target.value)} />
              </div>
              <div>
                <label className="label">End Date</label>
                <input type="date" className="input" value={orderEnd} onChange={(e) => setOrderEnd(e.target.value)} />
              </div>

              <div>
                <label className="label">Days</label>
                <div className="text-lg">{calculateOrderDays()}</div>
              </div>

              <div>
                <label className="label">Total Price</label>
                <div className="text-2xl font-bold">₹{(calculateOrderDays() * (orderItem.amount ?? orderItem.item_price ?? 0)).toLocaleString()}</div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button onClick={() => setOrderModalOpen(false)} className="btn btn-secondary" disabled={creatingOrder}>Cancel</button>
                <button onClick={handleCreateOrder} className="btn btn-primary" disabled={creatingOrder}>{creatingOrder ? 'Placing...' : 'Place Order'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default RentalItems;

