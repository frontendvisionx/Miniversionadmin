/**
 * Business List Page
 * View and manage all business types
 */

import React, { useState, useEffect } from 'react';
import { businessAPI } from '../services/api.js';
import { Card, Alert, Badge } from '../components/UI.jsx';
import Button from '../components/Button.jsx';
import AdminLayout from '../components/AdminLayout.jsx';
import { Building2, Plus, Trash2, Eye, Edit, Power } from 'lucide-react';
import { formatDate } from '../utils/helpers.js';
import toast from 'react-hot-toast';
import { COLORS } from '../hooks/useColors.js';
import { useNavigate } from 'react-router-dom';

const BusinessListPage = () => {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await businessAPI.getAllBusinessTypes();

      if (response.success) {
        setBusinesses(response.data || []);
      } else {
        setError(response.message || 'Failed to fetch business types');
      }
    } catch (err) {
      const errorMessage = err?.message || 'Failed to fetch business types';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await businessAPI.deleteBusinessType(id);
      
      if (response.success) {
        toast.success('Business type deleted successfully');
        setDeleteConfirm(null);
        fetchBusinesses();
      } else {
        toast.error(response.message || 'Failed to delete business type');
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to delete business type');
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      const response = await businessAPI.togglePublishBusiness(id);
      
      if (response.success) {
        toast.success(response.message || 'Status updated successfully');
        setSelectedBusiness(null);
        fetchBusinesses();
      } else {
        toast.error(response.message || 'Failed to update status');
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to update status');
    }
  };

  // Business Details Modal
  const BusinessDetailsModal = ({ business, onClose }) => {
    if (!business) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto" shadow="lg">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                {business.iconImage?.url ? (
                  <img 
                    src={business.iconImage.url} 
                    alt={business.businessTypeName}
                    className="w-16 h-16 rounded-lg object-cover border-2"
                    style={{ borderColor: COLORS.secondaryMain }}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg flex items-center justify-center text-2xl" style={{ backgroundColor: COLORS.secondaryMain + '20' }}>
                    🏢
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-xl text-neutral-900">{business.businessTypeName}</h3>
                  <p className="text-sm text-neutral-500">Business Type</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-neutral-500 hover:text-neutral-700 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Details */}
            <div className="space-y-6">
              {/* Template */}
              <div>
                <label className="text-xs font-medium text-neutral-500 uppercase">Base Template</label>
                <p className="text-sm text-neutral-900 font-semibold mt-1">
                  {business.baseTemplate?.templateName || 'N/A'}
                </p>
              </div>

              {/* Categories */}
              <div>
                <label className="text-xs font-medium text-neutral-500 uppercase">Categories ({business.categories?.length || 0})</label>
                <div className="mt-2 space-y-3">
                  {business.categories?.map((category, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-neutral-50 border border-neutral-200">
                      <div className="flex items-center gap-2 mb-2">
                        {category.categoryIcon?.url ? (
                          <img src={category.categoryIcon.url} alt={category.categoryName} className="w-6 h-6 rounded object-cover" />
                        ) : (
                          <span className="text-lg">📁</span>
                        )}
                        <span className="font-semibold text-neutral-900">{category.categoryName}</span>
                      </div>
                      {category.subcategories && category.subcategories.length > 0 && (
                        <div className="ml-8 mt-2 space-y-1">
                          {category.subcategories.map((sub, subIdx) => (
                            <div key={subIdx} className="flex items-center gap-2 text-sm">
                              {sub.subcategoryIcon?.url ? (
                                <img src={sub.subcategoryIcon.url} alt={sub.subcategoryName} className="w-4 h-4 rounded object-cover" />
                              ) : (
                                <span>📄</span>
                              )}
                              <span className="text-neutral-700">{sub.subcategoryName}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Fields */}
              {business.customFields && business.customFields.length > 0 && (
                <div>
                  <label className="text-xs font-medium text-neutral-500 uppercase">Custom Fields ({business.customFields.length})</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {business.customFields.map((field, idx) => (
                      <Badge key={idx} variant="primary">{field.fieldLabel || field.label}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Status */}
              <div>
                <label className="text-xs font-medium text-neutral-500 uppercase">Status</label>
                <div className="mt-1">
                  <Badge variant={business.isPublished ? 'success' : 'error'}>
                    {business.isPublished ? 'Published' : 'Unpublished'}
                  </Badge>
                </div>
              </div>

              {/* Timestamps */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-neutral-500 uppercase">Created</label>
                  <p className="text-sm text-neutral-900 mt-1">{formatDate(business.createdAt)}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-500 uppercase">Updated</label>
                  <p className="text-sm text-neutral-900 mt-1">{formatDate(business.updatedAt)}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-6 pt-6 border-t border-neutral-200">
              <Button
                type="button"
                variant={business.isPublished ? 'outline' : 'primary'}
                size="md"
                fullWidth
                onClick={() => handleTogglePublish(business._id)}
                style={business.isPublished ? { 
                  borderColor: COLORS.warning, 
                  color: COLORS.warning 
                } : { 
                  backgroundColor: COLORS.success, 
                  color: 'white' 
                }}
              >
                <Power className="w-4 h-4" />
                {business.isPublished ? 'Unpublish' : 'Publish'}
              </Button>
              <Button
                type="button"
                variant="primary"
                size="md"
                fullWidth
                onClick={() => navigate(`/admin/business/edit/${business._id}`)}
                style={{ backgroundColor: COLORS.secondaryMain, color: 'white' }}
              >
                <Edit className="w-4 h-4" />
                Edit Business
              </Button>
              <Button
                type="button"
                variant="outline"
                size="md"
                fullWidth
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  // Delete Confirmation Modal
  const DeleteConfirmModal = ({ business, onClose, onConfirm }) => {
    if (!business) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md" shadow="lg">
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: COLORS.error + '20' }}>
                <Trash2 className="w-8 h-8" style={{ color: COLORS.error }} />
              </div>
              <h3 className="font-bold text-xl text-neutral-900 mb-2">Delete Business Type?</h3>
              <p className="text-neutral-600">
                Are you sure you want to delete <strong>{business.businessTypeName}</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="md"
                fullWidth
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                size="md"
                fullWidth
                onClick={() => onConfirm(business._id)}
                style={{ backgroundColor: COLORS.error, color: 'white' }}
              >
                Delete
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-3">
              <Building2 className="w-8 h-8" style={{ color: COLORS.secondaryMain }} />
              Business Management
            </h1>
            <p className="text-neutral-600 mt-2">
              Create and manage business types with categories and templates.
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/admin/business/create')}
            style={{ backgroundColor: COLORS.secondaryMain, color: 'white' }}
            className="hover:opacity-90"
          >
            <Plus className="w-5 h-5" />
            Create Business Type
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6">
            <Alert
              type="error"
              title="Error"
              message={error}
              onClose={() => setError('')}
            />
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <Card className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4" style={{ backgroundColor: COLORS.secondaryMain + '20' }}>
              <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: COLORS.secondaryMain + '40', borderTopColor: COLORS.secondaryMain }}></div>
            </div>
            <p className="font-semibold" style={{ color: COLORS.secondaryMain }}>Loading business types...</p>
          </Card>
        ) : businesses.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-4xl mb-4">🏢</div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Business Types Found</h3>
            <p className="text-neutral-600 mb-6">
              You haven't created any business types yet. Create one to get started.
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/admin/business/create')}
              style={{ backgroundColor: COLORS.secondaryMain, color: 'white' }}
              className="hover:opacity-90"
            >
              Create First Business Type
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6 border-l-4" shadow="sm" style={{ borderLeftColor: COLORS.secondaryMain }}>
                <p className="text-sm font-semibold mb-1" style={{ color: COLORS.secondaryMain }}>Total Business Types</p>
                <p className="text-3xl font-bold text-neutral-900">{businesses.length}</p>
              </Card>
              <Card className="p-6 border-l-4" shadow="sm" style={{ borderLeftColor: COLORS.secondaryMain }}>
                <p className="text-sm font-semibold mb-1" style={{ color: COLORS.secondaryMain }}>Published</p>
                <p className="text-3xl font-bold" style={{ color: COLORS.secondaryMain }}>
                  {businesses.filter((b) => b.isPublished).length}
                </p>
              </Card>
              <Card className="p-6 border-l-4" shadow="sm" style={{ borderLeftColor: COLORS.warning }}>
                <p className="text-sm font-semibold mb-1" style={{ color: COLORS.warning }}>Unpublished</p>
                <p className="text-3xl font-bold" style={{ color: COLORS.warning }}>
                  {businesses.filter((b) => !b.isPublished).length}
                </p>
              </Card>
            </div>

            {/* Business Table */}
            <Card className="p-0 overflow-hidden" shadow="md">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2" style={{ backgroundColor: COLORS.secondaryMain + '15', borderBottomColor: COLORS.secondaryMain }}>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase" style={{ color: COLORS.secondaryMain }}>
                        Business Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase" style={{ color: COLORS.secondaryMain }}>
                        Categories
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase" style={{ color: COLORS.secondaryMain }}>
                        Template
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase" style={{ color: COLORS.secondaryMain }}>
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase" style={{ color: COLORS.secondaryMain }}>
                        Created
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase" style={{ color: COLORS.secondaryMain }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {businesses.map((business) => (
                      <tr
                        key={business._id}
                        className="border-b border-neutral-200 hover:bg-neutral-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {business.iconImage?.url ? (
                              <img 
                                src={business.iconImage.url} 
                                alt={business.businessTypeName}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ backgroundColor: COLORS.secondaryMain + '20' }}>
                                🏢
                              </div>
                            )}
                            <span className="font-semibold text-neutral-900">{business.businessTypeName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-neutral-700 font-medium">
                          {business.categories?.length || 0} categories
                        </td>
                        <td className="px-6 py-4 text-neutral-700 text-sm font-medium">
                          {business.baseTemplate?.templateName || 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={business.isPublished ? 'success' : 'warning'}>
                            {business.isPublished ? 'Published' : 'Draft'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-neutral-700 text-sm font-medium">
                          {formatDate(business.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedBusiness(business)}
                              className="p-2 rounded-lg transition-all hover:scale-110"
                              style={{ backgroundColor: COLORS.secondaryMain + '20', color: COLORS.secondaryMain }}
                              title="View Details"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => navigate(`/admin/business/edit/${business._id}`)}
                              className="p-2 rounded-lg transition-all hover:scale-110"
                              style={{ backgroundColor: COLORS.success + '20', color: COLORS.success }}
                              title="Edit"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(business)}
                              className="p-2 rounded-lg transition-all hover:scale-110"
                              style={{ backgroundColor: COLORS.error + '20', color: COLORS.error }}
                              title="Delete"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedBusiness && (
        <BusinessDetailsModal
          business={selectedBusiness}
          onClose={() => setSelectedBusiness(null)}
        />
      )}

      {deleteConfirm && (
        <DeleteConfirmModal
          business={deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={handleDelete}
        />
      )}
    </AdminLayout>
  );
};

export default BusinessListPage;
