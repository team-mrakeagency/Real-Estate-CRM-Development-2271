import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLeads } from '../context/LeadContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiClock, FiPhone, FiMail, FiCheck, FiAlertCircle, FiCalendar } = FiIcons;

const FollowUpView = () => {
  const navigate = useNavigate();
  const { getFollowUpLeads, markAsContacted } = useLeads();
  const [updatedLeads, setUpdatedLeads] = useState(new Set());
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const followUpLeads = getFollowUpLeads();

  const getUrgency = (lead) => {
    const now = new Date();
    
    // Check reminder date urgency
    if (lead.reminderDate) {
      const reminder = new Date(lead.reminderDate);
      const diffHours = (reminder - now) / (1000 * 60 * 60);
      
      if (diffHours < -24) return { label: 'Overdue', color: 'text-red-600', bgColor: 'bg-red-50', priority: 1 };
      if (diffHours < 0) return { label: 'Due Today', color: 'text-amber-600', bgColor: 'bg-amber-50', priority: 2 };
      if (diffHours < 24) return { label: 'Due Soon', color: 'text-yellow-600', bgColor: 'bg-yellow-50', priority: 3 };
    }
    
    // Check last contacted urgency
    const lastContactedDate = lead.lastContacted ? new Date(lead.lastContacted) : new Date(lead.createdAt);
    const daysSinceContact = Math.floor((now - lastContactedDate) / (1000 * 60 * 60 * 24));
    
    if (daysSinceContact >= 14) return { label: 'Long Overdue', color: 'text-red-700', bgColor: 'bg-red-100', priority: 1 };
    if (daysSinceContact >= 7) return { label: 'Follow-up Needed', color: 'text-amber-700', bgColor: 'bg-amber-100', priority: 2 };
    
    return { label: 'Scheduled', color: 'text-emerald-600', bgColor: 'bg-emerald-50', priority: 4 };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Hot': return 'bg-red-50 text-red-700';
      case 'Warm': return 'bg-amber-50 text-amber-700';
      case 'Cold': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const formatReminderDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((date - now) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < -1) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays > 1) return `In ${diffDays} days`;
    return date.toLocaleDateString();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const showFeedbackToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleMarkAsContacted = (e, leadId, leadName) => {
    e.stopPropagation();
    markAsContacted(leadId);
    setUpdatedLeads(prev => new Set([...prev, leadId]));
    showFeedbackToast(`${leadName} marked as contacted today`);
    
    // Remove the confirmation after 3 seconds
    setTimeout(() => {
      setUpdatedLeads(prev => {
        const newSet = new Set(prev);
        newSet.delete(leadId);
        return newSet;
      });
    }, 3000);
  };

  return (
    <div className="max-w-screen-sm mx-auto">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-screen-sm"
          >
            <div className="bg-emerald-100 border border-emerald-300 text-emerald-700 px-4 py-3 rounded-lg shadow-card flex items-center space-x-2">
              <SafeIcon icon={FiCheck} className="w-5 h-5" />
              <span className="text-sm font-medium">{toastMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="px-4 pt-4 space-y-6 pb-24"
      >
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-black">Follow-ups</h1>
          <p className="text-sm text-gray-500 mt-1">
            {followUpLeads.length === 0 
              ? "You're all caught up! 🎉" 
              : `${followUpLeads.length} leads need your attention`
            }
          </p>
        </div>

        {/* Follow-up List */}
        <div className="space-y-4">
          {followUpLeads.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiCheck} className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">All caught up!</h3>
              <p className="text-sm text-gray-500 mb-6">No follow-ups needed right now.</p>
              <button
                onClick={() => navigate('/leads')}
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                View All Leads
              </button>
            </motion.div>
          ) : (
            followUpLeads
              .map(lead => ({ ...lead, urgency: getUrgency(lead) }))
              .sort((a, b) => a.urgency.priority - b.urgency.priority)
              .map((lead, index) => {
                const reminderText = formatReminderDate(lead.reminderDate);
                
                return (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative bg-white rounded-xl p-5 shadow-card cursor-pointer hover:shadow-lg hover:scale-[1.01] transition-all duration-200 ease-in-out"
                    onClick={() => navigate(`/lead/${lead.id}`)}
                  >
                    {/* Status Badge - Absolute Positioned */}
                    <div className="absolute top-3 right-3 z-10">
                      <span className={`inline-block px-2 py-0.5 text-xs font-semibold uppercase rounded-full ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </div>

                    {/* Header Section */}
                    <div className="pr-16 mb-3">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{lead.name}</h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${lead.urgency.bgColor} ${lead.urgency.color}`}>
                          {lead.urgency.label}
                        </span>
                      </div>
                    </div>

                    {/* Reminder Date Display */}
                    {lead.reminderDate && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2">
                          <SafeIcon icon={FiCalendar} className="w-4 h-4 text-gray-600" />
                          <span className="text-sm text-gray-600 font-medium">
                            Reminder: {formatDate(lead.reminderDate)}
                          </span>
                        </div>
                        {reminderText && (
                          <p className="text-sm text-gray-500 mt-1 ml-6">
                            {reminderText}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Contact Information Section */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <SafeIcon icon={FiMail} className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{lead.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <SafeIcon icon={FiPhone} className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{lead.phone}</span>
                      </div>
                    </div>

                    {/* Last Contacted Section */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-500">
                        Last Contacted: <span className="font-medium">{formatDate(lead.lastContacted)}</span>
                      </p>
                    </div>

                    {/* Notes Section */}
                    {lead.notes && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <p className="text-sm text-gray-600 line-clamp-2">{lead.notes}</p>
                      </div>
                    )}

                    {/* Action Section */}
                    <div className="space-y-3">
                      {/* Mark Contacted Button */}
                      <div>
                        {updatedLeads.has(lead.id) ? (
                          <div className="flex items-center text-sm text-emerald-600">
                            <SafeIcon icon={FiCheck} className="w-4 h-4 mr-2" />
                            <span className="font-medium">Last contacted updated</span>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => handleMarkAsContacted(e, lead.id, lead.name)}
                            className="bg-emerald-500 text-white text-sm px-3 py-1 rounded-md hover:bg-emerald-600 transition-colors font-medium"
                          >
                            Mark Contacted Today
                          </button>
                        )}
                      </div>

                      {/* Tap to view details */}
                      <div className="pt-3 border-t border-gray-100">
                        <div className="text-sm text-gray-400 flex items-center justify-center">
                          <span>Tap to view details</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default FollowUpView;