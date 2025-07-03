import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLeads } from '../context/LeadContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft, FiSave, FiUser, FiMail, FiPhone, FiTag, FiFileText, FiCalendar } = FiIcons;

const AddLeadView = () => {
  const navigate = useNavigate();
  const { addLead } = useLeads();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    source: '',
    status: 'Cold',
    notes: '',
    reminderDate: ''
  });
  const [errors, setErrors] = useState({});

  const sources = [
    'Website',
    'Referral',
    'Social Media',
    'Cold Call',
    'Open House',
    'Networking',
    'Advertisement',
    'Other'
  ];

  const statuses = [
    { value: 'Cold', label: 'Cold', color: 'bg-gray-100 text-gray-600' },
    { value: 'Warm', label: 'Warm', color: 'bg-amber-50 text-amber-700' },
    { value: 'Hot', label: 'Hot', color: 'bg-red-50 text-red-700' }
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.source.trim()) newErrors.source = 'Source is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Set default reminder date if not provided (7 days from now)
    const reminderDate = formData.reminderDate || 
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    addLead({
      ...formData,
      reminderDate
    });
    navigate('/leads');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-screen-sm mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="px-4 pt-4 space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiArrowLeft} className="w-5 h-5 text-gray-500" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-black">Add New Lead</h1>
              <p className="text-sm text-gray-500 mt-1">Capture prospect information</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">
              <SafeIcon icon={FiUser} className="w-4 h-4 inline mr-2" />
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-4 py-3 bg-white rounded-xl border ${
                errors.name ? 'border-red-300' : 'border-gray-200'
              } focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
              placeholder="Enter full name"
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">
              <SafeIcon icon={FiMail} className="w-4 h-4 inline mr-2" />
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-4 py-3 bg-white rounded-xl border ${
                errors.email ? 'border-red-300' : 'border-gray-200'
              } focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
              placeholder="Enter email address"
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">
              <SafeIcon icon={FiPhone} className="w-4 h-4 inline mr-2" />
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`w-full px-4 py-3 bg-white rounded-xl border ${
                errors.phone ? 'border-red-300' : 'border-gray-200'
              } focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
              placeholder="Enter phone number"
            />
            {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
          </div>

          {/* Source */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">
              <SafeIcon icon={FiTag} className="w-4 h-4 inline mr-2" />
              Lead Source *
            </label>
            <select
              value={formData.source}
              onChange={(e) => handleInputChange('source', e.target.value)}
              className={`w-full px-4 py-3 bg-white rounded-xl border ${
                errors.source ? 'border-red-300' : 'border-gray-200'
              } focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
            >
              <option value="">Select source</option>
              {sources.map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
            {errors.source && <p className="text-red-600 text-sm mt-1">{errors.source}</p>}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-3">
              Lead Status
            </label>
            <div className="grid grid-cols-3 gap-3">
              {statuses.map(status => (
                <button
                  key={status.value}
                  type="button"
                  onClick={() => handleInputChange('status', status.value)}
                  className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    formData.status === status.value
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className={`px-2 py-1 rounded-full text-xs ${status.color}`}>
                    {status.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Reminder Date */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">
              <SafeIcon icon={FiCalendar} className="w-4 h-4 inline mr-2" />
              Reminder Date
            </label>
            <input
              type="date"
              value={formData.reminderDate ? formData.reminderDate.split('T')[0] : ''}
              onChange={(e) => handleInputChange('reminderDate', e.target.value ? new Date(e.target.value).toISOString() : '')}
              className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              min={today}
            />
            <p className="text-sm text-gray-400 mt-1">
              Set when you want to be reminded to follow up. Leave empty to set reminder for 7 days from now.
            </p>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">
              <SafeIcon icon={FiFileText} className="w-4 h-4 inline mr-2" />
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Add any notes about this lead..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-4 rounded-xl font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
          >
            <SafeIcon icon={FiSave} className="w-5 h-5" />
            <span>Save Lead</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddLeadView;