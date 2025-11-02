import React, { useState, useEffect } from 'react';
import type { RentalItem } from '../types';
import { rentalItemsService } from '../services/rentalItemsService';
import { useAuth } from '../context/AuthContext';
import { X } from 'lucide-react';

interface RentalItemModalProps {
  item: RentalItem | null;
  // onClose optionally informs parent whether a reload is needed (true after save)
  onClose: (shouldReload?: boolean) => void;
}

const RentalItemModal: React.FC<RentalItemModalProps> = ({ item, onClose }) => {
  const [formData, setFormData] = useState({
    item_name: '',
    item_description: '',
    item_category: '',
    item_price: 0,
    item_location: '',
    available: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    // Always clone item into local state, never mutate props
    if (item) {
      setFormData({
        item_name: item.item_name || '',
        item_description: item.item_description || item.description || '',
        item_category: item.item_category || '',
        item_price: typeof item.amount === 'number' ? item.amount : (item.item_price ?? 0),
        item_location: item.item_location || item.address || '',
        available: typeof item.available === 'number' ? item.available : 0,
      });
    } else {
      setFormData({
        item_name: '',
        item_description: '',
        item_category: '',
        item_price: 0,
        item_location: '',
        available: 0,
      });
    }
  }, [item]);

  useEffect(() => {
    // generate previews
    if (selectedFiles.length === 0) {
      setPreviews([]);
      return;
    }

    const urls = selectedFiles.map((f) => URL.createObjectURL(f));
    setPreviews(urls);

    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [selectedFiles]);

  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Build payload using backend field names
      const payload: RentalItem = {
        // include item_id when editing so backend receives the id in body as well
        item_id: item?.item_id,
        item_name: formData.item_name,
        // backend expects `description`
        description: formData.item_description,
        // address maps to item_location
        address: formData.item_location,
        // user_id (if logged in)
        user_id: user?.user_id,
        // backend stores price in `amount`
        amount: formData.item_price,
        // available count
        available: formData.available,
        // keep image_names if editing existing item
        image_names: item?.image_names || '',
      } as RentalItem;

      let savedItem: RentalItem | null = null;

      if (item?.item_id) {
        savedItem = await rentalItemsService.update(item.item_id, payload);
      } else {
        savedItem = await rentalItemsService.create(payload);
      }

      // If user selected files, upload them to the item's upload endpoint
      if (selectedFiles.length > 0 && savedItem?.item_id) {
        try {
          await rentalItemsService.uploadImages(savedItem.item_id, selectedFiles);
        } catch (uploadErr) {
          // don't block the whole flow — show a warning
          console.warn('Image upload failed', uploadErr);
        }
      }

  // notify parent that we saved and it should reload its list
  onClose(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {item ? 'Edit Rental Item' : 'Create Rental Item'}
          </h2>
          <button
            onClick={() => onClose(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Item Name *</label>
              <input
                type="text"
                value={formData.item_name}
                onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
                className="input"
                required
              />
            </div>

            <div>
              <label className="label">Category</label>
              <input
                type="text"
                value={formData.item_category}
                onChange={(e) => setFormData({ ...formData, item_category: e.target.value })}
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              value={formData.item_description}
              onChange={(e) => setFormData({ ...formData, item_description: e.target.value })}
              className="input min-h-[100px]"
              placeholder="Item description..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Price per month (₹) *</label>
              <input
                type="number"
                value={formData.item_price}
                onChange={(e) => setFormData({ ...formData, item_price: parseFloat(e.target.value) || 0 })}
                className="input"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="label">Available Count *</label>
              <input
                type="number"
                value={formData.available}
                onChange={(e) => setFormData({ ...formData, available: parseInt(e.target.value) || 0 })}
                className="input"
                min="0"
                required
              />
            </div>

            <div>
              <label className="label">Location</label>
              <input
                type="text"
                value={formData.item_location}
                onChange={(e) => setFormData({ ...formData, item_location: e.target.value })}
                className="input"
              />
            </div>
          </div>

          {/* Availability checkbox removed; status is now based on available count */}

          <div>
            <label className="label">Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = e.target.files;
                if (files) setSelectedFiles(Array.from(files));
              }}
              className="input"
            />

            {/* Previews for newly selected images */}
            {previews.length > 0 && (
              <div className="mt-2 flex gap-2 overflow-auto">
                {previews.map((src, idx) => (
                  <img key={idx} src={src} alt={`preview-${idx}`} className="w-20 h-20 object-cover rounded" />
                ))}
              </div>
            )}

            {/* Existing images from backend (comma-separated URLs) */}
            {item?.image_names && item.image_names.split(',').length > 0 && (
              <div className="mt-2 flex gap-2 overflow-auto">
                {item.image_names.split(',').map((url, idx) => (
                  url && <img key={`existing-${idx}`} src={url} alt={`img-${idx}`} className="w-20 h-20 object-cover rounded" />
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : item ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RentalItemModal;

