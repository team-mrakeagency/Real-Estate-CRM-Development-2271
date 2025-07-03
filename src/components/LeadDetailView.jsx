import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useLeads } from '../context/LeadContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft, FiEdit3, FiPhone, FiMail, FiMessageSquare, FiCalendar, FiCheck, FiTrash2, FiClock, FiTag } = FiIcons;

const LeadDetailView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getLeadById, updateLead, deleteLead, markAsContacted } = useLeads();
  const lead = getLeadById(id);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(lead || {});
  const [newNote, setNewNote] = useState('');

  if (!lead) {
    return (
      <div className="max-w-screen-sm mx-auto px-4 pt-4 text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Lead not found</h2>
        <button
          onClick={() => navigate('/leads')}
          className="text-emerald-600 hover:text-emerald-700"
        >
          Back to Leads
        </button>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Hot': return 'bg-red-50 text-red-700 border-red-200';
      case 'Warm': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Cold': return 'bg-gray-100 text-gray-600 border-gray-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSaveEdit = () => {
    updateLead(id, editData);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      deleteLead(id);
      navigate('/leads');
    }
  };

  const handleMarkContacted = () => {
    markAsContacted(id);
  };

  const handleUpdateNotes = () => {
    if (newNote.trim()) {
      const updatedNotes = lead.notes
        ? `${lead.notes}\n\n${new Date().toLocaleDateString()}: ${newNote}`
        : newNote;
      updateLead(id, { notes: updatedNotes });
      setNewNote('');
    }
  };

  const statuses = ['Cold', 'Warm', 'Hot'];
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
              <h1 className="text-2xl font-bold text-black">{lead.name}</h1>
              <p className="text-sm text-gray-500 mt-1">Lead Details</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiEdit3} className="w-5 h-5 text-gray-500" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 hover:bg-red-100 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiTrash2} className="w-5 h-5 text-red-600" />
            </button>
          </div>
        </div>

        {/* Lead Info Card */}
        <div className="bg-white rounded-xl p-6 shadow-card space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Status</span>
            {isEditing ? (
              <select
                value={editData.status}
                onChange={(e) => setEditData(prev => ({ ...prev, status: e.target.value }))}
                className="px-3 py-1 rounded-lg border border-gray-200 text-sm"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            ) : (
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(lead.status)}`}>
                {lead.status}
              </span>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiMail} className="w-5 h-5 text-gray-400" />
              {isEditing ? (
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              ) : (
                <a href={`mailto:${lead.email}`} className="text-emerald-600 hover:text-emerald-700">
                  {lead.email}
                </a>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiPhone} className="w-5 h-5 text-gray-400" />
              {isEditing ? (
                <input
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              ) : (
                <a href={`tel:${lead.phone}`} className="text-emerald-600 hover:text-emerald-700">
                  {lead.phone}
                </a>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiTag} className="w-5 h-5 text-gray-400" />
              {isEditing ? (
                <input
                  type="text"
                  value={editData.source}
                  onChange={(e) => setEditData(prev => ({ ...prev, source: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              ) : (
                <span className="text-gray-500">{lead.source}</span>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="pt-4 border-t border-gray-100 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Created</span>
              <span className="text-gray-800">{formatDate(lead.createdAt)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Last Contacted</span>
              <span className="text-gray-800">{formatDate(lead.lastContacted)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 flex items-center">
                <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-1" />
                Reminder Date
              </span>
              {isEditing ? (
                <input
                  type="date"
                  value={editData.reminderDate ? editData.reminderDate.split('T')[0] : ''}
                  onChange={(e) => setEditData(prev => ({
                    ...prev,
                    reminderDate: e.target.value ? new Date(e.target.value).toISOString() : ''
                  }))}
                  className="px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  min={today}
                />
              ) : (
                <span className="text-gray-800 font-medium">{formatDate(lead.reminderDate)}</span>
              )}
            </div>
          </div>

          {/* Save/Cancel buttons when editing */}
          {isEditing && (
            <div className="flex space-x-3 pt-4 border-t border-gray-100">
              <button
                onClick={handleSaveEdit}
                className="flex-1 bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-gray-100 text-gray-500 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Notes Section */}
        <div className="bg-white rounded-xl p-6 shadow-card">
          <h3 className="font-semibold text-black mb-4 flex items-center">
            <SafeIcon icon={FiMessageSquare} className="w-5 h-5 mr-2" />
            Notes
          </h3>
          {lead.notes ? (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-gray-700 whitespace-pre-wrap">{lead.notes}</p>
            </div>
          ) : (
            <p className="text-gray-400 italic mb-4">No notes yet</p>
          )}
          {/* Add Note */}
          <div className="space-y-3">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a note..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <button
              onClick={handleUpdateNotes}
              disabled={!newNote.trim()}
              className="w-full bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Add Note
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleMarkContacted}
            className="w-full bg-emerald-600 text-white py-4 rounded-xl font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
          >
            <SafeIcon icon={FiCheck} className="w-5 h-5" />
            <span>Mark as Contacted</span>
          </button>
          <div className="grid grid-cols-2 gap-3">
            <a
              href={`tel:${lead.phone}`}
              className="bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
            >
              <SafeIcon icon={FiPhone} className="w-4 h-4" />
              <span>Call</span>
            </a>
            <a
              href={`mailto:${lead.email}`}
              className="bg-gray-700 text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
            >
              <SafeIcon icon={FiMail} className="w-4 h-4" />
              <span>Email</span>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LeadDetailView;