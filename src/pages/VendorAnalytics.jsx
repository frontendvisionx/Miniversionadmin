/**
 * Vendor Analytics Page
 * Display vendor counts by business type, category, and subcategory
 */

import React, { useState, useEffect } from 'react';
import { Card, Alert } from '../components/UI.jsx';
import Button from '../components/Button.jsx';
import AdminLayout from '../components/AdminLayout.jsx';
import { 
  BarChart3, 
  Building2, 
  Users, 
  Layers,
  Search,
  ChevronRight,
  ChevronLeft,
  Download,
  Eye,
  X,
  TrendingUp,
  MoreVertical
} from 'lucide-react';
import toast from 'react-hot-toast';
import { COLORS } from '../hooks/useColors.js';
import { vendorAnalyticsAPI } from '../services/api.js';

// Vendor List Modal Component
const VendorListModal = ({ vendors, businessTypeName, onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  // Add null check
  const vendorList = vendors || [];
  
  const totalPages = Math.ceil(vendorList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVendors = vendorList.slice(startIndex, endIndex);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '16px',
        maxWidth: '1200px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
      }}>
        {/* Modal Header */}
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.adminMain}, ${COLORS.adminDark})`,
          padding: '24px',
          borderRadius: '16px 16px 0 0',
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '24px' }}>Vendors - {businessTypeName}</h2>
            <p style={{ margin: '4px 0 0 0', opacity: 0.9, fontSize: '14px' }}>
              Total: {vendorList.length} vendors
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff' }}>
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px' }}>
          {vendorList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Users size={48} style={{ color: COLORS.accentGray, margin: '0 auto 16px' }} />
              <p style={{ color: COLORS.accentGray }}>No vendors found</p>
            </div>
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: COLORS.secondaryMain + '15', borderBottom: `2px solid ${COLORS.secondaryMain}` }}>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Vendor Name</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Business Name</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Email</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Phone</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Category</th>
                      <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentVendors.map((vendor, idx) => (
                      <tr key={vendor.userId || idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '12px' }}>
                          <div style={{ fontWeight: '600', color: COLORS.adminMain }}>{vendor.userName}</div>
                        </td>
                        <td style={{ padding: '12px', fontWeight: '500' }}>{vendor.businessName}</td>
                        <td style={{ padding: '12px', fontSize: '14px' }}>{vendor.email}</td>
                        <td style={{ padding: '12px', fontSize: '14px' }}>{vendor.phone}</td>
                        <td style={{ padding: '12px' }}>
                          <div style={{ fontSize: '14px' }}>
                            <div style={{ fontWeight: '500' }}>{vendor.category}</div>
                            {vendor.subcategory !== 'N/A' && (
                              <div style={{ color: COLORS.accentGray, fontSize: '12px' }}>
                                {vendor.subcategory}
                              </div>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600',
                            backgroundColor: vendor.isActive ? `${COLORS.success}20` : `${COLORS.error}20`,
                            color: vendor.isActive ? COLORS.success : COLORS.error
                          }}>
                            {vendor.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  gap: '16px', 
                  marginTop: '24px' 
                }}>
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      backgroundColor: currentPage === 1 ? '#e5e7eb' : COLORS.adminMain,
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>
                  
                  <span style={{ fontWeight: '600' }}>
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      backgroundColor: currentPage === totalPages ? '#e5e7eb' : COLORS.adminMain,
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const VendorAnalytics = () => {
  const [summary, setSummary] = useState(null);
  const [businessTypes, setBusinessTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 20 });
  const [view, setView] = useState('businessTypes'); // 'businessTypes', 'categories', 'subcategories'
  const [selectedBusinessType, setSelectedBusinessType] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [vendorFilters, setVendorFilters] = useState({});
  const [openMenuId, setOpenMenuId] = useState(null); // Track which action menu is open
  const [selectedVendors, setSelectedVendors] = useState([]); // Store vendors for modal

  useEffect(() => {
    fetchSummary();
    fetchBusinessTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (view === 'businessTypes') {
      fetchBusinessTypes();
    } else if (view === 'categories' && selectedBusinessType) {
      fetchCategories(selectedBusinessType._id);
    } else if (view === 'subcategories' && selectedBusinessType && selectedCategory) {
      fetchSubcategories(selectedBusinessType._id, selectedCategory._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, searchTerm, view]);

  const fetchSummary = async () => {
    try {
      const response = await vendorAnalyticsAPI.getSummary();
      if (response.success) {
        setSummary(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch summary:', error);
    }
  };

  const fetchBusinessTypes = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await vendorAnalyticsAPI.getBusinessTypes({
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm
      });
      
      if (response.success) {
        setBusinessTypes(response.data.businessTypes);
        setPagination(prev => ({ 
          ...prev, 
          total: response.data.total, 
          pages: response.data.pages 
        }));
      }
    } catch (error) {
      const errorMessage = error?.message || 'Failed to fetch business types';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async (businessTypeId) => {
    setLoading(true);
    setError('');
    try {
      const response = await vendorAnalyticsAPI.getCategories(businessTypeId, {
        page: pagination.page,
        limit: pagination.limit
      });
      
      if (response.success) {
        setCategories(response.data.categories);
        setPagination(prev => ({ 
          ...prev, 
          total: response.data.total, 
          pages: response.data.pages 
        }));
      }
    } catch (error) {
      const errorMessage = error?.message || 'Failed to fetch categories';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubcategories = async (businessTypeId, categoryId) => {
    setLoading(true);
    setError('');
    try {
      const response = await vendorAnalyticsAPI.getSubcategories(businessTypeId, categoryId, {
        page: pagination.page,
        limit: pagination.limit
      });
      
      if (response.success) {
        setSubcategories(response.data.subcategories);
        setPagination(prev => ({ 
          ...prev, 
          total: response.data.total, 
          pages: response.data.pages 
        }));
      }
    } catch (error) {
      const errorMessage = error?.message || 'Failed to fetch subcategories';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBusinessTypeClick = (businessType) => {
    setSelectedBusinessType(businessType);
    setSelectedCategory(null);
    setView('categories');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setView('subcategories');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleBackToBusinessTypes = () => {
    setView('businessTypes');
    setSelectedBusinessType(null);
    setSelectedCategory(null);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleBackToCategories = () => {
    setView('categories');
    setSelectedCategory(null);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleViewVendors = (vendors, businessTypeName) => {
    setSelectedVendors(vendors);
    setVendorFilters({ businessTypeName });
    setShowVendorModal(true);
    setOpenMenuId(null); // Close menu
  };

  const handleExport = async () => {
    try {
      const response = await vendorAnalyticsAPI.exportData({ format: 'csv' });
      if (response.success) {
        toast.success('Analytics exported successfully');
        // Handle download
      }
    } catch (error) {
      toast.error('Failed to export analytics');
    }
  };

  const toggleActionMenu = (itemId) => {
    setOpenMenuId(openMenuId === itemId ? null : itemId);
  };

  const handleNextPage = () => {
    if (pagination.page < pagination.pages) {
      setPagination(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const handlePrevPage = () => {
    if (pagination.page > 1) {
      setPagination(prev => ({ ...prev, page: prev.page - 1 }));
    }
  };

  return (
    <AdminLayout>
      <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: 'bold', 
              color: COLORS.adminMain,
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <BarChart3 size={36} />
              Vendor Analytics
            </h1>
            <p style={{ margin: '8px 0 0 0', color: COLORS.accentGray }}>
              Analyze vendor distribution across business types, categories, and subcategories
            </p>
          </div>
          
          <Button
            onClick={handleExport}
            style={{ 
              backgroundColor: COLORS.secondaryMain,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Download size={18} />
            Export Data
          </Button>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '20px', 
            marginBottom: '32px' 
          }}>
            <Card style={{ 
              padding: '24px',
              background: `linear-gradient(135deg, ${COLORS.adminMain}15, ${COLORS.adminMain}05)`,
              border: `2px solid ${COLORS.adminMain}30`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ 
                    fontSize: '14px', 
                    color: COLORS.accentGray, 
                    margin: '0 0 8px 0',
                    fontWeight: '600' 
                  }}>
                    Total Vendors
                  </p>
                  <p style={{ 
                    fontSize: '36px', 
                    fontWeight: 'bold', 
                    color: COLORS.adminMain, 
                    margin: 0 
                  }}>
                    {summary.totalVendors}
                  </p>
                </div>
                <div style={{ 
                  backgroundColor: COLORS.adminMain + '20', 
                  padding: '12px', 
                  borderRadius: '12px' 
                }}>
                  <Users size={28} style={{ color: COLORS.adminMain }} />
                </div>
              </div>
            </Card>

            <Card style={{ 
              padding: '24px',
              background: `linear-gradient(135deg, ${COLORS.secondaryMain}15, ${COLORS.secondaryMain}05)`,
              border: `2px solid ${COLORS.secondaryMain}30`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ 
                    fontSize: '14px', 
                    color: COLORS.accentGray, 
                    margin: '0 0 8px 0',
                    fontWeight: '600' 
                  }}>
                    Business Types
                  </p>
                  <p style={{ 
                    fontSize: '36px', 
                    fontWeight: 'bold', 
                    color: COLORS.secondaryMain, 
                    margin: 0 
                  }}>
                    {summary.totalBusinessTypes}
                  </p>
                </div>
                <div style={{ 
                  backgroundColor: COLORS.secondaryMain + '20', 
                  padding: '12px', 
                  borderRadius: '12px' 
                }}>
                  <Building2 size={28} style={{ color: COLORS.secondaryMain }} />
                </div>
              </div>
            </Card>

            <Card style={{ 
              padding: '24px',
              background: `linear-gradient(135deg, ${COLORS.success}15, ${COLORS.success}05)`,
              border: `2px solid ${COLORS.success}30`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ 
                    fontSize: '14px', 
                    color: COLORS.accentGray, 
                    margin: '0 0 8px 0',
                    fontWeight: '600' 
                  }}>
                    With Business Types
                  </p>
                  <p style={{ 
                    fontSize: '36px', 
                    fontWeight: 'bold', 
                    color: COLORS.success, 
                    margin: 0 
                  }}>
                    {summary.vendorsWithBusinessType}
                  </p>
                </div>
                <div style={{ 
                  backgroundColor: COLORS.success + '20', 
                  padding: '12px', 
                  borderRadius: '12px' 
                }}>
                  <TrendingUp size={28} style={{ color: COLORS.success }} />
                </div>
              </div>
            </Card>

            <Card style={{ 
              padding: '24px',
              background: `linear-gradient(135deg, ${COLORS.error}15, ${COLORS.error}05)`,
              border: `2px solid ${COLORS.error}30`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ 
                    fontSize: '14px', 
                    color: COLORS.accentGray, 
                    margin: '0 0 8px 0',
                    fontWeight: '600' 
                  }}>
                    Without Business Types
                  </p>
                  <p style={{ 
                    fontSize: '36px', 
                    fontWeight: 'bold', 
                    color: COLORS.error, 
                    margin: 0 
                  }}>
                    {summary.vendorsWithoutBusinessType}
                  </p>
                </div>
                <div style={{ 
                  backgroundColor: COLORS.error + '20', 
                  padding: '12px', 
                  borderRadius: '12px' 
                }}>
                  <Layers size={28} style={{ color: COLORS.error }} />
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Breadcrumb Navigation */}
        {(view === 'categories' || view === 'subcategories') && (
          <div style={{ 
            marginBottom: '24px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={handleBackToBusinessTypes}
              style={{
                background: 'none',
                border: 'none',
                color: COLORS.adminMain,
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <ChevronLeft size={20} />
              Business Types
            </button>
            
            {view === 'categories' && selectedBusinessType && (
              <>
                <ChevronRight size={20} style={{ color: COLORS.accentGray }} />
                <span style={{ color: COLORS.accentGray, fontSize: '16px', fontWeight: '600' }}>
                  {selectedBusinessType.businessTypeName} - Categories
                </span>
              </>
            )}
            
            {view === 'subcategories' && selectedBusinessType && selectedCategory && (
              <>
                <ChevronRight size={20} style={{ color: COLORS.accentGray }} />
                <button
                  onClick={handleBackToCategories}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: COLORS.adminMain,
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}
                >
                  {selectedBusinessType.businessTypeName}
                </button>
                <ChevronRight size={20} style={{ color: COLORS.accentGray }} />
                <span style={{ color: COLORS.accentGray, fontSize: '16px', fontWeight: '600' }}>
                  {selectedCategory.categoryName} - Subcategories
                </span>
              </>
            )}
          </div>
        )}

        {/* Search Bar (only for business types view) */}
        {view === 'businessTypes' && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ position: 'relative', maxWidth: '500px' }}>
              <Search 
                size={20} 
                style={{ 
                  position: 'absolute', 
                  left: '16px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: COLORS.accentGray 
                }} 
              />
              <input
                type="text"
                placeholder="Search business types..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 48px',
                  borderRadius: '12px',
                  border: `2px solid ${COLORS.adminMain}30`,
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = COLORS.adminMain}
                onBlur={(e) => e.target.style.borderColor = COLORS.adminMain + '30'}
              />
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <Alert type="error" style={{ marginBottom: '24px' }}>
            {error}
          </Alert>
        )}

        {/* Data Table */}
        <Card style={{ padding: '24px' }}>
          <div style={{ overflowX: 'auto' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ color: COLORS.adminMain, fontSize: '18px' }}>Loading data...</div>
              </div>
            ) : (
              <>
                {/* Business Types Table */}
                {view === 'businessTypes' && (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ 
                        backgroundColor: COLORS.secondaryMain + '15', 
                        borderBottom: `3px solid ${COLORS.secondaryMain}` 
                      }}>
                        <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Business Type</th>
                        <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600' }}>Vendor Count</th>
                        <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600' }}>Percentage</th>
                        <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', width: '60px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {businessTypes.length === 0 ? (
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: COLORS.accentGray }}>
                            No business types found
                          </td>
                        </tr>
                      ) : (
                        businessTypes.map((item) => (
                          <tr 
                            key={item._id} 
                            style={{ 
                              borderBottom: '1px solid #e5e7eb',
                              transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.adminMain + '08'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            {/* Business Type Info */}
                            <td style={{ padding: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                {item.iconImage?.url ? (
                                  <img 
                                    src={item.iconImage.url} 
                                    alt={item.businessTypeName}
                                    style={{ 
                                      width: '40px', 
                                      height: '40px', 
                                      borderRadius: '8px', 
                                      objectFit: 'cover' 
                                    }}
                                  />
                                ) : (
                                  <div style={{ 
                                    width: '40px', 
                                    height: '40px', 
                                    borderRadius: '8px', 
                                    backgroundColor: COLORS.secondaryMain + '20',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '20px'
                                  }}>
                                    🏢
                                  </div>
                                )}
                                <div>
                                  <div style={{ fontWeight: '600', color: COLORS.adminMain }}>{item.businessTypeName}</div>
                                  <div style={{ fontSize: '12px', color: COLORS.accentGray }}>
                                    {item.categoriesCount || 0} categories
                                  </div>
                                </div>
                              </div>
                            </td>
                            
                            {/* Vendor Count */}
                            <td style={{ padding: '16px', textAlign: 'center' }}>
                              <span style={{ 
                                fontSize: '20px', 
                                fontWeight: 'bold', 
                                color: COLORS.adminMain 
                              }}>
                                {item.vendorCount}
                              </span>
                            </td>
                            
                            {/* Percentage */}
                            <td style={{ padding: '16px', textAlign: 'center' }}>
                              <div style={{ 
                                display: 'inline-block',
                                padding: '6px 16px',
                                borderRadius: '20px',
                                backgroundColor: COLORS.secondaryMain + '20',
                                color: COLORS.secondaryMain,
                                fontWeight: '600'
                              }}>
                                {item.percentage.toFixed(1)}%
                              </div>
                            </td>
                            
                            {/* Three-Dot Menu */}
                            <td style={{ padding: '16px', textAlign: 'center', position: 'relative' }}>
                              <button
                                onClick={() => toggleActionMenu(item._id)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  padding: '8px',
                                  borderRadius: '8px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.adminMain + '15'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                <MoreVertical size={20} style={{ color: COLORS.adminMain }} />
                              </button>
                              
                              {/* Dropdown Menu */}
                              {openMenuId === item._id && (
                                <>
                                  {/* Backdrop to close menu */}
                                  <div 
                                    style={{
                                      position: 'fixed',
                                      top: 0,
                                      left: 0,
                                      right: 0,
                                      bottom: 0,
                                      zIndex: 999
                                    }}
                                    onClick={() => setOpenMenuId(null)}
                                  />
                                  
                                  {/* Menu Dropdown */}
                                  <div style={{
                                    position: 'absolute',
                                    right: '40px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    backgroundColor: '#fff',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                    padding: '8px',
                                    minWidth: '200px',
                                    zIndex: 1000,
                                    border: '1px solid #e5e7eb'
                                  }}>
                                    <button
                                      onClick={() => {
                                        handleBusinessTypeClick(item);
                                        setOpenMenuId(null);
                                      }}
                                      style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        border: 'none',
                                        background: 'none',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        color: COLORS.adminMain,
                                        transition: 'background-color 0.2s'
                                      }}
                                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.adminMain + '10'}
                                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                      <Layers size={18} />
                                      View Categories
                                    </button>
                                    
                                    {item.vendorCount > 0 && (
                                      <button
                                        onClick={() => handleViewVendors(item.vendors, item.businessTypeName)}
                                        style={{
                                          width: '100%',
                                          padding: '12px 16px',
                                          border: 'none',
                                          background: 'none',
                                          textAlign: 'left',
                                          cursor: 'pointer',
                                          borderRadius: '8px',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '12px',
                                          fontSize: '14px',
                                          fontWeight: '500',
                                          color: COLORS.secondaryMain,
                                          transition: 'background-color 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.secondaryMain + '10'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                      >
                                        <Eye size={18} />
                                        View Vendors ({item.vendorCount})
                                      </button>
                                    )}
                                  </div>
                                </>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}

                {/* Categories Table */}
                {view === 'categories' && selectedBusinessType && (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ 
                        backgroundColor: COLORS.secondaryMain + '15', 
                        borderBottom: `3px solid ${COLORS.secondaryMain}` 
                      }}>
                        <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Category</th>
                        <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600' }}>Vendor Count</th>
                        <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600' }}>Percentage</th>
                        <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', width: '60px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.length === 0 ? (
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: COLORS.accentGray }}>
                            No categories found
                          </td>
                        </tr>
                      ) : (
                        categories.map((item) => (
                          <tr 
                            key={item._id} 
                            style={{ 
                              borderBottom: '1px solid #e5e7eb',
                              transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.adminMain + '08'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <td style={{ padding: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                {item.categoryIcon?.url ? (
                                  <img 
                                    src={item.categoryIcon.url} 
                                    alt={item.categoryName}
                                    style={{ 
                                      width: '40px', 
                                      height: '40px', 
                                      borderRadius: '8px', 
                                      objectFit: 'cover' 
                                    }}
                                  />
                                ) : (
                                  <div style={{ 
                                    width: '40px', 
                                    height: '40px', 
                                    borderRadius: '8px', 
                                    backgroundColor: COLORS.secondaryMain + '20',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '20px'
                                  }}>
                                    📁
                                  </div>
                                )}
                                <div>
                                  <div style={{ fontWeight: '600', color: COLORS.adminMain }}>{item.categoryName}</div>
                                  <div style={{ fontSize: '12px', color: COLORS.accentGray }}>
                                    {item.subcategoriesCount || 0} subcategories
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: '16px', textAlign: 'center' }}>
                              <span style={{ 
                                fontSize: '20px', 
                                fontWeight: 'bold', 
                                color: COLORS.adminMain 
                              }}>
                                {item.vendorCount}
                              </span>
                            </td>
                            <td style={{ padding: '16px', textAlign: 'center' }}>
                              <div style={{ 
                                display: 'inline-block',
                                padding: '6px 16px',
                                borderRadius: '20px',
                                backgroundColor: COLORS.secondaryMain + '20',
                                color: COLORS.secondaryMain,
                                fontWeight: '600'
                              }}>
                                {item.percentage.toFixed(1)}%
                              </div>
                            </td>
                            {/* Three-Dot Menu */}
                            <td style={{ padding: '16px', textAlign: 'center', position: 'relative' }}>
                              <button
                                onClick={() => toggleActionMenu(item._id)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  padding: '8px',
                                  borderRadius: '8px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.adminMain + '15'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                <MoreVertical size={20} style={{ color: COLORS.adminMain }} />
                              </button>
                              
                              {/* Dropdown Menu */}
                              {openMenuId === item._id && (
                                <>
                                  {/* Backdrop to close menu */}
                                  <div 
                                    style={{
                                      position: 'fixed',
                                      top: 0,
                                      left: 0,
                                      right: 0,
                                      bottom: 0,
                                      zIndex: 999
                                    }}
                                    onClick={() => setOpenMenuId(null)}
                                  />
                                  
                                  {/* Menu Dropdown */}
                                  <div style={{
                                    position: 'absolute',
                                    right: '40px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    backgroundColor: '#fff',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                    padding: '8px',
                                    minWidth: '200px',
                                    zIndex: 1000,
                                    border: '1px solid #e5e7eb'
                                  }}>
                                    <button
                                      onClick={() => {
                                        handleCategoryClick(item);
                                        setOpenMenuId(null);
                                      }}
                                      style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        border: 'none',
                                        background: 'none',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        color: COLORS.adminMain,
                                        transition: 'background-color 0.2s'
                                      }}
                                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.adminMain + '10'}
                                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                      <Layers size={18} />
                                      View Subcategories
                                    </button>
                                    
                                    {item.vendorCount > 0 && (
                                      <button
                                        onClick={() => handleViewVendors(item.vendors, item.categoryName)}
                                        style={{
                                          width: '100%',
                                          padding: '12px 16px',
                                          border: 'none',
                                          background: 'none',
                                          textAlign: 'left',
                                          cursor: 'pointer',
                                          borderRadius: '8px',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '12px',
                                          fontSize: '14px',
                                          fontWeight: '500',
                                          color: COLORS.secondaryMain,
                                          transition: 'background-color 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.secondaryMain + '10'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                      >
                                        <Eye size={18} />
                                        View Vendors ({item.vendorCount})
                                      </button>
                                    )}
                                  </div>
                                </>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}

                {/* Subcategories Table */}
                {view === 'subcategories' && selectedBusinessType && selectedCategory && (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ 
                        backgroundColor: COLORS.secondaryMain + '15', 
                        borderBottom: `3px solid ${COLORS.secondaryMain}` 
                      }}>
                        <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600' }}>Subcategory</th>
                        <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600' }}>Vendor Count</th>
                        <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600' }}>Percentage</th>
                        <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', width: '60px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subcategories.length === 0 ? (
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: COLORS.accentGray }}>
                            No subcategories found
                          </td>
                        </tr>
                      ) : (
                        subcategories.map((item) => (
                          <tr 
                            key={item._id} 
                            style={{ 
                              borderBottom: '1px solid #e5e7eb',
                              transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.adminMain + '08'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <td style={{ padding: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                {item.subcategoryIcon?.url ? (
                                  <img 
                                    src={item.subcategoryIcon.url} 
                                    alt={item.subcategoryName}
                                    style={{ 
                                      width: '40px', 
                                      height: '40px', 
                                      borderRadius: '8px', 
                                      objectFit: 'cover' 
                                    }}
                                  />
                                ) : (
                                  <div style={{ 
                                    width: '40px', 
                                    height: '40px', 
                                    borderRadius: '8px', 
                                    backgroundColor: COLORS.secondaryMain + '20',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '20px'
                                  }}>
                                    📄
                                  </div>
                                )}
                                <div style={{ fontWeight: '600', color: COLORS.adminMain }}>{item.subcategoryName}</div>
                              </div>
                            </td>
                            <td style={{ padding: '16px', textAlign: 'center' }}>
                              <span style={{ 
                                fontSize: '20px', 
                                fontWeight: 'bold', 
                                color: COLORS.adminMain 
                              }}>
                                {item.vendorCount}
                              </span>
                            </td>
                            <td style={{ padding: '16px', textAlign: 'center' }}>
                              <div style={{ 
                                display: 'inline-block',
                                padding: '6px 16px',
                                borderRadius: '20px',
                                backgroundColor: COLORS.secondaryMain + '20',
                                color: COLORS.secondaryMain,
                                fontWeight: '600'
                              }}>
                                {item.percentage.toFixed(1)}%
                              </div>
                            </td>
                            {/* Three-Dot Menu */}
                            <td style={{ padding: '16px', textAlign: 'center', position: 'relative' }}>
                              <button
                                onClick={() => toggleActionMenu(item._id)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  padding: '8px',
                                  borderRadius: '8px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.adminMain + '15'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                <MoreVertical size={20} style={{ color: COLORS.adminMain }} />
                              </button>
                              
                              {/* Dropdown Menu */}
                              {openMenuId === item._id && item.vendorCount > 0 && (
                                <>
                                  {/* Backdrop to close menu */}
                                  <div 
                                    style={{
                                      position: 'fixed',
                                      top: 0,
                                      left: 0,
                                      right: 0,
                                      bottom: 0,
                                      zIndex: 999
                                    }}
                                    onClick={() => setOpenMenuId(null)}
                                  />
                                  
                                  {/* Menu Dropdown */}
                                  <div style={{
                                    position: 'absolute',
                                    right: '40px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    backgroundColor: '#fff',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                    padding: '8px',
                                    minWidth: '180px',
                                    zIndex: 1000,
                                    border: '1px solid #e5e7eb'
                                  }}>
                                    <button
                                      onClick={() => handleViewVendors(item.vendors, item.subcategoryName)}
                                      style={{
                                        width: '100%',
                                        padding: '12px 16px',
                                        border: 'none',
                                        background: 'none',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        color: COLORS.secondaryMain,
                                        transition: 'background-color 0.2s'
                                      }}
                                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.secondaryMain + '10'}
                                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                      <Eye size={18} />
                                      View Vendors ({item.vendorCount})
                                    </button>
                                  </div>
                                </>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </>
            )}
          </div>

          {/* Pagination Controls */}
          {!loading && pagination.pages > 1 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '16px', 
              marginTop: '24px',
              paddingTop: '24px',
              borderTop: '2px solid #e5e7eb'
            }}>
              <button
                onClick={handlePrevPage}
                disabled={pagination.page === 1}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: pagination.page === 1 ? 'not-allowed' : 'pointer',
                  backgroundColor: pagination.page === 1 ? '#e5e7eb' : COLORS.adminMain,
                  color: '#fff',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '16px'
                }}
              >
                <ChevronLeft size={20} />
                Previous
              </button>
              
              <div style={{ 
                padding: '10px 20px',
                borderRadius: '8px',
                backgroundColor: COLORS.secondaryMain + '20',
                color: COLORS.secondaryMain,
                fontWeight: 'bold',
                fontSize: '16px'
              }}>
                Page {pagination.page} of {pagination.pages}
              </div>

              <button
                onClick={handleNextPage}
                disabled={pagination.page === pagination.pages}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: pagination.page === pagination.pages ? 'not-allowed' : 'pointer',
                  backgroundColor: pagination.page === pagination.pages ? '#e5e7eb' : COLORS.adminMain,
                  color: '#fff',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '16px'
                }}
              >
                Next
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </Card>
      </div>

      {/* Vendor List Modal */}
      {showVendorModal && (
        <VendorListModal
          vendors={selectedVendors}
          businessTypeName={vendorFilters.businessTypeName}
          onClose={() => setShowVendorModal(false)}
        />
      )}
    </AdminLayout>
  );
};

export default VendorAnalytics;
