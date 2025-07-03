import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Dashboard from './components/Dashboard';
import LeadsView from './components/LeadsView';
import FollowUpView from './components/FollowUpView';
import AddLeadView from './components/AddLeadView';
import LeadDetailView from './components/LeadDetailView';
import BottomNav from './components/BottomNav';
import { LeadProvider } from './context/LeadContext';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <LeadProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <main className="flex-1 pb-20">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/leads" element={<LeadsView />} />
                <Route path="/follow-up" element={<FollowUpView />} />
                <Route path="/add-lead" element={<AddLeadView />} />
                <Route path="/lead/:id" element={<LeadDetailView />} />
              </Routes>
            </AnimatePresence>
          </main>
          <BottomNav />
        </div>
      </Router>
    </LeadProvider>
  );
}

export default App;