import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useLeads } from '../context/LeadContext';

const { FiHome, FiUsers, FiClock, FiPlus } = FiIcons;

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getFollowUpLeads } = useLeads();
  const followUpCount = getFollowUpLeads().length;

  const navItems = [
    {
      path: '/',
      icon: FiHome,
      label: 'Home',
      isActive: location.pathname === '/'
    },
    {
      path: '/leads',
      icon: FiUsers,
      label: 'Leads',
      isActive: location.pathname === '/leads' || location.pathname.startsWith('/lead/')
    },
    {
      path: '/follow-up',
      icon: FiClock,
      label: 'Follow-up',
      isActive: location.pathname === '/follow-up',
      badge: followUpCount > 0 ? followUpCount : null
    },
    {
      path: '/add-lead',
      icon: FiPlus,
      label: 'Add Lead',
      isActive: location.pathname === '/add-lead',
      isSpecial: true
    }
  ];

  return (
    <div className="fixed bottom-0 w-full bg-white shadow-inner flex justify-around py-3 text-sm z-50">
      {navItems.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          className={`flex flex-col items-center px-2 py-1 transition-colors duration-200 relative ${
            item.isActive
              ? item.isSpecial
                ? 'bg-emerald-600 text-white rounded-xl px-4 py-2 shadow-lg font-semibold'
                : 'text-emerald-600 font-semibold'
              : 'text-gray-500'
          }`}
        >
          <div className="relative">
            <SafeIcon
              icon={item.icon}
              className="w-6 h-6"
            />
            {item.badge && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg"
              >
                {item.badge > 9 ? '9+' : item.badge}
              </motion.span>
            )}
          </div>
          <span className="mt-1 font-medium">
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default BottomNav;