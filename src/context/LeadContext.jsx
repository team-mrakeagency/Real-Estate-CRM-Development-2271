import React, { createContext, useContext, useState, useEffect } from 'react';

const LeadContext = createContext();

export const useLeads = () => {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error('useLeads must be used within a LeadProvider');
  }
  return context;
};

export const LeadProvider = ({ children }) => {
  const [leads, setLeads] = useState([]);

  // Load leads from localStorage on component mount
  useEffect(() => {
    const savedLeads = localStorage.getItem('crm-leads');
    if (savedLeads) {
      setLeads(JSON.parse(savedLeads));
    } else {
      // Sample data for demo
      const sampleLeads = [
        {
          id: '1',
          name: 'Sarah Johnson',
          email: 'sarah.j@email.com',
          phone: '(555) 123-4567',
          source: 'Referral',
          status: 'Hot',
          notes: 'Looking for 3BR home in downtown area. Budget $500K.',
          createdAt: new Date().toISOString(),
          lastContacted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          reminderDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          name: 'Mike Chen',
          email: 'mike.chen@email.com',
          phone: '(555) 987-6543',
          source: 'Website',
          status: 'Warm',
          notes: 'First-time buyer, needs guidance on mortgage process.',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          lastContacted: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          reminderDate: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Emily Davis',
          email: 'emily.davis@email.com',
          phone: '(555) 456-7890',
          source: 'Social Media',
          status: 'Cold',
          notes: 'Interested in investment properties.',
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          lastContacted: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          reminderDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      setLeads(sampleLeads);
      localStorage.setItem('crm-leads', JSON.stringify(sampleLeads));
    }
  }, []);

  // Save leads to localStorage whenever leads change
  useEffect(() => {
    if (leads.length > 0) {
      localStorage.setItem('crm-leads', JSON.stringify(leads));
    }
  }, [leads]);

  const addLead = (leadData) => {
    const newLead = {
      ...leadData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      lastContacted: null
    };
    setLeads(prev => [newLead, ...prev]);
  };

  const updateLead = (id, updates) => {
    setLeads(prev =>
      prev.map(lead =>
        lead.id === id ? { ...lead, ...updates } : lead
      )
    );
  };

  const deleteLead = (id) => {
    setLeads(prev => prev.filter(lead => lead.id !== id));
  };

  const markAsContacted = (id) => {
    updateLead(id, {
      lastContacted: new Date().toISOString(),
      reminderDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // Next week
    });
  };

  const getLeadById = (id) => {
    return leads.find(lead => lead.id === id);
  };

  const getLeadsByStatus = (status) => {
    return leads.filter(lead => lead.status === status);
  };

  const getFollowUpLeads = () => {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    
    return leads.filter(lead => {
      // Check if reminder date is today or earlier
      if (lead.reminderDate) {
        const reminderDate = new Date(lead.reminderDate);
        if (reminderDate <= today) {
          return true;
        }
      }
      
      // Check if it's been 7+ days since last contacted
      if (lead.lastContacted) {
        const lastContactedDate = new Date(lead.lastContacted);
        const daysSinceContact = Math.floor((today - lastContactedDate) / (1000 * 60 * 60 * 24));
        if (daysSinceContact >= 7) {
          return true;
        }
      } else {
        // If never contacted, check if it's been 7+ days since created
        const createdDate = new Date(lead.createdAt);
        const daysSinceCreated = Math.floor((today - createdDate) / (1000 * 60 * 60 * 24));
        if (daysSinceCreated >= 7) {
          return true;
        }
      }
      
      return false;
    });
  };

  const searchLeads = (query) => {
    if (!query) return leads;
    
    const lowercaseQuery = query.toLowerCase();
    return leads.filter(lead =>
      lead.name.toLowerCase().includes(lowercaseQuery) ||
      lead.email.toLowerCase().includes(lowercaseQuery) ||
      lead.source.toLowerCase().includes(lowercaseQuery) ||
      lead.status.toLowerCase().includes(lowercaseQuery)
    );
  };

  const value = {
    leads,
    addLead,
    updateLead,
    deleteLead,
    markAsContacted,
    getLeadById,
    getLeadsByStatus,
    getFollowUpLeads,
    searchLeads
  };

  return (
    <LeadContext.Provider value={value}>
      {children}
    </LeadContext.Provider>
  );
};