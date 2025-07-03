import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLeads } from '../context/LeadContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUsers, FiClock, FiTrendingUp, FiArrowRight, FiCheck, FiCalendar } = FiIcons;

const Dashboard = () => {
  const navigate = useNavigate();
  const { leads, getLeadsByStatus, getFollowUpLeads, markAsContacted } = useLeads();
  const [updatedLeads, setUpdatedLeads] = useState(new Set());
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const hotLeads = getLeadsByStatus('Hot');
  const warmLeads = getLeadsByStatus('Warm');
  const coldLeads = getLeadsByStatus('Cold');
  const followUpLeads = getFollowUpLeads();

  const stats = [
    { title: 'Total Leads', value: leads.length, icon: FiUsers, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    { title: 'Follow-ups Today', value: followUpLeads.length, icon: FiClock, color: 'text-amber-600', bgColor: 'bg-amber-50' },
    { title: 'Hot Leads', value: hotLeads.length, icon: FiTrendingUp, color: 'text-red-600', bgColor: 'bg-red-50' }
  ];

  const quickActions = [
    { title: 'Add New Lead', description: 'Capture a new prospect', path: '/add-lead', color: 'bg-emerald-600 hover:bg-emerald-700' },
    { title: 'View Follow-ups', description: `${followUpLeads.length} leads need attention`, path: '/follow-up', color: 'bg-amber-600 hover:bg-amber-700' },
    { title: 'Browse All Leads', description: `${leads.length} total contacts`, path: '/leads', color: 'bg-gray-700 hover:bg-gray-800' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Hot': return 'bg-red-50 text-red-700';
      case 'Warm': return 'bg-amber-50 text-amber-700';
      case 'Cold': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
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

  const handleMarkContacted = (e, leadId, leadName) => {
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
          <h1 className="text-2xl font-bold text-black">Good morning! 👋</h1>
          <p className="text-sm text-gray-500 mt-1">Here's your client overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-4 shadow-card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <SafeIcon icon={stat.icon} className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-black">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                onClick={() => navigate(action.path)}
                className="w-full bg-white rounded-xl p-4 shadow-card flex items-center justify-between group hover:shadow-soft transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center transition-colors`}>
                    <SafeIcon icon={FiArrowRight} className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-800">{action.title}</h3>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                </div>
                <SafeIcon icon={FiArrowRight} className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Recent Activity Preview */}
        {leads.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-black">Recent Leads</h2>
              <button
                onClick={() => navigate('/leads')}
                className="text-emerald-600 text-sm font-medium hover:text-emerald-700"
              >
                View All
              </button>
            </div>
            <div className="space-y-4">
              {leads.slice(0, 3).map((lead, index) => (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
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
                    <h4 className="text-lg font-semibold text-gray-800 mb-1">{lead.name}</h4>
                    <p className="text-sm text-gray-500">{lead.source}</p>
                  </div>

                  {/* Reminder Date Display */}
                  {lead.reminderDate && (
                    <div className="mb-3">
                      <div className="flex items-center gap-2">
                        <SafeIcon icon={FiCalendar} className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-600 font-medium">
                          Reminder: {formatDate(lead.reminderDate)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Last Contacted Section */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">
                      Last Contacted: <span className="font-medium">{formatDate(lead.lastContacted)}</span>
                    </p>
                  </div>

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
                          onClick={(e) => handleMarkContacted(e, lead.id, lead.name)}
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
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;