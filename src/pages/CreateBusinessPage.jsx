/**
 * Create/Edit Business Page
 * Create or edit business types with categories and templates
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { businessAPI, formTemplatesAPI } from '../services/api.js';
import { Card, Alert } from '../components/UI.jsx';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import CustomSelect from '../components/CustomSelect.jsx';
import AdminLayout from '../components/AdminLayout.jsx';
import AIBusinessAssistant from '../components/AIBusinessAssistant.jsx';
import { Building2, Plus, Trash2, Upload, FolderPlus, FilePlus, Settings, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { COLORS } from '../hooks/useColors.js';

const CreateBusinessPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  // Form State
  const [businessName, setBusinessName] = useState('');
  const [businessIcon, setBusinessIcon] = useState(null);
  const [businessIconPreview, setBusinessIconPreview] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [customFields, setCustomFields] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [templateFields, setTemplateFields] = useState([]);
  const [excludedFields, setExcludedFields] = useState([]);
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditMode);
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [error, setError] = useState('');

  const fetchTemplates = async () => {
    try {
      const response = await formTemplatesAPI.getAllTemplates();
      if (response.success) {
        setTemplates(response.data || []);
      }
    } catch (err) {
      toast.error('Failed to load templates');
    }
  };

  const fetchTemplateDetails = async (templateId) => {
    if (!templateId) {
      setTemplateFields([]);
      return;
    }
    
    setLoadingTemplate(true);
    try {
      const response = await formTemplatesAPI.getTemplateById(templateId);
      if (response.success && response.data) {
        setTemplateFields(response.data.fields || []);
        console.log('Template fields loaded:', response.data.fields?.length);
      }
    } catch (err) {
      toast.error('Failed to load template details');
      setTemplateFields([]);
    } finally {
      setLoadingTemplate(false);
    }
  };

  const fetchBusinessData = useCallback(async () => {
    setLoadingData(true);
    try {
      const response = await businessAPI.getBusinessTypeById(id);
      if (response.success) {
        const business = response.data;
        setBusinessName(business.businessTypeName);
        setBusinessIconPreview(business.iconImage?.url || '');
        
        // Transform categories to include iconPreview for edit mode
        const transformedCategories = (business.categories || []).map(cat => ({
          categoryName: cat.categoryName,
          iconFile: null,
          iconPreview: cat.categoryIcon?.url || '',
          categoryIconData: cat.categoryIcon, // Store full icon data for preservation
          subcategories: (cat.subcategories || []).map(sub => ({
            subcategoryName: sub.subcategoryName,
            iconFile: null,
            iconPreview: sub.subcategoryIcon?.url || '',
            subcategoryIconData: sub.subcategoryIcon // Store full icon data for preservation
          }))
        }));
        setCategories(transformedCategories);
        
        setSelectedTemplate(business.baseTemplate?._id || '');
        setExcludedFields(business.excludedFields || []);
        
        // Transform custom fields from backend format to frontend format
        const transformedFields = (business.customFields || []).map(field => ({
          label: field.fieldLabel || field.label || '',
          type: field.fieldType || field.type || 'text',
          required: field.validation?.required || field.required || false
        }));
        setCustomFields(transformedFields);
        
        // Fetch template fields if template is selected
        if (business.baseTemplate?._id) {
          await fetchTemplateDetails(business.baseTemplate._id);
        }
      }
    } catch (err) {
      toast.error('Failed to load business data');
      navigate('/admin/businesses');
    } finally {
      setLoadingData(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchTemplates();
    if (isEditMode) {
      fetchBusinessData();
    }
  }, [isEditMode, fetchBusinessData]);

  // Icon Upload Handlers
  const handleBusinessIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBusinessIcon(file);
      setBusinessIconPreview(URL.createObjectURL(file));
    }
  };

  const handleCategoryIconChange = (categoryIndex, file) => {
    if (file) {
      const newCategories = [...categories];
      newCategories[categoryIndex].iconFile = file;
      newCategories[categoryIndex].iconPreview = URL.createObjectURL(file);
      setCategories(newCategories);
    }
  };

  const handleSubcategoryIconChange = (categoryIndex, subcategoryIndex, file) => {
    if (file) {
      const newCategories = [...categories];
      newCategories[categoryIndex].subcategories[subcategoryIndex].iconFile = file;
      newCategories[categoryIndex].subcategories[subcategoryIndex].iconPreview = URL.createObjectURL(file);
      setCategories(newCategories);
    }
  };

  // Category Handlers
  const addCategory = () => {
    if (categories.length >= 5) {
      toast.error('Maximum 5 categories allowed');
      return;
    }
    setCategories([...categories, { categoryName: '', iconFile: null, iconPreview: '', subcategories: [] }]);
  };

  const removeCategory = (index) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const updateCategoryName = (index, name) => {
    const newCategories = [...categories];
    newCategories[index].categoryName = name;
    setCategories(newCategories);
  };

  // Subcategory Handlers
  const addSubcategory = (categoryIndex) => {
    const newCategories = [...categories];
    if (newCategories[categoryIndex].subcategories.length >= 5) {
      toast.error('Maximum 5 subcategories allowed per category');
      return;
    }
    newCategories[categoryIndex].subcategories.push({ subcategoryName: '', iconFile: null, iconPreview: '' });
    setCategories(newCategories);
  };

  const removeSubcategory = (categoryIndex, subcategoryIndex) => {
    const newCategories = [...categories];
    newCategories[categoryIndex].subcategories = newCategories[categoryIndex].subcategories.filter((_, i) => i !== subcategoryIndex);
    setCategories(newCategories);
  };

  const updateSubcategoryName = (categoryIndex, subcategoryIndex, name) => {
    const newCategories = [...categories];
    newCategories[categoryIndex].subcategories[subcategoryIndex].subcategoryName = name;
    setCategories(newCategories);
  };

  // Template Field Handlers
  const handleTemplateChange = async (templateId) => {
    setSelectedTemplate(templateId);
    setExcludedFields([]);
    await fetchTemplateDetails(templateId);
  };

  const toggleFieldExclusion = (fieldId) => {
    if (excludedFields.includes(fieldId)) {
      setExcludedFields(excludedFields.filter(id => id !== fieldId));
    } else {
      setExcludedFields([...excludedFields, fieldId]);
    }
  };

  // Custom Fields Handlers
  const addCustomField = () => {
    setCustomFields([...customFields, { label: '', type: 'text', required: false }]);
  };

  // AI Suggestion Handler
  const handleAISuggestion = (suggestion) => {
    // Apply business type name
    if (suggestion.businessType && !businessName) {
      setBusinessName(suggestion.businessType);
      toast.success(`Applied business type: ${suggestion.businessType}`);
    }

    // Apply categories and subcategories
    if (suggestion.categories && suggestion.categories.length > 0) {
      const newCategories = suggestion.categories.slice(0, 5).map(cat => ({
        categoryName: cat.categoryName,
        iconFile: null,
        iconPreview: '',
        subcategories: (cat.subcategories || []).slice(0, 5).map(subName => ({
          subcategoryName: subName,
          iconFile: null,
          iconPreview: ''
        }))
      }));
      
      setCategories(prev => {
        // If no categories exist, use AI suggestions
        if (prev.length === 0) return newCategories;
        
        // Otherwise, ask user to confirm replacement
        if (window.confirm('Replace existing categories with AI suggestions?')) {
          return newCategories;
        }
        return prev;
      });
    }
  };

  const removeCustomField = (index) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const updateCustomField = (index, field, value) => {
    const newFields = [...customFields];
    newFields[index][field] = value;
    setCustomFields(newFields);
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!businessName.trim()) {
      setError('Business name is required');
      return;
    }

    if (!isEditMode && !businessIcon) {
      setError('Business icon is required');
      return;
    }

    if (!selectedTemplate) {
      setError('Please select a template');
      return;
    }

    // Check categories
    for (let i = 0; i < categories.length; i++) {
      if (!categories[i].categoryName.trim()) {
        setError(`Category ${i + 1} name is required`);
        return;
      }
      for (let j = 0; j < categories[i].subcategories.length; j++) {
        if (!categories[i].subcategories[j].subcategoryName.trim()) {
          setError(`Subcategory ${j + 1} in Category ${i + 1} name is required`);
          return;
        }
      }
    }

    // Build FormData
    const formData = new FormData();
    formData.append('businessTypeName', businessName);
    formData.append('baseTemplate', selectedTemplate);

    // Add business icon
    if (businessIcon) {
      formData.append('iconImage', businessIcon);
    }

    // Add categories (as JSON string)
    const categoriesData = categories.map((cat) => {
      const categoryData = {
        categoryName: cat.categoryName,
        subcategories: cat.subcategories.map((sub) => {
          const subData = {
            subcategoryName: sub.subcategoryName,
          };
          // Preserve existing subcategory icon if exists and no new file
          if (isEditMode && !sub.iconFile && sub.subcategoryIconData) {
            subData.subcategoryIcon = sub.subcategoryIconData;
          }
          return subData;
        }),
      };
      // Preserve existing category icon if exists and no new file
      if (isEditMode && !cat.iconFile && cat.categoryIconData) {
        categoryData.categoryIcon = cat.categoryIconData;
      }
      return categoryData;
    });
    formData.append('categories', JSON.stringify(categoriesData));

    // Add category icons
    categories.forEach((cat, i) => {
      if (cat.iconFile) {
        formData.append(`categoryIcon_${i}`, cat.iconFile);
      }
    });

    // Add subcategory icons
    categories.forEach((cat, i) => {
      cat.subcategories.forEach((sub, j) => {
        if (sub.iconFile) {
          formData.append(`subcategoryIcon_${i}_${j}`, sub.iconFile);
        }
      });
    });

    // Add custom fields
    if (customFields.length > 0) {
      formData.append('customFields', JSON.stringify(customFields));
    }

    // Add excluded fields
    if (excludedFields.length > 0) {
      formData.append('excludedFields', JSON.stringify(excludedFields));
    }

    // Submit
    setLoading(true);
    try {
      const response = isEditMode 
        ? await businessAPI.updateBusinessType(id, formData)
        : await businessAPI.createBusinessType(formData);

      if (response.success) {
        toast.success(isEditMode ? 'Business type updated successfully' : 'Business type created successfully');
        navigate('/admin/businesses');
      } else {
        setError(response.message || 'Failed to save business type');
      }
    } catch (err) {
      setError(err?.message || 'Failed to save business type');
      toast.error(err?.message || 'Failed to save business type');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <AdminLayout>
        <Card className="p-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4" style={{ backgroundColor: COLORS.secondaryMain + '20' }}>
            <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: COLORS.secondaryMain + '40', borderTopColor: COLORS.secondaryMain }}></div>
          </div>
          <p className="font-semibold" style={{ color: COLORS.secondaryMain }}>Loading business data...</p>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-6 mb-2">
            <button
              type="button"
              onClick={() => navigate('/business-list')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-gray-100"
              style={{ color: COLORS.secondaryMain }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            <h1 className="text-3xl font-bold text-neutral-900 flex items-center gap-3">
              <Building2 className="w-8 h-8" style={{ color: COLORS.secondaryMain }} />
              {isEditMode ? 'Edit Business Type' : 'Create Business Type'}
            </h1>
          </div>
          <p className="text-neutral-600 mt-2 ml-28">
            {isEditMode ? 'Update business type details, categories, and templates.' : 'Create a new business type with categories, subcategories, and custom templates.'}
          </p>
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

        <form onSubmit={handleSubmit} className="space-y-6" style={{ position: 'relative', zIndex: 1 }}>
          {/* Basic Information */}
          <Card className="p-6" shadow="md">
            <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5" style={{ color: COLORS.secondaryMain }} />
              Basic Information
            </h2>
            
            <div className="space-y-4">
              <Input
                label="Business Type Name"
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g., Restaurant, Gym, Medical Center"
                required
              />

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Business Icon
                </label>
                <div className="flex items-center gap-4">
                  {businessIconPreview && (
                    <img 
                      src={businessIconPreview} 
                      alt="Business icon preview"
                      className="w-16 h-16 rounded-lg object-cover border-2"
                      style={{ borderColor: COLORS.secondaryMain }}
                    />
                  )}
                  <label className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed cursor-pointer transition-colors hover:border-solid" style={{ borderColor: COLORS.secondaryMain + '60' }}>
                    <Upload className="w-5 h-5" style={{ color: COLORS.secondaryMain }} />
                    <span className="text-sm font-medium" style={{ color: COLORS.secondaryMain }}>
                      {businessIconPreview ? 'Change Icon' : 'Upload Icon'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBusinessIconChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </Card>

          {/* Categories */}
          <Card className="p-6" shadow="md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                <FolderPlus className="w-5 h-5" style={{ color: COLORS.secondaryMain }} />
                Categories ({categories.length}/5)
              </h2>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={addCategory}
                disabled={categories.length >= 5}
                style={{ backgroundColor: COLORS.secondaryMain, color: 'white' }}
              >
                <Plus className="w-4 h-4" />
                Add Category
              </Button>
            </div>

            {categories.length === 0 ? (
              <div className="text-center py-8 text-neutral-500">
                No categories added yet. Click "Add Category" to get started.
              </div>
            ) : (
              <div className="space-y-4">
                {categories.map((category, catIndex) => (
                  <Card key={catIndex} className="p-4 border-l-4" style={{ borderLeftColor: COLORS.secondaryMain }}>
                    <div className="space-y-4">
                      {/* Category Header */}
                      <div className="flex items-start gap-3">
                        {category.iconPreview && (
                          <img 
                            src={category.iconPreview} 
                            alt="Category icon"
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )}
                        <div className="flex-1 space-y-3">
                          <div className="flex gap-2">
                            <Input
                              label={`Category ${catIndex + 1} Name`}
                              type="text"
                              value={category.categoryName}
                              onChange={(e) => updateCategoryName(catIndex, e.target.value)}
                              placeholder="e.g., Food Items, Services, Products"
                              required
                            />
                            <label className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed cursor-pointer transition-colors hover:border-solid self-end" style={{ borderColor: COLORS.secondaryMain + '60', height: '42px' }}>
                              <Upload className="w-4 h-4" style={{ color: COLORS.secondaryMain }} />
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleCategoryIconChange(catIndex, e.target.files[0])}
                                className="hidden"
                              />
                            </label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeCategory(catIndex)}
                              style={{ color: COLORS.error, borderColor: COLORS.error }}
                              className="self-end"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Subcategories */}
                          <div className="ml-6 space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-sm font-medium text-neutral-600">
                                Subcategories ({category.subcategories.length}/5)
                              </label>
                              <Button
                                type="button"
                                variant="outline"
                                size="xs"
                                onClick={() => addSubcategory(catIndex)}
                                disabled={category.subcategories.length >= 5}
                                style={{ color: COLORS.secondaryMain, borderColor: COLORS.secondaryMain }}
                              >
                                <Plus className="w-3 h-3" />
                                Add Subcategory
                              </Button>
                            </div>

                            {category.subcategories.map((subcategory, subIndex) => (
                              <div key={subIndex} className="flex items-end gap-2">
                                {subcategory.iconPreview && (
                                  <img 
                                    src={subcategory.iconPreview} 
                                    alt="Subcategory icon"
                                    className="w-8 h-8 rounded object-cover"
                                  />
                                )}
                                <Input
                                  label={`Subcategory ${subIndex + 1}`}
                                  type="text"
                                  value={subcategory.subcategoryName}
                                  onChange={(e) => updateSubcategoryName(catIndex, subIndex, e.target.value)}
                                  placeholder="e.g., Appetizers, Main Course"
                                  required
                                />
                                <label className="flex items-center gap-1 px-3 py-2 rounded-lg border border-dashed cursor-pointer transition-colors hover:border-solid" style={{ borderColor: COLORS.secondaryMain + '60', height: '42px' }}>
                                  <Upload className="w-3 h-3" style={{ color: COLORS.secondaryMain }} />
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleSubcategoryIconChange(catIndex, subIndex, e.target.files[0])}
                                    className="hidden"
                                  />
                                </label>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="xs"
                                  onClick={() => removeSubcategory(catIndex, subIndex)}
                                  style={{ color: COLORS.error, borderColor: COLORS.error, height: '42px' }}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>

          {/* Template Selection */}
          <Card className="p-6 pb-12" shadow="md" style={{ overflow: 'visible' }}>
            <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <FilePlus className="w-5 h-5" style={{ color: COLORS.secondaryMain }} />
              Form Template
            </h2>
            
            <div className="relative" style={{ zIndex: 10 }}>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Select Base Template <span className="text-red-500">*</span>
              </label>
              <div className="mb-8">
                <CustomSelect
                  value={selectedTemplate}
                  onChange={handleTemplateChange}
                  options={templates.map(template => ({
                    value: template._id,
                    label: template.templateName
                  }))}
                  placeholder="-- Select a template --"
                  required
                />
              </div>
              {selectedTemplate && (
                <p className="text-xs text-neutral-500 -mt-6 mb-2">
                  Selected: {templates.find(t => t._id === selectedTemplate)?.templateName}
                </p>
              )}
            </div>

            {/* Template Field Preview */}
            {loadingTemplate && (
              <div className="mt-4 p-4 rounded-lg bg-neutral-50 border border-neutral-200">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: COLORS.secondaryMain + '40', borderTopColor: COLORS.secondaryMain }}></div>
                  <span className="text-sm text-neutral-600">Loading template fields...</span>
                </div>
              </div>
            )}

            {!loadingTemplate && templateFields.length > 0 && (
              <div className="mt-4 p-4 rounded-lg border-2" style={{ borderColor: COLORS.secondaryMain + '30', backgroundColor: COLORS.secondaryMain + '05' }}>
                <h3 className="text-sm font-bold text-neutral-900 mb-3 flex items-center gap-2">
                  <FilePlus className="w-4 h-4" style={{ color: COLORS.secondaryMain }} />
                  Template Fields ({templateFields.filter(f => !excludedFields.includes(f.fieldId)).length} active, {excludedFields.length} excluded)
                </h3>
                <p className="text-xs text-neutral-600 mb-3">
                  Click on a field to exclude it from this business type. You have full control over which fields to include.
                </p>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {templateFields.map((field) => {
                    const isExcluded = excludedFields.includes(field.fieldId);
                    const hasOptions = field.options && field.options.length > 0;
                    
                    return (
                      <div
                        key={field.fieldId}
                        className={`flex flex-col p-2 rounded border transition-all cursor-pointer ${
                          isExcluded
                            ? 'bg-red-50 border-red-200 hover:bg-red-100'
                            : 'bg-white border-neutral-200 hover:bg-neutral-50'
                        }`}
                        onClick={() => toggleFieldExclusion(field.fieldId)}
                        title={isExcluded ? 'Click to include this field' : 'Click to exclude this field'}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              isExcluded 
                                ? 'border-red-400 bg-red-100'
                                : 'border-green-400 bg-green-50'
                            }`}>
                              {isExcluded ? (
                                <span className="text-red-500 text-xs">✕</span>
                              ) : (
                                <span className="text-green-500 text-xs">✓</span>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-neutral-900">{field.fieldLabel}</span>
                                {field.validation?.required && (
                                  <span className="text-xs text-red-500">*Required</span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-neutral-500">
                                <span className="px-1.5 py-0.5 rounded bg-neutral-200">{field.fieldType}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {hasOptions && (
                          <div className="mt-2 pl-7">
                            <div className="text-xs text-neutral-600 font-medium mb-1">Dropdown Options:</div>
                            <div className="flex flex-wrap gap-1">
                              {field.options.map((option, idx) => (
                                <span key={idx} className="px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-700 border border-blue-200">
                                  {option}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 pt-3 border-t border-neutral-200">
                  <p className="text-xs text-neutral-500">
                    💡 <strong>Tip:</strong> Excluded fields won't appear in vendor forms. You can add custom fields below.
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* Custom Fields */}
          <Card className="p-6" shadow="md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                <Settings className="w-5 h-5" style={{ color: COLORS.secondaryMain }} />
                Custom Fields ({customFields.length})
              </h2>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={addCustomField}
                style={{ backgroundColor: COLORS.secondaryMain, color: 'white' }}
              >
                <Plus className="w-4 h-4" />
                Add Field
              </Button>
            </div>

            {customFields.length === 0 ? (
              <div className="text-center py-8 text-neutral-500">
                No custom fields added. Click "Add Field" to add additional fields to the template.
              </div>
            ) : (
              <div className="space-y-3">
                {customFields.map((field, index) => (
                  <div key={index} className="flex items-end gap-3 p-3 rounded-lg bg-neutral-50">
                    <Input
                      label="Field Label"
                      type="text"
                      value={field.label}
                      onChange={(e) => updateCustomField(index, 'label', e.target.value)}
                      placeholder="e.g., Certification Number"
                      required
                    />
                    <div className="flex-shrink-0">
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">Type</label>
                      <select
                        value={field.type}
                        onChange={(e) => updateCustomField(index, 'type', e.target.value)}
                        className="px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-2"
                        style={{ 
                          borderColor: COLORS.secondaryMain + '40',
                          height: '42px'
                        }}
                      >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="email">Email</option>
                        <option value="tel">Phone</option>
                        <option value="url">URL</option>
                        <option value="date">Date</option>
                      </select>
                    </div>
                    <div className="flex items-center" style={{ height: '42px' }}>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => updateCustomField(index, 'required', e.target.checked)}
                          className="w-4 h-4 rounded"
                          style={{ accentColor: COLORS.secondaryMain }}
                        />
                        <span className="text-sm font-medium text-neutral-700">Required</span>
                      </label>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeCustomField(index)}
                      style={{ color: COLORS.error, borderColor: COLORS.error, height: '42px' }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Submit Buttons */}
          <Card className="p-6" shadow="md">
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                size="lg"
                fullWidth
                onClick={() => navigate('/admin/businesses')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={loading}
                style={{ backgroundColor: COLORS.secondaryMain, color: 'white' }}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    {isEditMode ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>{isEditMode ? 'Update Business Type' : 'Create Business Type'}</>
                )}
              </Button>
            </div>
          </Card>
        </form>
      </div>

      {/* AI Business Assistant - Floating Chat Widget */}
      <AIBusinessAssistant 
        onSuggestionSelect={handleAISuggestion}
        existingBusinessTypes={[]}
      />
    </AdminLayout>
  );
};

export default CreateBusinessPage;
