import React, { useState, useEffect } from 'react';
import { Users, Calendar, DollarSign, MessageSquare, Plus, Search, Edit, Trash2, Mail, Phone, MapPin, Clock, User } from 'lucide-react';

function usePersistentState<T>(key: string, initialValue: T) {
  const [value, setValue] = React.useState<T>(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = window.localStorage.getItem(key);
        if (stored != null) return JSON.parse(stored);
      }
    } catch {}
    return initialValue;
  });

  React.useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch {}
  }, [key, value]);

  return [value, setValue] as const;
}

// Church Logo Component
const ChurchLogo = () => (
  <svg viewBox="0 0 100 100" className="w-14 h-14">
    <defs>
      <linearGradient id="globeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor:"#3B82F6", stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:"#1E40AF", stopOpacity:1}} />
      </linearGradient>
      <linearGradient id="doveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor:"#FFFFFF", stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:"#E5E7EB", stopOpacity:1}} />
      </linearGradient>
    </defs>
    
    {/* Globe */}
    <circle cx="50" cy="55" r="30" fill="url(#globeGradient)" stroke="#1E40AF" strokeWidth="2"/>
    
    {/* Globe lines */}
    <path d="M20 55 Q50 35 80 55" stroke="#FFFFFF" strokeWidth="1.5" fill="none" opacity="0.8"/>
    <path d="M20 55 Q50 75 80 55" stroke="#FFFFFF" strokeWidth="1.5" fill="none" opacity="0.8"/>
    <line x1="50" y1="25" x2="50" y2="85" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8"/>
    <line x1="20" y1="55" x2="80" y2="55" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8"/>
    
    {/* Cross */}
    <rect x="47" y="15" width="6" height="25" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1"/>
    <rect x="40" y="22" width="20" height="6" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1"/>
    
    {/* Dove */}
    <g transform="translate(35,35) scale(0.8)">
      <ellipse cx="15" cy="10" rx="12" ry="6" fill="url(#doveGradient)" stroke="#D1D5DB" strokeWidth="1"/>
      <ellipse cx="20" cy="8" rx="3" ry="2" fill="url(#doveGradient)" stroke="#D1D5DB" strokeWidth="1"/>
      <path d="M8 12 Q2 8 5 15 Q8 18 12 15" fill="url(#doveGradient)" stroke="#D1D5DB" strokeWidth="1"/>
      <path d="M25 10 Q32 6 30 12 Q28 15 25 12" fill="url(#doveGradient)" stroke="#D1D5DB" strokeWidth="1"/>
      <circle cx="20" cy="8" r="1" fill="#374151"/>
      
      {/* Olive branch */}
      <path d="M25 12 Q28 10 30 8" stroke="#10B981" strokeWidth="1.5" fill="none"/>
      <ellipse cx="29" cy="7" rx="1.5" ry="0.8" fill="#10B981"/>
      <ellipse cx="27" cy="9" rx="1" ry="0.6" fill="#10B981"/>
    </g>
  </svg>
);

