/**
 * Vendor Business Type Submissions Page
 * Review and manage vendor-submitted business types
 */

import React, { useState, useEffect } from 'react';
import { Card, Alert, Badge } from '../components/UI.jsx';
import Button from '../components/Button.jsx';
import AdminLayout from '../components/AdminLayout.jsx';
import { 
  PackageCheck, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Calendar,
  Eye,
  Building2,
  FileText,
  User,
  AlertCircle,
  Filter,
  Power,
  PowerOff,
  Trash2,
  Check,
  X
} from 'lucide-react';
import { formatDate } from '../utils/helpers.js';
import toast from 'react-hot-toast';
import { COLORS } from '../hooks/useColors.js';
import { vendorSubmissionsAPI, systemConfigAPI } from '../services/api.js';

// Submission Detail Modal Component
const SubmissionDetailModal = ({ submission, onClose, onApprove, onReject, processing }) => {
  // Add custom scrollbar styles
  React.useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .custom-modal-scroll::-webkit-scrollbar {
        width: 12px;
      }
      .custom-modal-scroll::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
      }
      .custom-modal-scroll::-webkit-scrollbar-thumb {
        background: ${COLORS.secondaryMain};
        border-radius: 10px;
        border: 2px solid #f1f1f1;
      }
      .custom-modal-scroll::-webkit-scrollbar-thumb:hover {
        background: ${COLORS.secondaryDark || '#E5B800'};
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

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
      padding: '20px',
      overflow: 'auto'
    }}>
      <div className="custom-modal-scroll" style={{
        backgroundColor: '#fff',
        borderRadius: '16px',
        maxWidth: '1000px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        position: 'relative'
      }}>
        {/* Modal Header */}
        <div style={{
          background: COLORS.secondaryMain,
          padding: '24px',
          paddingRight: '60px',
          borderRadius: '16px 16px 0 0',
          color: '#1A1A1A',
          position: 'relative'
        }}>
          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(26,26,26,0.15)',
              border: '2px solid rgba(26,26,26,0.2)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(26,26,26,0.25)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(26,26,26,0.15)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <X size={20} color="#1A1A1A" strokeWidth={2.5} />
          </button>

        <div style={{ marginBottom: '8px' }}>
          <label style={{ fontSize: '12px', fontWeight: '600', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Business Type Name</label>
        </div>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '700' }}>{submission.businessTypeName}</h2>
        {submission.description && (
          <p style={{ margin: 0, opacity: 0.85, fontSize: '14px', lineHeight: '1.5' }}>{submission.description}</p>
        )}
      </div>

      {/* Modal Body */}
      <div style={{ padding: '24px' }}>
        {/* Business Icon */}
        {submission.iconImage?.url && (
          <div style={{ marginBottom: '24px', textAlign: 'center' }}>
            <label style={{ fontSize: '14px', fontWeight: '600', color: COLORS.accentGray, display: 'block', marginBottom: '12px' }}>Business Type Icon</label>
            <img 
              src={submission.iconImage.url} 
              alt="Business Icon" 
              style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '12px', 
                objectFit: 'cover',
                border: `3px solid ${COLORS.secondaryMain}`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }} 
            />
          </div>
        )}

        {/* Status & Timing */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div>
            <label style={{ fontSize: '14px', color: COLORS.accentGray, display: 'block', marginBottom: '4px', fontWeight: '600' }}>Status</label>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: `${COLORS.warning}20`,
              color: COLORS.warning,
              fontSize: '16px',
              fontWeight: '600'
            }}>
              {submission.status}
            </span>
          </div>
          {submission.daysRemaining !== null && submission.status === 'pending' && (
            <div>
              <label style={{ fontSize: '14px', color: COLORS.accentGray, display: 'block', marginBottom: '4px', fontWeight: '600' }}>Days Remaining</label>
              <div style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: submission.daysRemaining <= 3 ? COLORS.error : COLORS.success
              }}>
                {submission.daysRemaining} days
              </div>
            </div>
          )}
        </div>

        {/* Template Information */}
        <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#FFF9E6', borderRadius: '8px', border: `2px solid ${COLORS.secondaryMain}` }}>
          <h3 style={{ margin: '0 0 12px 0', color: COLORS.accentDarkGray, fontSize: '16px', fontWeight: '700' }}>
            Selected Template
          </h3>
          <div style={{ display: 'grid', gap: '8px' }}>
            <div>
              <label style={{ fontSize: '13px', color: COLORS.accentGray, fontWeight: '600' }}>Template Name:</label>
              <div style={{ fontSize: '15px', fontWeight: '600', color: COLORS.accentDarkGray }}>
                {submission.baseTemplate?.templateName || 'N/A'}
              </div>
            </div>
            {submission.baseTemplate?.category && (
              <div>
                <label style={{ fontSize: '13px', color: COLORS.accentGray, fontWeight: '600' }}>Category:</label>
                <div style={{ fontSize: '14px', color: COLORS.accentDarkGray }}>
                  {submission.baseTemplate.category}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Vendor Information */}
        <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: COLORS.accentDarkGray, fontSize: '16px', fontWeight: '700' }}>
            Vendor Information
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '13px', color: COLORS.accentGray, fontWeight: '600', display: 'block', marginBottom: '4px' }}>Business Name</label>
              <div style={{ fontSize: '16px', fontWeight: '600', color: COLORS.accentDarkGray }}>
                {submission.submittedBy?.vendorDetails?.businessName || submission.submittedBy?.name || 'N/A'}
              </div>
            </div>
            <div>
              <label style={{ fontSize: '13px', color: COLORS.accentGray, fontWeight: '600', display: 'block', marginBottom: '4px' }}>Email</label>
              <div style={{ fontSize: '15px', fontWeight: '500', color: COLORS.accentDarkGray }}>
                {submission.submittedBy?.email || 'N/A'}
              </div>
            </div>
            {submission.submittedBy?.phone && (
              <div>
                <label style={{ fontSize: '13px', color: COLORS.accentGray, fontWeight: '600', display: 'block', marginBottom: '4px' }}>Phone</label>
                <div style={{ fontSize: '15px', fontWeight: '500', color: COLORS.accentDarkGray }}>
                  {submission.submittedBy.phone}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Categories with Icons */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 12px 0', color: COLORS.accentDarkGray, fontSize: '16px', fontWeight: '700' }}>
            Categories ({submission.categories?.length || 0})
          </h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {submission.categories?.map((category, index) => (
              <div key={index} style={{ 
                padding: '16px', 
                backgroundColor: '#f9f9f9', 
                borderRadius: '8px', 
                borderLeft: `4px solid ${COLORS.secondaryMain}` 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  {category.categoryIcon?.url && (
                    <img 
                      src={category.categoryIcon.url} 
                      alt={category.categoryName}
                      style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '8px', 
                        objectFit: 'cover',
                        border: '2px solid #ddd'
                      }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700', fontSize: '15px', color: COLORS.accentDarkGray }}>
                      {category.categoryName}
                    </div>
                    {category.description && (
                      <div style={{ fontSize: '12px', color: COLORS.accentGray, marginTop: '2px' }}>
                        {category.description}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Subcategories */}
                {category.subcategories?.length > 0 && (
                  <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e0e0e0' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: COLORS.accentGray, marginBottom: '8px' }}>
                      Subcategories ({category.subcategories.length})
                    </div>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {category.subcategories.map((sub, subIndex) => (
                        <div key={subIndex} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', backgroundColor: '#fff', borderRadius: '6px' }}>
                          {sub.subcategoryIcon?.url && (
                            <img 
                              src={sub.subcategoryIcon.url} 
                              alt={sub.subcategoryName}
                              style={{ 
                                width: '32px', 
                                height: '32px', 
                                borderRadius: '6px', 
                                objectFit: 'cover',
                                border: '2px solid #ddd'
                              }}
                            />
                          )}
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: COLORS.accentDarkGray }}>
                              {sub.subcategoryName}
                            </div>
                            {sub.description && (
                              <div style={{ fontSize: '11px', color: COLORS.accentGray }}>
                                {sub.description}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Template Fields (from base template) */}
        {submission.baseTemplate?.fields && submission.baseTemplate.fields.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 12px 0', color: COLORS.accentDarkGray, fontSize: '16px', fontWeight: '700' }}>
              Template Fields ({submission.baseTemplate.fields.filter(f => !submission.excludedFields?.includes(f.fieldId)).length} active)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
              {submission.baseTemplate.fields
                .filter(field => !submission.excludedFields?.includes(field.fieldId))
                .map((field, index) => (
                  <div key={index} style={{ 
                    padding: '12px', 
                    backgroundColor: '#f9f9f9', 
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0'
                  }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: COLORS.accentDarkGray, marginBottom: '4px' }}>
                      {field.fieldLabel}
                      {field.validation?.required && (
                        <span style={{ color: COLORS.error, marginLeft: '4px' }}>*</span>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: COLORS.accentGray, backgroundColor: '#fff', padding: '4px 8px', borderRadius: '4px', display: 'inline-block' }}>
                      {field.fieldType}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Excluded Fields */}
        {submission.excludedFields && submission.excludedFields.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 12px 0', color: COLORS.error, fontSize: '16px', fontWeight: '700' }}>
              Excluded Fields ({submission.excludedFields.length})
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {submission.excludedFields.map((fieldId, index) => (
                <div key={index} style={{ 
                  padding: '6px 12px', 
                  backgroundColor: '#FFE5E5', 
                  color: COLORS.error,
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  border: `1px solid ${COLORS.error}30`
                }}>
                  {fieldId}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Fields */}
        {submission.customFields?.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 12px 0', color: COLORS.accentDarkGray, fontSize: '16px', fontWeight: '700' }}>
              Custom Fields ({submission.customFields.length})
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
              {submission.customFields.map((field, index) => (
                <div key={index} style={{ 
                  padding: '12px', 
                  backgroundColor: '#E6F7FF', 
                  borderRadius: '8px',
                  border: `2px solid ${COLORS.adminMain}40`
                }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: COLORS.accentDarkGray, marginBottom: '4px' }}>
                    {field.fieldLabel}
                    {field.validation?.required && (
                      <span style={{ color: COLORS.error, marginLeft: '4px' }}>*</span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: COLORS.accentGray, backgroundColor: '#fff', padding: '4px 8px', borderRadius: '4px', display: 'inline-block' }}>
                    {field.fieldType}
                  </div>
                  {field.placeholder && (
                    <div style={{ fontSize: '11px', color: COLORS.accentGray, marginTop: '4px', fontStyle: 'italic' }}>
                      Placeholder: {field.placeholder}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal Actions */}
      {submission.status === 'pending' && (
        <>
          {/* Approval Info Note */}
          <div style={{
            margin: '24px',
            padding: '16px',
            backgroundColor: '#E6F7FF',
            borderLeft: `4px solid ${COLORS.adminMain}`,
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ 
                backgroundColor: COLORS.adminMain, 
                borderRadius: '50%', 
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '28px',
                minHeight: '28px'
              }}>
                <AlertCircle size={16} color="#fff" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '700', fontSize: '14px', color: COLORS.accentDarkGray, marginBottom: '6px' }}>
                  When you approve this submission:
                </div>
                <ul style={{ margin: '0', paddingLeft: '20px', color: COLORS.accentGray, fontSize: '13px', lineHeight: '1.6' }}>
                  <li>✓ Converts to a <strong>system-wide standard template</strong></li>
                  <li>✓ Available to <strong>ALL users and vendors</strong> in the platform</li>
                  <li>✓ Creator marked as <strong>admin</strong> (system template)</li>
                  <li>✓ Vendor will be notified of approval</li>
                </ul>
              </div>
            </div>
          </div>

          <div style={{
            padding: '24px',
            paddingTop: '0',
            borderTop: '2px solid #f0f0f0',
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
            backgroundColor: '#fafafa'
          }}>
          <button
            onClick={onClose}
            disabled={processing}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: `2px solid ${COLORS.accentGray}`,
              background: '#fff',
              color: COLORS.accentDarkGray,
              fontSize: '16px',
              fontWeight: '600',
              cursor: processing ? 'not-allowed' : 'pointer',
              opacity: processing ? 0.6 : 1,
              transition: 'all 0.2s'
            }}
          >
            Close
          </button>
          <button
            onClick={onReject}
            disabled={processing}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              background: COLORS.error,
              color: '#fff',
              fontSize: '16px',
              fontWeight: '600',
              cursor: processing ? 'not-allowed' : 'pointer',
              opacity: processing ? 0.6 : 1,
              transition: 'all 0.2s'
            }}
          >
            {processing ? 'Processing...' : 'Reject'}
          </button>
          <button
            onClick={() => onApprove(submission._id)}
            disabled={processing}
            style={{
              padding: '12px 32px',
              borderRadius: '8px',
              border: 'none',
              background: COLORS.success,
              color: '#fff',
              fontSize: '16px',
              fontWeight: '700',
              cursor: processing ? 'not-allowed' : 'pointer',
              opacity: processing ? 0.6 : 1,
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(0,179,172,0.3)'
            }}
          >
            {processing ? 'Processing...' : '✓ Approve & Make System-Wide'}
          </button>
          </div>
        </>
      )}
      </div>
    </div>
  );
};

// Reject Modal Component
const RejectModal = ({ onClose, onConfirm, rejectionReason, setRejectionReason, processing }) => (
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
    zIndex: 1001
  }}>
    <div style={{
      backgroundColor: '#fff',
      borderRadius: '16px',
      padding: '32px',
      maxWidth: '500px',
      width: '90%',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
    }}>
      <h3 style={{ margin: '0 0 16px 0', color: COLORS.accentDarkGray }}>Reject Submission</h3>
      <p style={{ margin: '0 0 16px 0', color: COLORS.accentGray }}>
        Please provide a detailed reason for rejection. The vendor will receive this message and can resubmit with improvements.
      </p>
      <textarea
        value={rejectionReason}
        onChange={(e) => setRejectionReason(e.target.value)}
        placeholder="Enter rejection reason (minimum 10 characters)..."
        style={{
          width: '100%',
          minHeight: '120px',
          padding: '12px',
          borderRadius: '8px',
          border: `2px solid ${COLORS.accentGray}`,
          fontSize: '14px',
          resize: 'vertical',
          fontFamily: 'inherit'
        }}
      />
      <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
        <button
          onClick={onClose}
          disabled={processing}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: `2px solid ${COLORS.accentGray}`,
            background: 'transparent',
            color: COLORS.accentDarkGray,
            fontSize: '16px',
            fontWeight: '600',
            cursor: processing ? 'not-allowed' : 'pointer'
          }}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={processing || rejectionReason.trim().length < 10}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            background: COLORS.error,
            color: '#fff',
            fontSize: '16px',
            fontWeight: '600',
            cursor: (processing || rejectionReason.trim().length < 10) ? 'not-allowed' : 'pointer',
            opacity: (processing || rejectionReason.trim().length < 10) ? 0.5 : 1
          }}
        >
          {processing ? 'Processing...' : 'Confirm Rejection'}
        </button>
      </div>
    </div>
  </div>
);

const VendorBusinessTypeSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [featureEnabled, setFeatureEnabled] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });

  useEffect(() => {
    checkFeatureStatus();
    fetchSubmissions();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, pagination.page]);

  const checkFeatureStatus = async () => {
    try {
      const response = await systemConfigAPI.getVendorSubmissionsStatus();
      setFeatureEnabled(response.data.enabled);
    } catch (error) {
      console.error('Failed to check feature status:', error);
      toast.error('Failed to check feature status');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await vendorSubmissionsAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      toast.error('Failed to fetch stats');
    }
  };

  const fetchSubmissions = async () => {
    setLoading(true);
    setError('');

    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit
      };

      if (statusFilter !== 'all') {
        params.status = statusFilter
      }

      const response = await vendorSubmissionsAPI.getAllSubmissions(params);
      setSubmissions(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
      setError('Failed to load submissions');
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeature = async () => {
    try {
      setProcessing(true);
      await systemConfigAPI.toggleVendorSubmissions(!featureEnabled);
      setFeatureEnabled(!featureEnabled);
      toast.success(`Vendor submissions ${!featureEnabled ? 'enabled' : 'disabled'} successfully!`);
      fetchStats();
    } catch (error) {
      console.error('Failed to toggle feature:', error);
      toast.error('Failed to toggle feature');
    } finally {
      setProcessing(false);
    }
  };

  const handleViewDetails = (submission) => {
    setSelectedSubmission(submission);
    setShowDetailModal(true);
  };

  const handleApprove = async (submissionId) => {
    try {
      setProcessing(true);
      await vendorSubmissionsAPI.approveSubmission(submissionId, { convertToStandard: false });
      toast.success('Business type approved and made available system-wide to all users! 🎉', {
        duration: 5000,
        icon: '✅',
      });
      setShowDetailModal(false);
      setSelectedSubmission(null);
      fetchSubmissions();
      fetchStats();
    } catch (error) {
      console.error('Failed to approve submission:', error);
      toast.error('Failed to approve submission');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason || rejectionReason.trim().length < 10) {
      toast.error('Please provide a rejection reason (minimum 10 characters)');
      return;
    }

    try {
      setProcessing(true);
      await vendorSubmissionsAPI.rejectSubmission(selectedSubmission._id, { reason: rejectionReason });
      toast.success('Submission rejected successfully!');
      setShowRejectModal(false);
      setShowDetailModal(false);
      setSelectedSubmission(null);
      setRejectionReason('');
      fetchSubmissions();
      fetchStats();
    } catch (error) {
      console.error('Failed to reject submission:', error);
      toast.error('Failed to reject submission');
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (submissionId) => {
    if (!window.confirm('Are you sure you want to delete this submission? This action cannot be undone.')) {
      return;
    }

    try {
      setProcessing(true);
      await vendorSubmissionsAPI.deleteSubmission(submissionId);
      toast.success('Submission deleted successfully!');
      fetchSubmissions();
      fetchStats();
    } catch (error) {
      console.error('Failed to delete submission:', error);
      toast.error('Failed to delete submission');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return COLORS.warning;
      case 'approved':
        return COLORS.success;
      case 'rejected':
        return COLORS.error;
      case 'expired':
        return COLORS.accentGray;
      default:
        return COLORS.accentGray;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} />;
      case 'approved':
        return <CheckCircle size={16} />;
      case 'rejected':
        return <XCircle size={16} />;
      case 'expired':
        return <AlertCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  return (
    <>
      <AdminLayout>
        <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ 
          background: `linear-gradient(135deg, ${COLORS.adminMain} 0%, ${COLORS.adminDark} 100%)`,
          padding: '32px',
          borderRadius: '12px',
          marginBottom: '24px',
          boxShadow: '0 4px 12px rgba(0, 179, 172, 0.2)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ margin: 0, color: '#fff', fontSize: '32px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Building2 size={32} />
                Vendor Business Type Submissions
              </h1>
              <p style={{ margin: '8px 0 0 0', color: 'rgba(255,255,255,0.9)', fontSize: '16px' }}>
                Review and manage vendor-submitted business types
              </p>
            </div>
            <button
              onClick={handleToggleFeature}
              disabled={processing}
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                background: featureEnabled ? COLORS.error : COLORS.success,
                color: '#fff',
                fontSize: '16px',
                fontWeight: '600',
                cursor: processing ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                transition: 'transform 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseOver={(e) => !processing && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {processing ? (
                'Processing...'
              ) : featureEnabled ? (
                <>
                  <PowerOff size={18} />
                  Disable Other Business Types
                </>
              ) : (
                <>
                  <Power size={18} />
                  Allow Other Business Types
                </>
              )}
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
            {/* Total Submissions */}
            <div style={{ 
              padding: '24px',
              background: `linear-gradient(135deg, ${COLORS.secondaryMain}15, ${COLORS.secondaryMain}05)`,
              border: `2px solid ${COLORS.secondaryMain}30`,
              borderRadius: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ 
                    fontSize: '14px', 
                    color: COLORS.accentGray, 
                    margin: '0 0 8px 0',
                    fontWeight: '600' 
                  }}>
                    Total Submissions
                  </p>
                  <p style={{ 
                    fontSize: '36px', 
                    fontWeight: 'bold', 
                    color: COLORS.secondaryMain, 
                    margin: 0 
                  }}>
                    {stats.total}
                  </p>
                </div>
                <div style={{ 
                  backgroundColor: COLORS.secondaryMain + '20', 
                  padding: '12px', 
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Building2 size={24} color={COLORS.secondaryMain} />
                </div>
              </div>
            </div>
            
            {/* Pending Review */}
            <div style={{ 
              padding: '24px',
              background: `linear-gradient(135deg, ${COLORS.warning}15, ${COLORS.warning}05)`,
              border: `2px solid ${COLORS.warning}30`,
              borderRadius: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ 
                    fontSize: '14px', 
                    color: COLORS.accentGray, 
                    margin: '0 0 8px 0',
                    fontWeight: '600' 
                  }}>
                    Pending Review
                  </p>
                  <p style={{ 
                    fontSize: '36px', 
                    fontWeight: 'bold', 
                    color: COLORS.warning, 
                    margin: 0 
                  }}>
                    {stats.pending}
                  </p>
                </div>
                <div style={{ 
                  backgroundColor: COLORS.warning + '20', 
                  padding: '12px', 
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Clock size={24} color={COLORS.warning} />
                </div>
              </div>
            </div>
            
            {/* Approved */}
            <div style={{ 
              padding: '24px',
              background: `linear-gradient(135deg, ${COLORS.success}15, ${COLORS.success}05)`,
              border: `2px solid ${COLORS.success}30`,
              borderRadius: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ 
                    fontSize: '14px', 
                    color: COLORS.accentGray, 
                    margin: '0 0 8px 0',
                    fontWeight: '600' 
                  }}>
                    Approved
                  </p>
                  <p style={{ 
                    fontSize: '36px', 
                    fontWeight: 'bold', 
                    color: COLORS.success, 
                    margin: 0 
                  }}>
                    {stats.approved}
                  </p>
                </div>
                <div style={{ 
                  backgroundColor: COLORS.success + '20', 
                  padding: '12px', 
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <CheckCircle size={24} color={COLORS.success} />
                </div>
              </div>
            </div>
            
            {/* Rejected */}
            <div style={{ 
              padding: '24px',
              background: `linear-gradient(135deg, ${COLORS.error}15, ${COLORS.error}05)`,
              border: `2px solid ${COLORS.error}30`,
              borderRadius: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ 
                    fontSize: '14px', 
                    color: COLORS.accentGray, 
                    margin: '0 0 8px 0',
                    fontWeight: '600' 
                  }}>
                    Rejected
                  </p>
                  <p style={{ 
                    fontSize: '36px', 
                    fontWeight: 'bold', 
                    color: COLORS.error, 
                    margin: 0 
                  }}>
                    {stats.rejected}
                  </p>
                </div>
                <div style={{ 
                  backgroundColor: COLORS.error + '20', 
                  padding: '12px', 
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <XCircle size={24} color={COLORS.error} />
                </div>
              </div>
            </div>
            
            {/* Expiring Soon */}
            <div style={{ 
              padding: '24px',
              background: 'linear-gradient(135deg, #FF572215, #FF572205)',
              border: '2px solid #FF572230',
              borderRadius: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ 
                    fontSize: '14px', 
                    color: COLORS.accentGray, 
                    margin: '0 0 8px 0',
                    fontWeight: '600' 
                  }}>
                    Expiring Soon
                  </p>
                  <p style={{ 
                    fontSize: '36px', 
                    fontWeight: 'bold', 
                    color: '#FF5722', 
                    margin: 0 
                  }}>
                    {stats.expiringSoon}
                  </p>
                </div>
                <div style={{ 
                  backgroundColor: '#FF572220', 
                  padding: '12px', 
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <AlertCircle size={24} color="#FF5722" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '8px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', gap: '8px' }}>
          {['all', 'pending', 'approved', 'rejected', 'expired'].map(tab => (
            <button
              key={tab}
              onClick={() => {
                setStatusFilter(tab);
                setPagination({ ...pagination, page: 1 });
              }}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                background: statusFilter === tab ? COLORS.secondaryMain : 'transparent',
                color: statusFilter === tab ? '#fff' : COLORS.accentDarkGray,
                fontSize: '16px',
                fontWeight: statusFilter === tab ? '600' : '500',
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.3s',
              }}
            >
              {tab} {stats && `(${stats[tab === 'all' ? 'total' : tab] || 0})`}
            </button>
          ))}
        </div>

        {/* Submissions Table */}
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px', color: COLORS.accentGray }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
              <p>Loading submissions...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '48px', color: COLORS.error }}>
              <AlertCircle size={48} style={{ marginBottom: '16px' }} />
              <p>{error}</p>
            </div>
          ) : submissions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: COLORS.accentGray }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
              <p>No submissions found</p>
            </div>
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ 
                      backgroundColor: COLORS.secondaryMain + '15',
                      borderBottom: `2px solid ${COLORS.secondaryMain}`
                    }}>
                      <th style={{
                        padding: '16px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: COLORS.accentDarkGray,
                        fontSize: '14px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>Business Type</th>
                      <th style={{
                        padding: '16px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: COLORS.accentDarkGray,
                        fontSize: '14px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>Vendor</th>
                      <th style={{
                        padding: '16px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: COLORS.accentDarkGray,
                        fontSize: '14px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>Status</th>
                      <th style={{
                        padding: '16px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: COLORS.accentDarkGray,
                        fontSize: '14px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>Submitted</th>
                      <th style={{
                        padding: '16px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: COLORS.accentDarkGray,
                        fontSize: '14px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>Days Remaining</th>
                      <th style={{
                        padding: '16px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: COLORS.accentDarkGray,
                        fontSize: '14px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((submission) => (
                      <tr key={submission._id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {submission.iconImage?.url && (
                              <img src={submission.iconImage.url} alt="" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                            )}
                            <div>
                              <div style={{ fontWeight: '600', color: COLORS.accentDarkGray }}>{submission.businessTypeName}</div>
                              <div style={{ fontSize: '12px', color: COLORS.accentGray }}>{submission.categories?.length || 0} categories</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <div>
                            <div style={{ fontWeight: '500' }}>{submission.submittedBy?.vendorDetails?.businessName || submission.submittedBy?.name || 'Unknown'}</div>
                            <div style={{ fontSize: '12px', color: COLORS.accentGray }}>{submission.submittedBy?.email}</div>
                          </div>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            backgroundColor: `${getStatusColor(submission.status)}20`,
                            color: getStatusColor(submission.status),
                            fontSize: '14px',
                            fontWeight: '600'
                          }}>
                            {getStatusIcon(submission.status)}
                            {submission.status}
                          </span>
                        </td>
                        <td style={{ padding: '16px' }}>
                          {formatDate(submission.submittedAt)}
                        </td>
                        <td style={{ padding: '16px' }}>
                          {submission.status === 'pending' && submission.daysRemaining !== null ? (
                            <span style={{ color: submission.daysRemaining <= 3 ? COLORS.error : COLORS.success, fontWeight: '600' }}>
                              {submission.daysRemaining} days
                            </span>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td style={{ padding: '16px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => handleViewDetails(submission)}
                              style={{
                                padding: '8px',
                                borderRadius: '6px',
                                border: 'none',
                                background: COLORS.accentBlue + '20',
                                color: COLORS.accentBlue,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s'
                              }}
                              title="View Details"
                              onMouseOver={(e) => e.currentTarget.style.background = COLORS.accentBlue + '40'}
                              onMouseOut={(e) => e.currentTarget.style.background = COLORS.accentBlue + '20'}
                            >
                              <Eye size={18} />
                            </button>
                            {['rejected', 'expired'].includes(submission.status) && (
                              <button
                                onClick={() => handleDelete(submission._id)}
                                style={{
                                  padding: '8px',
                                  borderRadius: '6px',
                                  border: 'none',
                                  background: COLORS.error + '20',
                                  color: COLORS.error,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  transition: 'all 0.2s'
                                }}
                                title="Delete"
                                onMouseOver={(e) => e.currentTarget.style.background = COLORS.error + '40'}
                                onMouseOut={(e) => e.currentTarget.style.background = COLORS.error + '20'}
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '16px', borderTop: `1px solid #eee` }}>
                  <div style={{ color: COLORS.accentGray }}>
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} submissions
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                      disabled={pagination.page === 1}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: `1px solid ${COLORS.accentGray}`,
                        background: 'transparent',
                        color: COLORS.accentDarkGray,
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: pagination.page === 1 ? 'not-allowed' : 'pointer',
                        opacity: pagination.page === 1 ? 0.5 : 1
                      }}
                    >
                      Previous
                    </button>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[...Array(Math.min(pagination.pages, 5))].map((_, index) => {
                        const pageNum = index + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPagination({ ...pagination, page: pageNum })}
                            style={{
                              padding: '8px 12px',
                              borderRadius: '6px',
                              border: `1px solid ${COLORS.accentGray}`,
                              background: pagination.page === pageNum ? COLORS.secondaryMain : 'transparent',
                              color: pagination.page === pageNum ? '#fff' : COLORS.accentDarkGray,
                              fontSize: '14px',
                              fontWeight: '500',
                              cursor: 'pointer'
                            }}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                      disabled={pagination.page === pagination.pages}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: `1px solid ${COLORS.accentGray}`,
                        background: 'transparent',
                        color: COLORS.accentDarkGray,
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: pagination.page === pagination.pages ? 'not-allowed' : 'pointer',
                        opacity: pagination.page === pagination.pages ? 0.5 : 1
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        </div>
    </AdminLayout>

      {/* Detail Modal */}
      {showDetailModal && selectedSubmission && (
        <SubmissionDetailModal
          submission={selectedSubmission}
          onClose={() => setShowDetailModal(false)}
          onApprove={handleApprove}
          onReject={() => setShowRejectModal(true)}
          processing={processing}
        />
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <RejectModal
          onClose={() => setShowRejectModal(false)}
          onConfirm={handleReject}
          rejectionReason={rejectionReason}
          setRejectionReason={setRejectionReason}
          processing={processing}
        />
      )}
    </>
  );
};

export default VendorBusinessTypeSubmissions;
