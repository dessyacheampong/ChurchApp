import React, { useState, useEffect } from 'react';
import { Users, Calendar, DollarSign, MessageSquare, Plus, Search, Edit, Trash2, Phone, MapPin, Clock, User } from 'lucide-react';

// ── JSONBIN CONFIG ──
const JSONBIN_BASE = 'https://api.jsonbin.io/v3';

async function jsonbinLoad(apiKey: string, binId: string) {
  const res = await fetch(`${JSONBIN_BASE}/b/${binId}/latest`, {
    headers: { 'X-Master-Key': apiKey }
  });
  if (!res.ok) throw new Error('Failed to load data from JSONBin');
  const data = await res.json();
  return data.record;
}

async function jsonbinSave(apiKey: string, binId: string, data: any) {
  const res = await fetch(`${JSONBIN_BASE}/b/${binId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Master-Key': apiKey },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to save data');
}

async function jsonbinCreate(apiKey: string) {
  const res = await fetch(`${JSONBIN_BASE}/b`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': apiKey,
      'X-Bin-Name': 'ChurchRecords',
      'X-Bin-Private': 'true'
    },
    body: JSON.stringify({ members: [], events: [], tithes: [], dues: [], communications: [] })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to create bin');
  }
  const data = await res.json();
  return data.metadata.id;
}

// ── SETUP SCREEN ──
const SetupScreen = ({ onConnect }: { onConnect: (key: string, binId: string) => void }) => {
  const [apiKey, setApiKey] = useState('');
  const [binId, setBinId] = useState('');
  const [mode, setMode] = useState<'new' | 'existing'>('new');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = async () => {
    if (!apiKey.trim()) { setError('Please enter your API key.'); return; }
    if (mode === 'existing' && !binId.trim()) { setError('Please enter your Bin ID.'); return; }
    setLoading(true);
    setError('');
    try {
      let resolvedBinId = binId.trim();
      if (mode === 'new') {
        resolvedBinId = await jsonbinCreate(apiKey.trim());
      } else {
        // Verify the bin is accessible
        await jsonbinLoad(apiKey.trim(), resolvedBinId);
      }
      localStorage.setItem('cms_api_key', apiKey.trim());
      localStorage.setItem('cms_bin_id', resolvedBinId);
      onConnect(apiKey.trim(), resolvedBinId);
    } catch (e: any) {
      setError(e.message || 'Connection failed. Check your API key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white text-2xl">✦</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Connect Your Data Storage</h1>
          <p className="text-gray-500 mt-2 text-sm">Your church data is stored in JSONBin.io — free, secure, and accessible from any device.</p>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800 space-y-2">
            <p className="font-semibold">First time? Here's how:</p>
            <ol className="list-decimal list-inside space-y-1 text-blue-700">
              <li>Go to <a href="https://jsonbin.io" target="_blank" rel="noreferrer" className="underline font-medium">jsonbin.io</a> and sign up free</li>
              <li>Copy your <strong>Master API Key</strong> from the dashboard</li>
              <li>Paste it below and click Connect</li>
            </ol>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">JSONBin Master API Key</label>
            <input
              type="text"
              placeholder="$2a$10$..."
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setMode('new')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'new' ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              New database
            </button>
            <button
              onClick={() => setMode('existing')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'existing' ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Use existing bin
            </button>
          </div>

          {mode === 'existing' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Bin ID</label>
              <input
                type="text"
                placeholder="e.g. 6849abc123def..."
                value={binId}
                onChange={e => setBinId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              />
            </div>
          )}

          {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}

          <button
            onClick={handleConnect}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold text-base hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 shadow-lg"
          >
            {loading ? 'Connecting...' : mode === 'new' ? 'Create & Connect' : 'Connect'}
          </button>
        </div>
      </div>
    </div>
  );
};

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
    <circle cx="50" cy="55" r="30" fill="url(#globeGradient)" stroke="#1E40AF" strokeWidth="2"/>
    <path d="M20 55 Q50 35 80 55" stroke="#FFFFFF" strokeWidth="1.5" fill="none" opacity="0.8"/>
    <path d="M20 55 Q50 75 80 55" stroke="#FFFFFF" strokeWidth="1.5" fill="none" opacity="0.8"/>
    <line x1="50" y1="25" x2="50" y2="85" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8"/>
    <line x1="20" y1="55" x2="80" y2="55" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8"/>
    <rect x="47" y="15" width="6" height="25" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1"/>
    <rect x="40" y="22" width="20" height="6" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1"/>
    <g transform="translate(35,35) scale(0.8)">
      <ellipse cx="15" cy="10" rx="12" ry="6" fill="url(#doveGradient)" stroke="#D1D5DB" strokeWidth="1"/>
      <ellipse cx="20" cy="8" rx="3" ry="2" fill="url(#doveGradient)" stroke="#D1D5DB" strokeWidth="1"/>
      <path d="M8 12 Q2 8 5 15 Q8 18 12 15" fill="url(#doveGradient)" stroke="#D1D5DB" strokeWidth="1"/>
      <path d="M25 10 Q32 6 30 12 Q28 15 25 12" fill="url(#doveGradient)" stroke="#D1D5DB" strokeWidth="1"/>
      <circle cx="20" cy="8" r="1" fill="#374151"/>
      <path d="M25 12 Q28 10 30 8" stroke="#10B981" strokeWidth="1.5" fill="none"/>
      <ellipse cx="29" cy="7" rx="1.5" ry="0.8" fill="#10B981"/>
      <ellipse cx="27" cy="9" rx="1" ry="0.6" fill="#10B981"/>
    </g>
  </svg>
);

// ── TOAST ──
const Toast = ({ message, type }: { message: string; type: 'success' | 'error' | '' }) => {
  if (!message) return null;
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl text-white text-sm font-medium transition-all ${type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>
      {message}
    </div>
  );
};

// ── MAIN APP ──
const ChurchManagementSystem = () => {
  // ── JSONBIN STATE ──
  const [apiKey, setApiKey] = useState('');
  const [binId, setBinId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' as 'success' | 'error' | '' });

  // ── DATA STATE ──
  const [members, setMembers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [tithes, setTithes] = useState<any[]>([]);
  const [dues, setDues] = useState<any[]>([]);
  const [communications, setCommunications] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState('members');
  const [donationSubTab, setDonationSubTab] = useState('tithes');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDuesYear, setSelectedDuesYear] = useState(new Date().getFullYear());

  const [memberForm, setMemberForm] = useState({ name: '', phone: '', address: '', residence: '', ministry: '', status: 'Active', joinDate: '' });
  const [eventForm, setEventForm] = useState({ title: '', date: '', time: '', location: '', description: '', type: 'Service' });
  const [titheForm, setTitheForm] = useState({ donor: '', amount: '', date: '', method: 'Cash' });
  const [communicationForm, setCommunicationForm] = useState({ title: '', content: '', type: 'Newsletter', recipients: 'All Members' });

  // ── INIT: check for saved credentials ──
  useEffect(() => {
    const savedKey = localStorage.getItem('cms_api_key');
    const savedBin = localStorage.getItem('cms_bin_id');
    if (savedKey && savedBin) {
      setApiKey(savedKey);
      setBinId(savedBin);
      loadData(savedKey, savedBin);
    }
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 3000);
  };

  const loadData = async (key: string, bin: string) => {
    try {
      const record = await jsonbinLoad(key, bin);
      setMembers(record.members || []);
      setEvents(record.events || []);
      setTithes(record.tithes || []);
      setDues(record.dues || []);
      setCommunications(record.communications || []);
      setIsConnected(true);
      showToast('Data loaded ✓');
    } catch (e: any) {
      showToast(e.message, 'error');
    }
  };

  const saveData = async (updated: { members?: any[]; events?: any[]; tithes?: any[]; dues?: any[]; communications?: any[] }) => {
    const payload = {
      members: updated.members ?? members,
      events: updated.events ?? events,
      tithes: updated.tithes ?? tithes,
      dues: updated.dues ?? dues,
      communications: updated.communications ?? communications,
    };
    setIsSaving(true);
    try {
      await jsonbinSave(apiKey, binId, payload);
      showToast('Saved ✓');
    } catch (e: any) {
      showToast('Save failed: ' + e.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConnect = (key: string, bin: string) => {
    setApiKey(key);
    setBinId(bin);
    loadData(key, bin);
  };

  const handleDisconnect = () => {
    if (!window.confirm('Disconnect from JSONBin? You can reconnect any time with the same API key.')) return;
    localStorage.removeItem('cms_api_key');
    localStorage.removeItem('cms_bin_id');
    setIsConnected(false);
    setApiKey('');
    setBinId('');
  };

  // ── MODALS ──
  const openModal = (type: string, item: any = null) => {
    setModalType(type);
    setEditingItem(item);
    setShowModal(true);
    if (item) {
      switch (type) {
        case 'member': setMemberForm(item); break;
        case 'event': setEventForm(item); break;
        case 'tithe': setTitheForm(item); break;
        case 'communication': setCommunicationForm(item); break;
      }
    } else {
      setMemberForm({ name: '', phone: '', address: '', residence: '', ministry: '', status: 'Active', joinDate: '' });
      setEventForm({ title: '', date: '', time: '', location: '', description: '', type: 'Service' });
      setTitheForm({ donor: '', amount: '', date: '', method: 'Cash' });
      setCommunicationForm({ title: '', content: '', type: 'Newsletter', recipients: 'All Members' });
    }
  };

  const closeModal = () => { setShowModal(false); setModalType(''); setEditingItem(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newId = Date.now();
    let updated: any = {};

    switch (modalType) {
      case 'member': {
        const next = editingItem
          ? members.map(m => m.id === editingItem.id ? { ...memberForm, id: editingItem.id } : m)
          : [...members, { ...memberForm, id: newId, joinDate: memberForm.joinDate || new Date().toISOString().split('T')[0] }];
        setMembers(next);
        updated = { members: next };
        break;
      }
      case 'event': {
        const next = editingItem
          ? events.map(e => e.id === editingItem.id ? { ...eventForm, id: editingItem.id } : e)
          : [...events, { ...eventForm, id: newId }];
        setEvents(next);
        updated = { events: next };
        break;
      }
      case 'tithe': {
        const next = editingItem
          ? tithes.map(t => t.id === editingItem.id ? { ...titheForm, id: editingItem.id, amount: parseFloat(titheForm.amount) } : t)
          : [...tithes, { ...titheForm, id: newId, amount: parseFloat(titheForm.amount), date: titheForm.date || new Date().toISOString().split('T')[0] }];
        setTithes(next);
        updated = { tithes: next };
        break;
      }
      case 'communication': {
        const next = editingItem
          ? communications.map(c => c.id === editingItem.id ? { ...communicationForm, id: editingItem.id } : c)
          : [...communications, { ...communicationForm, id: newId, date: new Date().toISOString().split('T')[0] }];
        setCommunications(next);
        updated = { communications: next };
        break;
      }
    }
    closeModal();
    await saveData(updated);
  };

  const handleDelete = async (type: string, id: number) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    let updated: any = {};
    switch (type) {
      case 'member': { const next = members.filter(m => m.id !== id); setMembers(next); updated = { members: next }; break; }
      case 'event': { const next = events.filter(e => e.id !== id); setEvents(next); updated = { events: next }; break; }
      case 'tithe': { const next = tithes.filter(t => t.id !== id); setTithes(next); updated = { tithes: next }; break; }
      case 'communication': { const next = communications.filter(c => c.id !== id); setCommunications(next); updated = { communications: next }; break; }
    }
    await saveData(updated);
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.residence.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalTithes = tithes.reduce((sum, tithe) => sum + parseFloat(tithe.amount), 0);

  const currentYear = new Date().getFullYear();
  const availableYears: number[] = [];
  for (let year = 2012; year <= currentYear; year++) availableYears.push(year);

  const getMembersForYear = (year: number) =>
    members.filter(member => new Date(member.joinDate).getFullYear() <= year);

  const getDuesForMemberYear = (memberId: number, year: number) =>
    dues.find(d => d.memberId === memberId && d.year === year) || {
      memberId, memberName: members.find(m => m.id === memberId)?.name, year,
      months: { jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 }
    };

  const updateDuesPayment = async (memberId: number, year: number, month: string, amount: string) => {
    const updatedAmount = parseFloat(amount) || 0;
    const existingRecord = dues.find(d => d.memberId === memberId && d.year === year);
    let nextDues: any[];
    if (existingRecord) {
      nextDues = dues.map(d =>
        d.memberId === memberId && d.year === year
          ? { ...d, months: { ...d.months, [month]: updatedAmount } }
          : d
      );
    } else {
      nextDues = [...dues, {
        id: Date.now(), memberId,
        memberName: members.find(m => m.id === memberId)?.name,
        year,
        months: { jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0, [month]: updatedAmount }
      }];
    }
    setDues(nextDues);
    await saveData({ dues: nextDues });
  };

  const tabs = [
    { id: 'members', label: 'Members', icon: Users },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'donations', label: 'Donations & Dues', icon: DollarSign },
    { id: 'communications', label: 'Communications', icon: MessageSquare }
  ];

  // ── SHOW SETUP SCREEN IF NOT CONNECTED ──
  if (!isConnected) {
    return <SetupScreen onConnect={handleConnect} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Toast message={toast.message} type={toast.type} />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 shadow-2xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-6">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white border-opacity-30 shadow-lg p-1 sm:p-2 flex-shrink-0">
                <div className="w-9 h-9 sm:w-14 sm:h-14"><ChurchLogo /></div>
              </div>
              <div>
                <h1 className="text-sm sm:text-3xl font-bold text-white drop-shadow-sm leading-tight">Gracious Palace Int'l Ministries</h1>
                <p className="text-blue-100 text-xs sm:text-sm font-medium hidden sm:block">Ablekuma, Joma - Poultry Farm Junction</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="text-white text-xs sm:text-sm font-semibold drop-shadow-sm">
                <span className="hidden sm:inline">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span className="sm:hidden">{new Date().toLocaleDateString('en-GH')}</span>
              </div>
              <div className="text-blue-100 text-xs italic hidden sm:block">Deut 4:20 "... to be His people, an inheritance as you are this day."</div>
              <div className="flex items-center gap-1 sm:gap-3">
                {isSaving && <span className="text-blue-200 text-xs animate-pulse">Saving…</span>}
                <span className="text-xs text-green-200 bg-green-700 bg-opacity-40 px-2 py-0.5 rounded-full">● Live</span>
                <button onClick={handleDisconnect} className="text-xs text-blue-200 hover:text-white underline">⚙</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow-xl border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <nav className="flex overflow-x-auto scrollbar-hide -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1.5 sm:space-x-3 py-3 sm:py-5 px-3 sm:px-4 border-b-2 font-semibold text-xs sm:text-sm whitespace-nowrap flex-shrink-0 transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">

        {/* MEMBERS TAB */}
        {activeTab === 'members' && (
          <div>
            <div className="flex justify-between items-center mb-4 sm:mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Member Management</h2>
                <p className="text-gray-600 mt-0.5 text-sm hidden sm:block">Manage church community</p>
              </div>
              <button
                onClick={() => openModal('member')}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl flex items-center space-x-2 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-semibold">Add Member</span>
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 text-white">
                <div className="flex items-center justify-between">
                  <div><p className="text-blue-100 text-xs sm:text-sm font-medium">Total Members</p><p className="text-3xl sm:text-4xl font-bold mt-1">{members.length}</p></div>
                  <Users className="w-7 h-7 sm:w-10 sm:h-10 text-blue-200" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 text-white">
                <div className="flex items-center justify-between">
                  <div><p className="text-green-100 text-xs sm:text-sm font-medium">Active</p><p className="text-3xl sm:text-4xl font-bold mt-1">{members.filter(m => m.status === 'Active').length}</p></div>
                  <Users className="w-7 h-7 sm:w-10 sm:h-10 text-green-200" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-xs sm:text-sm font-medium">New Month</p>
                    <p className="text-3xl sm:text-4xl font-bold mt-1">
                      {members.filter(m => {
                        const joinDate = new Date(m.joinDate);
                        const now = new Date();
                        return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear();
                      }).length}
                    </p>
                  </div>
                  <Plus className="w-7 h-7 sm:w-10 sm:h-10 text-purple-200" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 text-white">
                <div className="flex items-center justify-between">
                  <div><p className="text-orange-100 text-xs sm:text-sm font-medium">Total Tithes</p><p className="text-2xl sm:text-4xl font-bold mt-1">GH₵{totalTithes.toFixed(0)}</p></div>
                  <DollarSign className="w-7 h-7 sm:w-10 sm:h-10 text-orange-200" />
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

            {/* Mobile cards */}
            <div className="sm:hidden space-y-3">
              {filteredMembers.map((member) => (
                <div key={member.id} className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow flex-shrink-0">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{member.name}</div>
                        <div className="text-xs text-gray-500">Joined: {new Date(member.joinDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-bold rounded-full ${member.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{member.status}</span>
                      <button onClick={() => openModal('member', member)} className="text-blue-600 p-1"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete('member', member.id)} className="text-red-500 p-1"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div className="flex items-center gap-1"><Phone className="w-3 h-3 text-green-600" /><span>{member.phone}</span></div>
                    <div className="flex items-center gap-1"><MapPin className="w-3 h-3 text-blue-500" /><span>{member.residence}</span></div>
                    {member.ministry && <div className="col-span-2 text-gray-500">{member.ministry}</div>}
                  </div>
                </div>
              ))}
            </div>
            {/* Desktop table */}
            <div className="hidden sm:block bg-white rounded-2xl shadow-xl overflow-hidden">
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
                        <div className="text-sm text-gray-900 flex items-center mb-1"><Phone className="w-4 h-4 mr-2 text-green-600" />{member.phone}</div>
                        <div className="text-sm text-gray-500 flex items-center"><MapPin className="w-4 h-4 mr-2 text-red-500" />{member.address}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">{member.residence}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.ministry}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full shadow-sm ${member.status === 'Active' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button onClick={() => openModal('member', member)} className="text-blue-600 hover:text-blue-900 transform hover:scale-110 transition-all duration-200"><Edit className="w-5 h-5" /></button>
                          <button onClick={() => handleDelete('member', member.id)} className="text-red-600 hover:text-red-900 transform hover:scale-110 transition-all duration-200"><Trash2 className="w-5 h-5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* EVENTS TAB */}
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
                      <button onClick={() => openModal('event', event)} className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete('event', event.id)} className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm text-gray-600 mb-4">
                    <div className="flex items-center bg-blue-50 p-2 rounded-lg"><Calendar className="w-4 h-4 mr-3 text-blue-600" /><span className="font-medium">{new Date(event.date).toLocaleDateString()}</span></div>
                    <div className="flex items-center bg-green-50 p-2 rounded-lg"><Clock className="w-4 h-4 mr-3 text-green-600" /><span className="font-medium">{event.time}</span></div>
                    <div className="flex items-center bg-red-50 p-2 rounded-lg"><MapPin className="w-4 h-4 mr-3 text-red-600" /><span className="font-medium">{event.location}</span></div>
                  </div>
                  <p className="text-gray-700 mb-4 text-sm leading-relaxed">{event.description}</p>
                  <span className="inline-block px-3 py-1 text-xs font-bold bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 rounded-full shadow-sm">{event.type}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DONATIONS TAB */}
        {activeTab === 'donations' && (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Donations & Dues Management</h2>
              <p className="text-gray-600 mt-1">Financial contributions and member dues</p>
            </div>
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

            <div className="bg-white rounded-2xl shadow-xl">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex">
                  <button onClick={() => setDonationSubTab('tithes')} className={`w-1/2 py-6 px-6 text-center border-b-3 font-semibold transition-all duration-200 ${donationSubTab === 'tithes' ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>💰 Tithes & Offerings</button>
                  <button onClick={() => setDonationSubTab('dues')} className={`w-1/2 py-6 px-6 text-center border-b-3 font-semibold transition-all duration-200 ${donationSubTab === 'dues' ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>📊 Member Dues</button>
                </nav>
              </div>

              {donationSubTab === 'tithes' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Tithe Records</h3>
                    <button onClick={() => openModal('tithe')} className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:from-emerald-700 hover:to-emerald-800 transform transition-all duration-200 hover:scale-105 shadow-md">
                      <Plus className="w-4 h-4" /><span>Record Tithe</span>
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
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"><span className="inline-flex px-3 py-1 text-sm font-bold bg-green-100 text-green-800 rounded-full">GH₵{tithe.amount}</span></td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(tithe.date).toLocaleDateString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"><span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-md">{tithe.method}</span></td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-3">
                                <button onClick={() => openModal('tithe', tithe)} className="text-blue-600 hover:text-blue-900 transform hover:scale-110 transition-all duration-200"><Edit className="w-4 h-4" /></button>
                                <button onClick={() => handleDelete('tithe', tithe.id)} className="text-red-600 hover:text-red-900 transform hover:scale-110 transition-all duration-200"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {donationSubTab === 'dues' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Member Dues Management</h3>
                    <div className="flex items-center space-x-4">
                      <label className="text-sm font-semibold text-gray-700">Select Year:</label>
                      <select value={selectedDuesYear} onChange={(e) => setSelectedDuesYear(parseInt(e.target.value))} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium">
                        {[...availableYears].reverse().map(year => (<option key={year} value={year}>{year}</option>))}
                      </select>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50">Member Name</th>
                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => (
                              <th key={month} className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider min-w-20">{month}</th>
                            ))}
                            <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Total Paid</th>
                            <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Overall Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {getMembersForYear(selectedDuesYear).map((member) => {
                            const memberDues = getDuesForMemberYear(member.id, selectedDuesYear);
                            const joinDate = new Date(member.joinDate);
                            const joinYear = joinDate.getFullYear();
                            const joinMonth = joinDate.getMonth();
                            const yearTotal = Object.values(memberDues.months).reduce((sum: number, amount: any) => sum + (parseFloat(amount) || 0), 0);
                            let expectedMonths = 12;
                            if (selectedDuesYear === joinYear) expectedMonths = 12 - joinMonth;
                            const expectedAmount = expectedMonths * 50;
                            const owedAmount = Math.max(0, expectedAmount - yearTotal);
                            const status = owedAmount === 0 ? 'Fully Paid' : `Owes GH₵${owedAmount.toFixed(2)}`;
                            return (
                              <tr key={member.id} className="hover:bg-blue-50 transition-colors duration-200">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 sticky left-0 bg-white">{member.name}</td>
                                {['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].map((month, index) => {
                                  const isBeforeJoin = selectedDuesYear === joinYear && index < joinMonth;
                                  return (
                                    <td key={month} className="px-2 py-4 text-center">
                                      {isBeforeJoin ? (
                                        <span className="text-gray-400 text-xs italic">N/A</span>
                                      ) : (
                                        <input
                                          type="number" step="0.01" min="0"
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
                                  <span className="inline-flex px-3 py-1 bg-blue-100 text-blue-800 rounded-full">GH₵{yearTotal.toFixed(2)}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                  <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full shadow-sm ${owedAmount === 0 ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>{status}</span>
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

        {/* COMMUNICATIONS TAB */}
        {activeTab === 'communications' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Communications</h2>
                <p className="text-gray-600 mt-1">Send messages and announcements to your congregation</p>
              </div>
              <button onClick={() => openModal('communication')} className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 hover:from-purple-700 hover:to-purple-800 transform transition-all duration-200 hover:scale-105 shadow-lg">
                <Plus className="w-5 h-5" /><span className="font-semibold">New Communication</span>
              </button>
            </div>
            <div className="space-y-6">
              {communications.map((comm) => (
                <div key={comm.id} className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{comm.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                        <span className="inline-flex px-2 py-1 bg-purple-100 text-purple-800 rounded-md font-medium">{comm.type}</span>
                        <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" />{new Date(comm.date).toLocaleDateString()}</span>
                        <span className="flex items-center"><Users className="w-4 h-4 mr-1" />{comm.recipients}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={() => openModal('communication', comm)} className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"><Edit className="w-5 h-5" /></button>
                      <button onClick={() => handleDelete('communication', comm.id)} className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4"><p className="text-gray-700 leading-relaxed">{comm.content}</p></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-6 text-gray-900">
              {editingItem ? 'Edit' : 'Add'} {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {modalType === 'member' && (
                <>
                  <input type="text" placeholder="Full Name" value={memberForm.name} onChange={(e) => setMemberForm({...memberForm, name: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  <input type="tel" placeholder="Phone Number" value={memberForm.phone} onChange={(e) => setMemberForm({...memberForm, phone: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  <input type="text" placeholder="Full Address" value={memberForm.address} onChange={(e) => setMemberForm({...memberForm, address: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  <input type="text" placeholder="Residence (City/Town)" value={memberForm.residence} onChange={(e) => setMemberForm({...memberForm, residence: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  <input type="text" placeholder="Ministry/Department" value={memberForm.ministry} onChange={(e) => setMemberForm({...memberForm, ministry: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Join Date</label>
                    <input type="date" value={memberForm.joinDate || ''} onChange={(e) => setMemberForm({...memberForm, joinDate: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  </div>
                  <select value={memberForm.status} onChange={(e) => setMemberForm({...memberForm, status: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </>
              )}
              {modalType === 'event' && (
                <>
                  <input type="text" placeholder="Event Title" value={eventForm.title} onChange={(e) => setEventForm({...eventForm, title: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  <input type="date" value={eventForm.date} onChange={(e) => setEventForm({...eventForm, date: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  <input type="time" value={eventForm.time} onChange={(e) => setEventForm({...eventForm, time: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  <input type="text" placeholder="Location" value={eventForm.location} onChange={(e) => setEventForm({...eventForm, location: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  <textarea placeholder="Event Description" value={eventForm.description} onChange={(e) => setEventForm({...eventForm, description: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={3} />
                  <select value={eventForm.type} onChange={(e) => setEventForm({...eventForm, type: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
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
                  <select value={titheForm.donor} onChange={(e) => setTitheForm({...titheForm, donor: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
                    <option value="">Select Member</option>
                    {members.map(member => (<option key={member.id} value={member.name}>{member.name}</option>))}
                  </select>
                  <input type="number" placeholder="Amount (GH₵)" step="0.01" value={titheForm.amount} onChange={(e) => setTitheForm({...titheForm, amount: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  <input type="date" value={titheForm.date} onChange={(e) => setTitheForm({...titheForm, date: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  <select value={titheForm.method} onChange={(e) => setTitheForm({...titheForm, method: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
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
                  <input type="text" placeholder="Communication Title" value={communicationForm.title} onChange={(e) => setCommunicationForm({...communicationForm, title: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                  <textarea placeholder="Message Content" value={communicationForm.content} onChange={(e) => setCommunicationForm({...communicationForm, content: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={4} required />
                  <select value={communicationForm.type} onChange={(e) => setCommunicationForm({...communicationForm, type: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="Newsletter">Newsletter</option>
                    <option value="Announcement">Announcement</option>
                    <option value="Prayer Request">Prayer Request</option>
                    <option value="Event Invite">Event Invite</option>
                  </select>
                  <select value={communicationForm.recipients} onChange={(e) => setCommunicationForm({...communicationForm, recipients: e.target.value})} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="All Members">All Members</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Youth Group">Youth Group</option>
                    <option value="Ministry Teams">Ministry Teams</option>
                  </select>
                </>
              )}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button type="button" onClick={closeModal} className="px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 font-medium transition-colors duration-200">Cancel</button>
                <button type="submit" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-semibold transition-all duration-200 shadow-md">{editingItem ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChurchManagementSystem;