const ChurchManagementSystem = () => {
  const [activeTab, setActiveTab] = useState('members');
  const [donationSubTab, setDonationSubTab] = useState('tithes');

  // Load data from memory or use defaults
  // Members
const [members, setMembers] = usePersistentState<any[]>('cms_members', [
  {
    id: 1,
    name: 'John Smith',
    phone: '(555) 123-4567',
    address: '123 Main St, City, State',
    residence: 'Accra',
    joinDate: '2023-01-15',
    ministry: 'Worship Team',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    phone: '(555) 987-6543',
    address: '456 Oak Ave, City, State',
    residence: 'Tema',
    joinDate: '2022-06-20',
    ministry: 'Children\'s Ministry',
    status: 'Active'
  }
]);

// Events
const [events, setEvents] = usePersistentState<any[]>('cms_events', [
  {
    id: 1,
    title: 'Sunday Service',
    date: '2025-08-24',
    time: '10:00 AM',
    location: 'Main Sanctuary',
    description: 'Weekly worship service',
    type: 'Service'
  },
  {
    id: 2,
    title: 'Bible Study',
    date: '2025-08-27',
    time: '7:00 PM',
    location: 'Fellowship Hall',
    description: 'Midweek Bible study and prayer',
    type: 'Study'
  }
]);

// Tithes
const [tithes, setTithes] = usePersistentState<any[]>('cms_tithes', [
  {
    id: 1,
    donor: 'John Smith',
    amount: 250,
    date: '2025-08-15',
    method: 'Check'
  },
  {
    id: 2,
    donor: 'Sarah Johnson',
    amount: 100,
    date: '2025-08-15',
    method: 'Cash'
  }
]);

// Dues
const [dues, setDues] = usePersistentState<any[]>('cms_dues', [
  {
    id: 1,
    memberId: 1,
    memberName: 'John Smith',
    year: 2025,
    months: {
      jan: 50, feb: 50, mar: 50, apr: 50, may: 50, jun: 50,
      jul: 50, aug: 50, sep: 0, oct: 0, nov: 0, dec: 0
    }
  },
  {
    id: 2,
    memberId: 2,
    memberName: 'Sarah Johnson',
    year: 2025,
    months: {
      jan: 50, feb: 50, mar: 50, apr: 50, may: 50, jun: 50,
      jul: 50, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0
    }
  }
]);

// Communications
const [communications, setCommunications] = usePersistentState<any[]>('cms_communications', [
  {
    id: 1,
    title: 'Weekly Newsletter',
    content: 'This week\'s updates and announcements...',
    date: '2025-08-19',
    type: 'Newsletter',
    recipients: 'All Members'
  }
]);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDuesYear, setSelectedDuesYear] = useState(new Date().getFullYear());

  // Form states
  const [memberForm, setMemberForm] = useState({
    name: '', phone: '', address: '', residence: '', ministry: '', status: 'Active', joinDate: ''
  });
  const [eventForm, setEventForm] = useState({
    title: '', date: '', time: '', location: '', description: '', type: 'Service'
  });
  const [titheForm, setTitheForm] = useState({
    donor: '', amount: '', date: '', method: 'Cash'
  });
  const [communicationForm, setCommunicationForm] = useState({
    title: '', content: '', type: 'Newsletter', recipients: 'All Members'
  });

  // Save data to window object for persistence during session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).churchData = {
        members,
        events,
        tithes,
        dues,
        communications
      };
    }
  }, [members, events, tithes, dues, communications]);

  const openModal = (type: string, item: any = null) => {
    setModalType(type);
    setEditingItem(item);
    setShowModal(true);
    
    if (item) {
      switch (type) {
        case 'member':
          setMemberForm(item);
          break;
        case 'event':
          setEventForm(item);
          break;
        case 'tithe':
          setTitheForm(item);
          break;
        case 'communication':
          setCommunicationForm(item);
          break;
      }
    } else {
      // Reset forms
      setMemberForm({ name: '', phone: '', address: '', residence: '', ministry: '', status: 'Active', joinDate: '' });
      setEventForm({ title: '', date: '', time: '', location: '', description: '', type: 'Service' });
      setTitheForm({ donor: '', amount: '', date: '', method: 'Cash' });
      setCommunicationForm({ title: '', content: '', type: 'Newsletter', recipients: 'All Members' });
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setEditingItem(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = Date.now();
    
    switch (modalType) {
      case 'member':
        if (editingItem) {
          setMembers(members.map(m => m.id === editingItem.id ? { ...memberForm, id: editingItem.id } : m));
        } else {
          setMembers([...members, { ...memberForm, id: newId, joinDate: memberForm.joinDate || new Date().toISOString().split('T')[0] }]);
        }
        break;
      case 'event':
        if (editingItem) {
          setEvents(events.map(e => e.id === editingItem.id ? { ...eventForm, id: editingItem.id } : e));
        } else {
          setEvents([...events, { ...eventForm, id: newId }]);
        }
        break;
      case 'tithe':
        if (editingItem) {
          setTithes(tithes.map(t => t.id === editingItem.id ? { ...titheForm, id: editingItem.id, amount: parseFloat(titheForm.amount) } : t));
        } else {
          setTithes([...tithes, { ...titheForm, id: newId, amount: parseFloat(titheForm.amount), date: titheForm.date || new Date().toISOString().split('T')[0] }]);
        }
        break;
      case 'communication':
        if (editingItem) {
          setCommunications(communications.map(c => c.id === editingItem.id ? { ...communicationForm, id: editingItem.id } : c));
        } else {
          setCommunications([...communications, { ...communicationForm, id: newId, date: new Date().toISOString().split('T')[0] }]);
        }
        break;
    }
    closeModal();
  };

  const handleDelete = (type: string, id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      switch (type) {
        case 'member':
          setMembers(members.filter(m => m.id !== id));
          break;
        case 'event':
          setEvents(events.filter(e => e.id !== id));
          break;
        case 'tithe':
          setTithes(tithes.filter(t => t.id !== id));
          break;
        case 'communication':
          setCommunications(communications.filter(c => c.id !== id));
          break;
      }
    }
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.residence.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalTithes = tithes.reduce((sum, tithe) => sum + parseFloat(tithe.amount), 0);
  
  // Generate years from 2012 to current year
  const currentYear = new Date().getFullYear();
  const availableYears = [];
  for (let year = 2012; year <= currentYear; year++) {
    availableYears.push(year);
  }

  // Get members who were active in the selected year
  const getMembersForYear = (year: number) => {
    return members.filter(member => {
      const joinYear = new Date(member.joinDate).getFullYear();
      return joinYear <= year;
    });
  };

  // Get or create dues record for a member and year
  const getDuesForMemberYear = (memberId: number, year: number) => {
    return dues.find(d => d.memberId === memberId && d.year === year) || {
      memberId,
      memberName: members.find(m => m.id === memberId)?.name,
      year,
      months: {
        jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0,
        jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0
      }
    };
  };

  // Update dues payment
  const updateDuesPayment = (memberId: number, year: number, month: string, amount: string) => {
    const existingRecord = dues.find(d => d.memberId === memberId && d.year === year);
    const updatedAmount = parseFloat(amount) || 0;
    
    if (existingRecord) {
      setDues(dues.map(d => 
        d.memberId === memberId && d.year === year
          ? { ...d, months: { ...d.months, [month]: updatedAmount } }
          : d
      ));
    } else {
      const newRecord = {
        id: Date.now(),
        memberId,
        memberName: members.find(m => m.id === memberId)?.name,
        year,
        months: {
          jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0,
          jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0,
          [month]: updatedAmount
        }
      };
      setDues([...dues, newRecord]);
    }
  };

  const tabs = [
    { id: 'members', label: 'Members', icon: Users },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'donations', label: 'Donations & Dues', icon: DollarSign },
    { id: 'communications', label: 'Communications', icon: MessageSquare }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white border-opacity-30 shadow-lg p-2">
                <ChurchLogo />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white drop-shadow-sm">Gracious Palace International Ministries</h1>
                <p className="text-blue-100 text-sm font-medium">Ablekuma, Joma - Poultry Farm Junction</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white text-sm font-semibold drop-shadow-sm">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="text-blue-100 text-xs mt-1 italic">
                Deut 4:20 "... to be His people, an inheritance as you are this day."
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-3 py-5 px-4 border-b-3 font-semibold text-sm transition-all duration-300 transform ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50 bg-opacity-50 scale-105 shadow-md'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50 hover:scale-102'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'members' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Member Management</h2>
                <p className="text-gray-600 mt-1">Manage church community</p>
              </div>
              <button
                onClick={() => openModal('member')}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 hover:from-blue-700 hover:to-blue-800 transform transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                <span className="font-semibold">Add Member</span>
              </button>
            </div>

            {/* Member Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Members</p>
                    <p className="text-4xl font-bold mt-2">{members.length}</p>
                  </div>
                  <Users className="w-10 h-10 text-blue-200" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Active Members</p>
                    <p className="text-4xl font-bold mt-2">{members.filter(m => m.status === 'Active').length}</p>
                  </div>
                  <Users className="w-10 h-10 text-green-200" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">New This Month</p>
                    <p className="text-4xl font-bold mt-2">
                      {members.filter(m => {
                        const joinDate = new Date(m.joinDate);
                        const now = new Date();
                        return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear();
                      }).length}
                    </p>
                  </div>
                  <Plus className="w-10 h-10 text-purple-200" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Total Tithes</p>
                    <p className="text-4xl font-bold mt-2">GH₵{totalTithes.toFixed(0)}</p>
                  </div>
                  <DollarSign className="w-10 h-10 text-orange-200" />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-4 top-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search members by name or residence..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Residence</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ministry</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-blue-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">{member.name}</div>
                            <div className="text-sm text-gray-500">Joined: {new Date(member.joinDate).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center mb-1">
                          <Phone className="w-4 h-4 mr-2 text-green-600" />
                          {member.phone}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-red-500" />
                          {member.address}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                          {member.residence}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.ministry}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
                          member.status === 'Active' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => openModal('member', member)}
                            className="text-blue-600 hover:text-blue-900 transform hover:scale-110 transition-all duration-200"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete('member', member.id)}
                            className="text-red-600 hover:text-red-900 transform hover:scale-110 transition-all duration-200"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Event Management</h2>
                <p className="text-gray-600 mt-1">Plan and organize church activities</p>
              </div>
              <button
                onClick={() => openModal('event')}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 hover:from-green-700 hover:to-green-800 transform transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span className="font-semibold">Add Event</span>
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <div key={event.id} className="bg-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all duration-200 border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openModal('event', event)}
                        className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete('event', event.id)}
                        className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm text-gray-600 mb-4">
                    <div className="flex items-center bg-blue-50 p-2 rounded-lg">
                      <Calendar className="w-4 h-4 mr-3 text-blue-600" />
                      <span className="font-medium">{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center bg-green-50 p-2 rounded-lg">
                      <Clock className="w-4 h-4 mr-3 text-green-600" />
                      <span className="font-medium">{event.time}</span>
                    </div>
                    <div className="flex items-center bg-red-50 p-2 rounded-lg">
                      <MapPin className="w-4 h-4 mr-3 text-red-600" />
                      <span className="font-medium">{event.location}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4 text-sm leading-relaxed">{event.description}</p>
                  <span className="inline-block px-3 py-1 text-xs font-bold bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 rounded-full shadow-sm">
                    {event.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'donations' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Donations & Dues Management</h2>
              <p className="text-gray-600 mt-1">Financial contributions and member dues</p>
            </div>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-2">Tithe Records</h3>
                <p className="text-emerald-100 mb-4">Individual tithe contributions</p>
                <div className="text-3xl font-bold">GH₵{totalTithes.toFixed(2)}</div>
              </div>
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-2">Dues Overview</h3>
                <p className="text-indigo-100 mb-4">Member dues and balances</p>
                <div className="text-3xl font-bold">{members.length} Members</div>
              </div>
            </div>

            {/* Tabs for Tithes and Dues */}
            <div className="bg-white rounded-2xl shadow-xl">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex">
                  <button
                    onClick={() => setDonationSubTab('tithes')}
                    className={`w-1/2 py-6 px-6 text-center border-b-3 font-semibold transition-all duration-200 ${
                      donationSubTab === 'tithes' 
                        ? 'border-blue-500 text-blue-600 bg-blue-50' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    💰 Tithes & Offerings
                  </button>
                  <button
                    onClick={() => setDonationSubTab('dues')}
                    className={`w-1/2 py-6 px-6 text-center border-b-3 font-semibold transition-all duration-200 ${
                      donationSubTab === 'dues' 
                        ? 'border-blue-500 text-blue-600 bg-blue-50' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    📊 Member Dues
                  </button>
                </nav>
              </div>

              {/* Tithes Section */}
              {donationSubTab === 'tithes' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Tithe Records</h3>
                    <button
                      onClick={() => openModal('tithe')}
                      className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:from-emerald-700 hover:to-emerald-800 transform transition-all duration-200 hover:scale-105 shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Record Tithe</span>
                    </button>
                  </div>

                  <div className="overflow-hidden rounded-xl shadow-sm border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Donor</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Method</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {tithes.map((tithe) => (
                          <tr key={tithe.id} className="hover:bg-blue-50 transition-colors duration-200">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{tithe.donor}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <span className="inline-flex px-3 py-1 text-sm font-bold bg-green-100 text-green-800 rounded-full">
                                GH₵{tithe.amount}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(tithe.date).toLocaleDateString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-md">
                                {tithe.method}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-3">
                                <button
                                  onClick={() => openModal('tithe', tithe)}
                                  className="text-blue-600 hover:text-blue-900 transform hover:scale-110 transition-all duration-200"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete('tithe', tithe.id)}
                                  className="text-red-600 hover:text-red-900 transform hover:scale-110 transition-all duration-200"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Dues Section */}
              {donationSubTab === 'dues' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Member Dues Management</h3>
                    <div className="flex items-center space-x-4">
                      <label className="text-sm font-semibold text-gray-700">Select Year:</label>
                      <select
                        value={selectedDuesYear}
                        onChange={(e) => setSelectedDuesYear(parseInt(e.target.value))}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
                      >
                        {availableYears.reverse().map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50">
                              Member Name
                            </th>
                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => (
                              <th key={month} className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider min-w-20">
                                {month}
                              </th>
                            ))}
                            <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                              Total Paid
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                              Overall Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {getMembersForYear(selectedDuesYear).map((member) => {
                            const memberDues = getDuesForMemberYear(member.id, selectedDuesYear);
                            const joinDate = new Date(member.joinDate);
                            const joinYear = joinDate.getFullYear();
                            const joinMonth = joinDate.getMonth(); // 0-based
                            
                            const yearTotal = Object.values(memberDues.months).reduce((sum: number, amount: any) => sum + (parseFloat(amount) || 0), 0);
                            
                            // Calculate expected amount (assuming GH₵50 per month from join date)
                            let expectedMonths = 12;
                            if (selectedDuesYear === joinYear) {
                              expectedMonths = 12 - joinMonth;
                            }
                            const expectedAmount = expectedMonths * 50; // Assuming GH₵50 per month
                            const owedAmount = Math.max(0, expectedAmount - yearTotal);
                            const status = owedAmount === 0 ? 'Fully Paid' : `Owes GH₵${owedAmount.toFixed(2)}`;
                            
                            return (
                              <tr key={member.id} className="hover:bg-blue-50 transition-colors duration-200">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 sticky left-0 bg-white">
                                  {member.name}
                                </td>
                                {['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].map((month, index) => {
                                  const isBeforeJoin = selectedDuesYear === joinYear && index < joinMonth;
                                  
                                  return (
                                    <td key={month} className="px-2 py-4 text-center">
                                      {isBeforeJoin ? (
                                        <span className="text-gray-400 text-xs italic">N/A</span>
                                      ) : (
                                        <input
                                          type="number"
                                          step="0.01"
                                          min="0"
                                          value={memberDues.months[month] || ''}
                                          onChange={(e) => updateDuesPayment(member.id, selectedDuesYear, month, e.target.value)}
                                          className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 text-center hover:bg-blue-50 transition-colors duration-200"
                                          placeholder="0"
                                        />
                                      )}
                                    </td>
                                  );
                                })}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 text-center">
                                  <span className="inline-flex px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                                    GH₵{yearTotal.toFixed(2)}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                  <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
                                    owedAmount === 0 
                                      ? 'bg-green-100 text-green-800 border border-green-200' 
                                      : 'bg-red-100 text-red-800 border border-red-200'
                                  }`}>
                                    {status}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'communications' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Communications</h2>
                <p className="text-gray-600 mt-1">Send messages and announcements to your congregation</p>
              </div>
              <button
                onClick={() => openModal('communication')}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 hover:from-purple-700 hover:to-purple-800 transform transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span className="font-semibold">New Communication</span>
              </button>
            </div>

            <div className="space-y-6">
              {communications.map((comm) => (
                <div key={comm.id} className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{comm.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                        <span className="inline-flex px-2 py-1 bg-purple-100 text-purple-800 rounded-md font-medium">
                          {comm.type}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(comm.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {comm.recipients}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openModal('communication', comm)}
                        className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete('communication', comm.id)}
                        className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed">{comm.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl transform transition-all duration-300 scale-100">
            <h3 className="text-xl font-bold mb-6 text-gray-900">
              {editingItem ? 'Edit' : 'Add'} {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {modalType === 'member' && (
                <>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={memberForm.name}
                    onChange={(e) => setMemberForm({...memberForm, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={memberForm.phone}
                    onChange={(e) => setMemberForm({...memberForm, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Full Address"
                    value={memberForm.address}
                    onChange={(e) => setMemberForm({...memberForm, address: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Residence (City/Town)"
                    value={memberForm.residence}
                    onChange={(e) => setMemberForm({...memberForm, residence: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Ministry/Department"
                    value={memberForm.ministry}
                    onChange={(e) => setMemberForm({...memberForm, ministry: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Join Date</label>
                    <input
                      type="date"
                      value={memberForm.joinDate || ''}
                      onChange={(e) => setMemberForm({...memberForm, joinDate: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <select
                    value={memberForm.status}
                    onChange={(e) => setMemberForm({...memberForm, status: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </>
              )}

              {modalType === 'event' && (
                <>
                  <input
                    type="text"
                    placeholder="Event Title"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="date"
                    value={eventForm.date}
                    onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="time"
                    value={eventForm.time}
                    onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={eventForm.location}
                    onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <textarea
                    placeholder="Event Description"
                    value={eventForm.description}
                    onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                  <select
                    value={eventForm.type}
                    onChange={(e) => setEventForm({...eventForm, type: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Service">Service</option>
                    <option value="Study">Bible Study</option>
                    <option value="Fellowship">Fellowship</option>
                    <option value="Outreach">Outreach</option>
                    <option value="Meeting">Meeting</option>
                  </select>
                </>
              )}

              {modalType === 'tithe' && (
                <>
                  <select
                    value={titheForm.donor}
                    onChange={(e) => setTitheForm({...titheForm, donor: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Member</option>
                    {members.map(member => (
                      <option key={member.id} value={member.name}>{member.name}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Amount (GH₵)"
                    step="0.01"
                    value={titheForm.amount}
                    onChange={(e) => setTitheForm({...titheForm, amount: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="date"
                    value={titheForm.date}
                    onChange={(e) => setTitheForm({...titheForm, date: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <select
                    value={titheForm.method}
                    onChange={(e) => setTitheForm({...titheForm, method: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Check">Check</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Online">Online</option>
                    <option value="Mobile Money">Mobile Money</option>
                  </select>
                </>
              )}

              {modalType === 'communication' && (
                <>
                  <input
                    type="text"
                    placeholder="Communication Title"
                    value={communicationForm.title}
                    onChange={(e) => setCommunicationForm({...communicationForm, title: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <textarea
                    placeholder="Message Content"
                    value={communicationForm.content}
                    onChange={(e) => setCommunicationForm({...communicationForm, content: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    required
                  />
                  <select
                    value={communicationForm.type}
                    onChange={(e) => setCommunicationForm({...communicationForm, type: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Newsletter">Newsletter</option>
                    <option value="Announcement">Announcement</option>
                    <option value="Prayer Request">Prayer Request</option>
                    <option value="Event Invite">Event Invite</option>
                  </select>
                  <select
                    value={communicationForm.recipients}
                    onChange={(e) => setCommunicationForm({...communicationForm, recipients: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="All Members">All Members</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Youth Group">Youth Group</option>
                    <option value="Ministry Teams">Ministry Teams</option>
                  </select>
                </>
              )}

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-semibold transform transition-all duration-200 hover:scale-105 shadow-md"
                >
                  {editingItem ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChurchManagementSystem;