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

  const [selectedMember, setSelectedMember] = useState<any>(null);

  const [searchTerm, setSearchTerm] = useState('');

  const [selectedDuesYear, setSelectedDuesYear] = useState(new Date().getFullYear());

  const [weeklySheets, setWeeklySheets] = useState<any[]>([]);

  const [expenditures, setExpenditures] = useState<any[]>([]);

  const [summaryYear, setSummaryYear] = useState(new Date().getFullYear());

  const [expenditureForm, setExpenditureForm] = useState({ description: '', amount: '', date: '', category: 'General' });

  const [weeklySheetForm, setWeeklySheetForm] = useState({ date: '', tithes: '', dues: '', funeralContributions: '', sundaySchool: '', bookSales: '' });



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

      setWeeklySheets(record.weeklySheets || []);

      setExpenditures(record.expenditures || []);

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

      weeklySheets: updated.weeklySheets ?? weeklySheets,

      expenditures: updated.expenditures ?? expenditures,

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

      setWeeklySheetForm({ date: '', tithes: '', dues: '', funeralContributions: '', sundaySchool: '', bookSales: '' });

      setExpenditureForm({ description: '', amount: '', date: '', category: 'General' });

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

      case 'weeklySheet': {

        const next = editingItem

          ? weeklySheets.map(w => w.id === editingItem.id ? { ...weeklySheetForm, id: editingItem.id } : w)

          : [...weeklySheets, { ...weeklySheetForm, id: newId }];

        setWeeklySheets(next);

        updated = { weeklySheets: next };

        break;

      }

      case 'expenditure': {

        const next = editingItem

          ? expenditures.map(e => e.id === editingItem.id ? { ...expenditureForm, id: editingItem.id } : e)

          : [...expenditures, { ...expenditureForm, id: newId, date: expenditureForm.date || new Date().toISOString().split('T')[0] }];

        setExpenditures(next);

        updated = { expenditures: next };

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

      case 'weeklySheet': { const next = weeklySheets.filter(w => w.id !== id); setWeeklySheets(next); updated = { weeklySheets: next }; break; }

      case 'expenditure': { const next = expenditures.filter(e => e.id !== id); setExpenditures(next); updated = { expenditures: next }; break; }

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



  const MONTHLY_DUES = 10; // GH₵10/month = GH₵120/year



  const getMembersForYear = (year: number) =>

    members.filter(member => new Date(member.joinDate).getFullYear() <= year);



  const getDuesForMemberYear = (memberId: number, year: number) =>

    dues.find(d => d.memberId === memberId && d.year === year) || {

      memberId, memberName: members.find(m => m.id === memberId)?.name, year,

      months: { jan: 0, feb: 0, mar: 0, apr: 0, may: 0, jun: 0, jul: 0, aug: 0, sep: 0, oct: 0, nov: 0, dec: 0 }

    };



  // Accumulated dues owed: sum all expected months from join date up to today

  const getAccumulatedDuesOwed = (member: any) => {

    const joinDate = new Date(member.joinDate);

    const today = new Date();

    const joinYear = joinDate.getFullYear();

    const joinMonth = joinDate.getMonth(); // 0-indexed

    const todayYear = today.getFullYear();

    const todayMonth = today.getMonth(); // 0-indexed

    const monthKeys = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];

    let totalExpected = 0;

    let totalPaid = 0;

    for (let y = joinYear; y <= todayYear; y++) {

      const startM = y === joinYear ? joinMonth : 0;

      const endM = y === todayYear ? todayMonth : 11;

      totalExpected += (endM - startM + 1) * MONTHLY_DUES;

      const memberDues = getDuesForMemberYear(member.id, y);

      for (let m = startM; m <= endM; m++) {

        totalPaid += parseFloat(memberDues.months[monthKeys[m]]) || 0;

      }

    }

    return { totalExpected, to
