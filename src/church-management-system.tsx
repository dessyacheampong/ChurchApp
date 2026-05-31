import React, { useState, useEffect } from 'react';
import { Users, Calendar, DollarSign, MessageSquare, Plus, Search, Edit, Trash2, Phone, MapPin, Clock, User, BarChart2, TrendingDown } from 'lucide-react';

// ── JSONBIN ──────────────────────────────────────────────────────────────────
const JB = 'https://api.jsonbin.io/v3';
async function jbLoad(key: string, bin: string) {
  const r = await fetch(`${JB}/b/${bin}/latest`, { headers: { 'X-Master-Key': key } });
  if (!r.ok) throw new Error('Failed to load');
  return (await r.json()).record;
}
async function jbSave(key: string, bin: string, data: any) {
  const r = await fetch(`${JB}/b/${bin}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-Master-Key': key }, body: JSON.stringify(data) });
  if (!r.ok) throw new Error('Save failed');
}
async function jbCreate(key: string) {
  const r = await fetch(`${JB}/b`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Master-Key': key, 'X-Bin-Name': 'ChurchRecords', 'X-Bin-Private': 'true' }, body: JSON.stringify({ members: [], events: [], tithes: [], dues: [], communications: [], weeklySheets: [], expenditures: [] }) });
  if (!r.ok) { const e = await r.json(); throw new Error(e.message || 'Create failed'); }
  return (await r.json()).metadata.id;
}

// ── SETUP SCREEN ─────────────────────────────────────────────────────────────
const SetupScreen = ({ onConnect }: { onConnect: (k: string, b: string) => void }) => {
  const [apiKey, setApiKey] = useState('');
  const [binId, setBinId] = useState('');
  const [mode, setMode] = useState<'new' | 'existing'>('new');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const go = async () => {
    if (!apiKey.trim()) { setError('Please enter your API key.'); return; }
    if (mode === 'existing' && !binId.trim()) { setError('Please enter your Bin ID.'); return; }
    setLoading(true); setError('');
    try {
      let id = binId.trim();
      if (mode === 'new') id = await jbCreate(apiKey.trim());
      else await jbLoad(apiKey.trim(), id);
      localStorage.setItem('cms_api_key', apiKey.trim());
      localStorage.setItem('cms_bin_id', id);
      onConnect(apiKey.trim(), id);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"><span className="text-white text-2xl">✦</span></div>
          <h1 className="text-2xl font-bold text-gray-900">Church Records Manager</h1>
          <p className="text-gray-500 mt-2 text-sm">Connect JSONBin.io to store data across all your devices.</p>
        </div>
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800 space-y-1">
            <p className="font-semibold">First time? 3 steps:</p>
            <ol className="list-decimal list-inside space-y-1 text-blue-700">
              <li>Sign up free at <a href="https://jsonbin.io" target="_blank" rel="noreferrer" className="underline font-medium">jsonbin.io</a></li>
              <li>Copy your <strong>Master API Key</strong></li>
              <li>Paste below and click Connect</li>
            </ol>
          </div>
          <div><label className="block text-sm font-semibold text-gray-700 mb-1">Master API Key</label>
            <input type="text" placeholder="$2a$10$..." value={apiKey} onChange={e => setApiKey(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm" /></div>
          <div className="flex gap-3">
            <button onClick={() => setMode('new')} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'new' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>New database</button>
            <button onClick={() => setMode('existing')} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'existing' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Existing bin</button>
          </div>
          {mode === 'existing' && <div><label className="block text-sm font-semibold text-gray-700 mb-1">Bin ID</label><input type="text" placeholder="6849abc..." value={binId} onChange={e => setBinId(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm" /></div>}
          {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
          <button onClick={go} disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 shadow-lg">{loading ? 'Connecting...' : mode === 'new' ? 'Create & Connect' : 'Connect'}</button>
        </div>
      </div>
    </div>
  );
};

// ── LOGO ─────────────────────────────────────────────────────────────────────
const ChurchLogo = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full">
    <defs>
      <linearGradient id="gg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style={{stopColor:"#3B82F6",stopOpacity:1}}/><stop offset="100%" style={{stopColor:"#1E40AF",stopOpacity:1}}/></linearGradient>
      <linearGradient id="dg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style={{stopColor:"#FFFFFF",stopOpacity:1}}/><stop offset="100%" style={{stopColor:"#E5E7EB",stopOpacity:1}}/></linearGradient>
    </defs>
    <circle cx="50" cy="55" r="30" fill="url(#gg)" stroke="#1E40AF" strokeWidth="2"/>
    <path d="M20 55 Q50 35 80 55" stroke="#FFFFFF" strokeWidth="1.5" fill="none" opacity="0.8"/>
    <path d="M20 55 Q50 75 80 55" stroke="#FFFFFF" strokeWidth="1.5" fill="none" opacity="0.8"/>
    <line x1="50" y1="25" x2="50" y2="85" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8"/>
    <line x1="20" y1="55" x2="80" y2="55" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8"/>
    <rect x="47" y="15" width="6" height="25" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1"/>
    <rect x="40" y="22" width="20" height="6" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1"/>
    <g transform="translate(35,35) scale(0.8)">
      <ellipse cx="15" cy="10" rx="12" ry="6" fill="url(#dg)" stroke="#D1D5DB" strokeWidth="1"/>
      <ellipse cx="20" cy="8" rx="3" ry="2" fill="url(#dg)" stroke="#D1D5DB" strokeWidth="1"/>
      <path d="M8 12 Q2 8 5 15 Q8 18 12 15" fill="url(#dg)" stroke="#D1D5DB" strokeWidth="1"/>
      <path d="M25 10 Q32 6 30 12 Q28 15 25 12" fill="url(#dg)" stroke="#D1D5DB" strokeWidth="1"/>
      <circle cx="20" cy="8" r="1" fill="#374151"/>
      <path d="M25 12 Q28 10 30 8" stroke="#10B981" strokeWidth="1.5" fill="none"/>
      <ellipse cx="29" cy="7" rx="1.5" ry="0.8" fill="#10B981"/>
      <ellipse cx="27" cy="9" rx="1" ry="0.6" fill="#10B981"/>
    </g>
  </svg>
);

// ── TOAST ─────────────────────────────────────────────────────────────────────
const Toast = ({ msg, type }: { msg: string; type: string }) =>
  msg ? <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl text-white text-sm font-medium ${type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}>{msg}</div> : null;

// ── INPUT STYLES ──────────────────────────────────────────────────────────────
const inp = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent";

// ── MAIN APP ──────────────────────────────────────────────────────────────────
const ChurchManagementSystem = () => {
  // connection
  const [apiKey, setApiKey] = useState('');
  const [binId, setBinId] = useState('');
  const [connected, setConnected] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ msg: '', type: '' });

  // data
  const [members, setMembers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [tithes, setTithes] = useState<any[]>([]);
  const [dues, setDues] = useState<any[]>([]);
  const [communications, setCommunications] = useState<any[]>([]);
  const [weeklySheets, setWeeklySheets] = useState<any[]>([]);
  const [expenditures, setExpenditures] = useState<any[]>([]);

  // ui
  const [activeTab, setActiveTab] = useState('members');
  const [donationSubTab, setDonationSubTab] = useState('tithes');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDuesYear, setSelectedDuesYear] = useState(new Date().getFullYear());
  const [summaryYear, setSummaryYear] = useState(new Date().getFullYear());

  // forms
  const [memberForm, setMemberForm] = useState({ name: '', phone: '', address: '', residence: '', ministry: '', status: 'Active', joinDate: '' });
  const [eventForm, setEventForm] = useState({ title: '', date: '', time: '', location: '', description: '', type: 'Service' });
  const [titheForm, setTitheForm] = useState({ donor: '', amount: '', date: '', method: 'Cash' });
  const [communicationForm, setCommunicationForm] = useState({ title: '', content: '', type: 'Newsletter', recipients: 'All Members' });
  const [weeklyForm, setWeeklyForm] = useState({ date: '', tithes: '', dues: '', funeral: '', sundaySchool: '', bookSales: '' });
  const [expForm, setExpForm] = useState({ description: '', amount: '', date: '', category: 'General' });

  // ── init ──
  useEffect(() => {
    const k = localStorage.getItem('cms_api_key');
    const b = localStorage.getItem('cms_bin_id');
    if (k && b) { setApiKey(k); setBinId(b); loadData(k, b); }
  }, []);

  const showToast = (msg: string, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: '' }), 3000);
  };

  const loadData = async (k: string, b: string) => {
    try {
      const r = await jbLoad(k, b);
      setMembers(r.members || []);
      setEvents(r.events || []);
      setTithes(r.tithes || []);
      setDues(r.dues || []);
      setCommunications(r.communications || []);
      setWeeklySheets(r.weeklySheets || []);
      setExpenditures(r.expenditures || []);
      setConnected(true);
      showToast('Data loaded ✓');
    } catch (e: any) { showToast(e.message, 'error'); }
  };

  const saveData = async (patch: any = {}) => {
    const payload = {
      members: patch.members ?? members,
      events: patch.events ?? events,
      tithes: patch.tithes ?? tithes,
      dues: patch.dues ?? dues,
      communications: patch.communications ?? communications,
      weeklySheets: patch.weeklySheets ?? weeklySheets,
      expenditures: patch.expenditures ?? expenditures,
    };
    setSaving(true);
    try { await jbSave(apiKey, binId, payload); showToast('Saved ✓'); }
    catch (e: any) { showToast('Save failed: ' + e.message, 'error'); }
    finally { setSaving(false); }
  };

  const handleConnect = (k: string, b: string) => { setApiKey(k); setBinId(b); loadData(k, b); };
  const handleDisconnect = () => {
    if (!confirm('Disconnect? You can reconnect any time.')) return;
    localStorage.removeItem('cms_api_key'); localStorage.removeItem('cms_bin_id');
    setConnected(false); setApiKey(''); setBinId('');
  };

  // ── modals ──
  const openModal = (type: string, item: any = null) => {
    setModalType(type); setEditingItem(item); setShowModal(true);
    if (item) {
      if (type === 'member') setMemberForm(item);
      else if (type === 'event') setEventForm(item);
      else if (type === 'tithe') setTitheForm(item);
      else if (type === 'communication') setCommunicationForm(item);
      else if (type === 'weeklySheet') setWeeklyForm({ date: item.date, tithes: item.tithes ?? '', dues: item.dues ?? '', funeral: item.funeral ?? '', sundaySchool: item.sundaySchool ?? '', bookSales: item.bookSales ?? '' });
      else if (type === 'expenditure') setExpForm(item);
    } else {
      setMemberForm({ name: '', phone: '', address: '', residence: '', ministry: '', status: 'Active', joinDate: '' });
      setEventForm({ title: '', date: '', time: '', location: '', description: '', type: 'Service' });
      setTitheForm({ donor: '', amount: '', date: '', method: 'Cash' });
      setCommunicationForm({ title: '', content: '', type: 'Newsletter', recipients: 'All Members' });
      setWeeklyForm({ date: '', tithes: '', dues: '', funeral: '', sundaySchool: '', bookSales: '' });
      setExpForm({ description: '', amount: '', date: '', category: 'General' });
    }
  };
  const closeModal = () => { setShowModal(false); setModalType(''); setEditingItem(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = Date.now();
    let patch: any = {};
    if (modalType === 'member') {
      const next = editingItem ? members.map(m => m.id === editingItem.id ? { ...memberForm, id: editingItem.id } : m) : [...members, { ...memberForm, id, joinDate: memberForm.joinDate || new Date().toISOString().split('T')[0] }];
      setMembers(next); patch = { members: next };
    } else if (modalType === 'event') {
      const next = editingItem ? events.map(ev => ev.id === editingItem.id ? { ...eventForm, id: editingItem.id } : ev) : [...events, { ...eventForm, id }];
      setEvents(next); patch = { events: next };
    } else if (modalType === 'tithe') {
      const next = editingItem ? tithes.map(t => t.id === editingItem.id ? { ...titheForm, id: editingItem.id, amount: parseFloat(titheForm.amount) } : t) : [...tithes, { ...titheForm, id, amount: parseFloat(titheForm.amount), date: titheForm.date || new Date().toISOString().split('T')[0] }];
      setTithes(next); patch = { tithes: next };
    } else if (modalType === 'communication') {
      const next = editingItem ? communications.map(c => c.id === editingItem.id ? { ...communicationForm, id: editingItem.id } : c) : [...communications, { ...communicationForm, id, date: new Date().toISOString().split('T')[0] }];
      setCommunications(next); patch = { communications: next };
    } else if (modalType === 'weeklySheet') {
      const sheet = { id: editingItem?.id || id, date: weeklyForm.date, tithes: weeklyForm.tithes, dues: weeklyForm.dues, funeral: weeklyForm.funeral, sundaySchool: weeklyForm.sundaySchool, bookSales: weeklyForm.bookSales };
      const next = editingItem ? weeklySheets.map(w => w.id === editingItem.id ? sheet : w) : [...weeklySheets, sheet];
      setWeeklySheets(next); patch = { weeklySheets: next };
    } else if (modalType === 'expenditure') {
      const next = editingItem ? expenditures.map(ex => ex.id === editingItem.id ? { ...expForm, id: editingItem.id } : ex) : [...expenditures, { ...expForm, id, date: expForm.date || new Date().toISOString().split('T')[0] }];
      setExpenditures(next); patch = { expenditures: next };
    }
    closeModal();
    await saveData(patch);
  };

  const handleDelete = async (type: string, id: number) => {
    if (!confirm('Delete this item?')) return;
    let patch: any = {};
    if (type === 'member') { const n = members.filter(m => m.id !== id); setMembers(n); patch = { members: n }; }
    else if (type === 'event') { const n = events.filter(ev => ev.id !== id); setEvents(n); patch = { events: n }; }
    else if (type === 'tithe') { const n = tithes.filter(t => t.id !== id); setTithes(n); patch = { tithes: n }; }
    else if (type === 'communication') { const n = communications.filter(c => c.id !== id); setCommunications(n); patch = { communications: n }; }
    else if (type === 'weeklySheet') { const n = weeklySheets.filter(w => w.id !== id); setWeeklySheets(n); patch = { weeklySheets: n }; }
    else if (type === 'expenditure') { const n = expenditures.filter(ex => ex.id !== id); setExpenditures(n); patch = { expenditures: n }; }
    await saveData(patch);
  };

  // ── dues helpers ──
  const MONTHLY_DUES = 10;
  const getDuesForMemberYear = (memberId: number, year: number) =>
    dues.find(d => d.memberId === memberId && d.year === year) || { memberId, year, months: { jan:0,feb:0,mar:0,apr:0,may:0,jun:0,jul:0,aug:0,sep:0,oct:0,nov:0,dec:0 } };

  const getAccumulatedDues = (member: any) => {
    const mkeys = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
    const join = new Date(member.joinDate);
    const today = new Date();
    let expected = 0, paid = 0;
    for (let y = join.getFullYear(); y <= today.getFullYear(); y++) {
      const sm = y === join.getFullYear() ? join.getMonth() : 0;
      const em = y === today.getFullYear() ? today.getMonth() : 11;
      expected += (em - sm + 1) * MONTHLY_DUES;
      const rec = getDuesForMemberYear(member.id, y);
      for (let m = sm; m <= em; m++) paid += parseFloat(rec.months[mkeys[m]]) || 0;
    }
    return { expected, paid, owed: Math.max(0, expected - paid) };
  };

  const getMemberDuesSummary = (member: any) => {
    const mkeys = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
    const mlabs = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const join = new Date(member.joinDate);
    const today = new Date();
    const years: any[] = [];
    for (let y = join.getFullYear(); y <= today.getFullYear(); y++) {
      const sm = y === join.getFullYear() ? join.getMonth() : 0;
      const em = y === today.getFullYear() ? today.getMonth() : 11;
      const rec = getDuesForMemberYear(member.id, y);
      let yPaid = 0, yExp = 0;
      const months = [];
      for (let m = sm; m <= em; m++) {
        const p = parseFloat(rec.months[mkeys[m]]) || 0;
        yPaid += p; yExp += MONTHLY_DUES;
        months.push({ label: mlabs[m], paid: p, expected: MONTHLY_DUES });
      }
      years.push({ year: y, months, yPaid, yExp, yOwed: Math.max(0, yExp - yPaid) });
    }
    return years;
  };

  const updateDuesPayment = async (memberId: number, year: number, month: string, amount: string) => {
    const val = parseFloat(amount) || 0;
    const existing = dues.find(d => d.memberId === memberId && d.year === year);
    let next: any[];
    if (existing) {
      next = dues.map(d => d.memberId === memberId && d.year === year ? { ...d, months: { ...d.months, [month]: val } } : d);
    } else {
      next = [...dues, { id: Date.now(), memberId, memberName: members.find(m => m.id === memberId)?.name, year, months: { jan:0,feb:0,mar:0,apr:0,may:0,jun:0,jul:0,aug:0,sep:0,oct:0,nov:0,dec:0, [month]: val } }];
    }
    setDues(next);
    await saveData({ dues: next });
  };

  // ── sundays ──
  const SUNDAYS: string[] = (() => {
    const out: string[] = [];
    let d = new Date('2026-01-04T00:00:00');
    const today = new Date();
    today.setHours(23, 59, 59, 0);
    while (d <= today) { out.push(d.toISOString().split('T')[0]); d = new Date(d.getTime() + 7*24*60*60*1000); }
    return out;
  })();

  const cats = [
    { key: 'tithes', label: 'Tithes' },
    { key: 'dues', label: 'Dues' },
    { key: 'funeral', label: 'Funeral Contributions' },
    { key: 'sundaySchool', label: 'Sunday School' },
    { key: 'bookSales', label: 'Book Sales' },
  ];

  const totalTithes = tithes.reduce((s, t) => s + parseFloat(t.amount), 0);
  const filteredMembers = members.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.residence.toLowerCase().includes(searchTerm.toLowerCase()));
  const curYear = new Date().getFullYear();
  const availableYears: number[] = [];
  for (let y = 2012; y <= curYear; y++) availableYears.push(y);

  const tabs = [
    { id: 'members', label: 'Members', icon: Users },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'donations', label: 'Donations & Dues', icon: DollarSign },
    { id: 'communications', label: 'Communications', icon: MessageSquare },
    { id: 'summary', label: 'Summary', icon: BarChart2 },
    { id: 'expenditure', label: 'Expenditure', icon: TrendingDown },
  ];

  if (!connected) return <SetupScreen onConnect={handleConnect} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Toast msg={toast.msg} type={toast.type} />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 shadow-2xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-6">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="w-9 h-9 sm:w-14 sm:h-14 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white border-opacity-30 shadow-lg p-1 flex-shrink-0"><ChurchLogo /></div>
              <div>
                <h1 className="text-sm sm:text-3xl font-bold text-white leading-tight">Gracious Palace Int'l Ministries</h1>
                <p className="text-blue-100 text-xs sm:text-sm hidden sm:block">Ablekuma, Joma - Poultry Farm Junction</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="text-white text-xs sm:text-sm font-semibold">
                <span className="hidden sm:inline">{new Date().toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</span>
                <span className="sm:hidden">{new Date().toLocaleDateString('en-GH')}</span>
              </div>
              <div className="text-blue-100 text-xs italic hidden sm:block">Deut 4:20 "... to be His people, an inheritance as you are this day."</div>
              <div className="flex items-center gap-2">
                {saving && <span className="text-blue-200 text-xs animate-pulse">Saving…</span>}
                <span className="text-xs text-green-200 bg-green-700 bg-opacity-40 px-2 py-0.5 rounded-full">● Live</span>
                <button onClick={handleDisconnect} className="text-xs text-blue-200 hover:text-white underline">⚙</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="bg-white shadow-xl border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <nav className="flex overflow-x-auto -mb-px">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1.5 sm:space-x-2 py-3 sm:py-5 px-3 sm:px-4 border-b-2 font-semibold text-xs sm:text-sm whitespace-nowrap flex-shrink-0 transition-all duration-200 ${activeTab === tab.id ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" /><span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">

        {/* ── MEMBERS ── */}
        {activeTab === 'members' && (
          <div>
            <div className="flex justify-between items-center mb-4 sm:mb-8">
              <div><h2 className="text-xl sm:text-2xl font-bold text-gray-900">Member Management</h2><p className="text-gray-600 mt-0.5 text-sm hidden sm:block">Manage church community</p></div>
              <button onClick={() => openModal('member')} className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl flex items-center space-x-2 shadow-lg text-sm sm:text-base"><Plus className="w-4 h-4 sm:w-5 sm:h-5" /><span className="font-semibold">Add Member</span></button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 text-white"><div className="flex items-center justify-between"><div><p className="text-blue-100 text-xs sm:text-sm font-medium">Total Members</p><p className="text-3xl sm:text-4xl font-bold mt-1">{members.length}</p></div><Users className="w-7 h-7 sm:w-10 sm:h-10 text-blue-200" /></div></div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 text-white"><div className="flex items-center justify-between"><div><p className="text-green-100 text-xs sm:text-sm font-medium">Active</p><p className="text-3xl sm:text-4xl font-bold mt-1">{members.filter(m => m.status === 'Active').length}</p></div><Users className="w-7 h-7 sm:w-10 sm:h-10 text-green-200" /></div></div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 text-white"><div className="flex items-center justify-between"><div><p className="text-purple-100 text-xs sm:text-sm font-medium">New Month</p><p className="text-3xl sm:text-4xl font-bold mt-1">{members.filter(m => { const j = new Date(m.joinDate); const n = new Date(); return j.getMonth() === n.getMonth() && j.getFullYear() === n.getFullYear(); }).length}</p></div><Plus className="w-7 h-7 sm:w-10 sm:h-10 text-purple-200" /></div></div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 text-white"><div className="flex items-center justify-between"><div><p className="text-orange-100 text-xs sm:text-sm font-medium">Total Tithes</p><p className="text-2xl sm:text-4xl font-bold mt-1">GH₵{totalTithes.toFixed(0)}</p></div><DollarSign className="w-7 h-7 sm:w-10 sm:h-10 text-orange-200" /></div></div>
            </div>
            <div className="mb-4"><div className="relative"><Search className="w-5 h-5 absolute left-4 top-3.5 text-gray-400" /><input type="text" placeholder="Search members..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 shadow-sm" /></div></div>

            {/* Mobile cards */}
            <div className="sm:hidden space-y-3">
              {filteredMembers.map(m => (
                <div key={m.id} className="bg-white rounded-xl shadow-md p-4 border border-gray-100 cursor-pointer active:bg-blue-50" onClick={() => setSelectedMember(m)}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow flex-shrink-0"><User className="w-5 h-5 text-white" /></div>
                      <div><div className="font-semibold text-gray-900 text-sm">{m.name}</div><div className="text-xs text-gray-500">Joined: {new Date(m.joinDate).toLocaleDateString()}</div></div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-bold rounded-full ${m.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{m.status}</span>
                      <button onClick={ev => { ev.stopPropagation(); openModal('member', m); }} className="text-blue-600 p-1"><Edit className="w-4 h-4" /></button>
                      <button onClick={ev => { ev.stopPropagation(); handleDelete('member', m.id); }} className="text-red-500 p-1"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div className="flex items-center gap-1"><Phone className="w-3 h-3 text-green-600" /><span>{m.phone}</span></div>
                    <div className="flex items-center gap-1"><MapPin className="w-3 h-3 text-blue-500" /><span>{m.residence}</span></div>
                    {m.ministry && <div className="col-span-2 text-gray-500">{m.ministry}</div>}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block bg-white rounded-2xl shadow-xl overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    {['Name','Contact','Residence','Ministry','Status','Actions'].map(h => <th key={h} className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>)}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMembers.map(m => (
                    <tr key={m.id} className="hover:bg-blue-50 transition-colors cursor-pointer" onClick={() => setSelectedMember(m)}>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-md"><User className="w-6 h-6 text-white" /></div><div className="ml-4"><div className="text-sm font-semibold text-gray-900">{m.name}</div><div className="text-sm text-gray-500">Joined: {new Date(m.joinDate).toLocaleDateString()}</div></div></div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900 flex items-center mb-1"><Phone className="w-4 h-4 mr-2 text-green-600" />{m.phone}</div><div className="text-sm text-gray-500 flex items-center"><MapPin className="w-4 h-4 mr-2 text-red-500" />{m.address}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className="inline-flex px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">{m.residence}</span></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{m.ministry}</td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full shadow-sm ${m.status === 'Active' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>{m.status}</span></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium"><div className="flex space-x-3" onClick={ev => ev.stopPropagation()}><button onClick={() => openModal('member', m)} className="text-blue-600 hover:text-blue-900"><Edit className="w-5 h-5" /></button><button onClick={() => handleDelete('member', m.id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-5 h-5" /></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── EVENTS ── */}
        {activeTab === 'events' && (
          <div>
            <div className="flex justify-between items-center mb-8"><div><h2 className="text-2xl font-bold text-gray-900">Event Management</h2><p className="text-gray-600 mt-1">Plan and organize church activities</p></div><button onClick={() => openModal('event')} className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl flex items-center space-x-2 shadow-lg hover:from-green-700 hover:to-green-800"><Plus className="w-5 h-5" /><span className="font-semibold">Add Event</span></button></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map(ev => (
                <div key={ev.id} className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                  <div className="flex justify-between items-start mb-4"><h3 className="text-xl font-bold text-gray-900">{ev.title}</h3><div className="flex space-x-2"><button onClick={() => openModal('event', ev)} className="text-blue-600 p-2 rounded-lg hover:bg-blue-50"><Edit className="w-4 h-4" /></button><button onClick={() => handleDelete('event', ev.id)} className="text-red-600 p-2 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4" /></button></div></div>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center bg-blue-50 p-2 rounded-lg"><Calendar className="w-4 h-4 mr-3 text-blue-600" /><span>{new Date(ev.date).toLocaleDateString()}</span></div>
                    <div className="flex items-center bg-green-50 p-2 rounded-lg"><Clock className="w-4 h-4 mr-3 text-green-600" /><span>{ev.time}</span></div>
                    <div className="flex items-center bg-red-50 p-2 rounded-lg"><MapPin className="w-4 h-4 mr-3 text-red-600" /><span>{ev.location}</span></div>
                  </div>
                  <p className="text-gray-700 mb-4 text-sm">{ev.description}</p>
                  <span className="inline-block px-3 py-1 text-xs font-bold bg-purple-100 text-purple-800 rounded-full">{ev.type}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── DONATIONS & DUES ── */}
        {activeTab === 'donations' && (
          <div>
            <div className="mb-6"><h2 className="text-2xl font-bold text-gray-900">Donations & Dues</h2></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white"><h3 className="text-xl font-bold mb-1">Tithe Records</h3><div className="text-3xl font-bold">GH₵{totalTithes.toFixed(2)}</div></div>
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-xl p-6 text-white"><h3 className="text-xl font-bold mb-1">Dues Overview</h3><div className="text-3xl font-bold">{members.length} Members</div></div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl">
              <div className="border-b border-gray-200"><nav className="-mb-px flex">
                <button onClick={() => setDonationSubTab('tithes')} className={`w-1/2 py-5 px-6 text-center border-b-2 font-semibold transition-all ${donationSubTab === 'tithes' ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}>💰 Tithes & Offerings</button>
                <button onClick={() => setDonationSubTab('dues')} className={`w-1/2 py-5 px-6 text-center border-b-2 font-semibold transition-all ${donationSubTab === 'dues' ? 'border-blue-500 text-blue-600 bg-blue-50' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}>📊 Member Dues</button>
              </nav></div>

              {donationSubTab === 'tithes' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold">Tithe Records</h3><button onClick={() => openModal('tithe')} className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md hover:from-emerald-700 hover:to-emerald-800"><Plus className="w-4 h-4" /><span>Record Tithe</span></button></div>
                  <div className="overflow-hidden rounded-xl border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50"><tr>{['Donor','Amount','Date','Method','Actions'].map(h => <th key={h} className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">{h}</th>)}</tr></thead>
                      <tbody className="divide-y divide-gray-200">
                        {tithes.map(t => (
                          <tr key={t.id} className="hover:bg-blue-50">
                            <td className="px-6 py-4 text-sm font-semibold">{t.donor}</td>
                            <td className="px-6 py-4"><span className="inline-flex px-3 py-1 text-sm font-bold bg-green-100 text-green-800 rounded-full">GH₵{t.amount}</span></td>
                            <td className="px-6 py-4 text-sm">{new Date(t.date).toLocaleDateString()}</td>
                            <td className="px-6 py-4"><span className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-md">{t.method}</span></td>
                            <td className="px-6 py-4"><div className="flex gap-3"><button onClick={() => openModal('tithe', t)} className="text-blue-600 hover:text-blue-900"><Edit className="w-4 h-4" /></button><button onClick={() => handleDelete('tithe', t.id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4" /></button></div></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {donationSubTab === 'dues' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Member Dues (GH₵{MONTHLY_DUES}/month)</h3>
                    <div className="flex items-center gap-3"><label className="text-sm font-semibold text-gray-700">Year:</label>
                      <select value={selectedDuesYear} onChange={e => setSelectedDuesYear(parseInt(e.target.value))} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        {[...availableYears].reverse().map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50"><tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase sticky left-0 bg-gray-50">Member</th>
                        {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => <th key={m} className="px-3 py-3 text-center text-xs font-bold text-gray-500 uppercase min-w-16">{m}</th>)}
                        <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Paid (yr)</th>
                        <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">Status (all-time)</th>
                      </tr></thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {members.filter(m => new Date(m.joinDate).getFullYear() <= selectedDuesYear).map(m => {
                          const rec = getDuesForMemberYear(m.id, selectedDuesYear);
                          const jd = new Date(m.joinDate);
                          const jy = jd.getFullYear(); const jmo = jd.getMonth();
                          const yearTotal = Object.values(rec.months).reduce((s: number, v: any) => s + (parseFloat(v) || 0), 0);
                          const { owed } = getAccumulatedDues(m);
                          return (
                            <tr key={m.id} className="hover:bg-blue-50">
                              <td className="px-6 py-4 text-sm font-semibold sticky left-0 bg-white">{m.name}</td>
                              {['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].map((mo, idx) => (
                                <td key={mo} className="px-1 py-4 text-center">
                                  {selectedDuesYear === jy && idx < jmo ? <span className="text-gray-400 text-xs italic">N/A</span> :
                                    <input type="number" step="0.01" min="0" value={rec.months[mo] || ''} onChange={e => updateDuesPayment(m.id, selectedDuesYear, mo, e.target.value)} className="w-14 px-1 py-1 text-sm border border-gray-300 rounded text-center focus:ring-1 focus:ring-blue-500" placeholder="0" />}
                                </td>
                              ))}
                              <td className="px-6 py-4 text-center"><span className="inline-flex px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">GH₵{yearTotal.toFixed(2)}</span></td>
                              <td className="px-6 py-4 text-center"><span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${owed === 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{owed === 0 ? 'Fully Paid' : `Owes GH₵${owed.toFixed(2)}`}</span></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── COMMUNICATIONS ── */}
        {activeTab === 'communications' && (
          <div>
            <div className="flex justify-between items-center mb-8"><div><h2 className="text-2xl font-bold text-gray-900">Communications</h2><p className="text-gray-600 mt-1">Messages and announcements</p></div><button onClick={() => openModal('communication')} className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg hover:from-purple-700 hover:to-purple-800"><Plus className="w-5 h-5" /><span className="font-semibold">New Communication</span></button></div>
            <div className="space-y-6">
              {communications.map(c => (
                <div key={c.id} className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <div><h3 className="text-xl font-bold text-gray-900">{c.title}</h3><div className="flex items-center gap-3 text-sm text-gray-500 mt-2"><span className="inline-flex px-2 py-1 bg-purple-100 text-purple-800 rounded-md font-medium">{c.type}</span><span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(c.date).toLocaleDateString()}</span><span className="flex items-center gap-1"><Users className="w-4 h-4" />{c.recipients}</span></div></div>
                    <div className="flex gap-2"><button onClick={() => openModal('communication', c)} className="text-blue-600 p-2 rounded-lg hover:bg-blue-50"><Edit className="w-5 h-5" /></button><button onClick={() => handleDelete('communication', c.id)} className="text-red-600 p-2 rounded-lg hover:bg-red-50"><Trash2 className="w-5 h-5" /></button></div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4"><p className="text-gray-700">{c.content}</p></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SUMMARY ── */}
        {activeTab === 'summary' && (() => {
          const allYears = Array.from(new Set([...weeklySheets.map(w => w.date?.slice(0,4)), String(new Date().getFullYear())])).filter(Boolean).sort().reverse();
          const filtered = weeklySheets.filter(w => w.date?.startsWith(String(summaryYear)));
          const totals = cats.reduce((acc: any, c) => { acc[c.key] = filtered.reduce((s: number, w: any) => s + (parseFloat(w[c.key]) || 0), 0); return acc; }, {} as any);
          const gross = cats.reduce((s, c) => s + totals[c.key], 0);
          const totalExp = expenditures.filter(e => e.date?.startsWith(String(summaryYear))).reduce((s: number, e: any) => s + parseFloat(e.amount || 0), 0);
          return (
            <div>
              <div className="flex flex-wrap justify-between items-center mb-5 gap-3">
                <div><h2 className="text-xl sm:text-2xl font-bold text-gray-900">Weekly Collections Summary</h2><p className="text-gray-500 text-sm mt-0.5">Sunday-by-Sunday breakdown</p></div>
                <div className="flex items-center gap-3">
                  <select value={summaryYear} onChange={e => setSummaryYear(parseInt(e.target.value))} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                    {allYears.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                  <button onClick={() => openModal('weeklySheet')} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold shadow-md"><Plus className="w-4 h-4" />Add Week</button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
                {cats.map(c => <div key={c.key} className="bg-blue-50 border border-blue-200 rounded-xl p-3"><div className="text-xs font-semibold text-blue-600 mb-1">{c.label}</div><div className="text-lg font-bold text-blue-800">GH₵{totals[c.key].toFixed(2)}</div></div>)}
              </div>
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 text-white"><div className="text-xs font-semibold text-emerald-100 mb-1">Gross Revenue</div><div className="text-xl font-bold">GH₵{gross.toFixed(2)}</div></div>
                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 text-white"><div className="text-xs font-semibold text-red-100 mb-1">Total Expenditure</div><div className="text-xl font-bold">GH₵{totalExp.toFixed(2)}</div></div>
                <div className={`bg-gradient-to-br rounded-xl p-4 text-white ${(gross-totalExp)>=0?'from-blue-600 to-indigo-600':'from-orange-500 to-red-600'}`}><div className="text-xs font-semibold text-blue-100 mb-1">Balance</div><div className="text-xl font-bold">GH₵{(gross-totalExp).toFixed(2)}</div></div>
              </div>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50"><tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase sticky left-0 bg-gray-50 min-w-24">Date</th>
                      {cats.map(c => <th key={c.key} className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase min-w-28">{c.label}</th>)}
                      <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase min-w-24">Total</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase">Actions</th>
                    </tr></thead>
                    <tbody className="divide-y divide-gray-100">
                      {SUNDAYS.map(sun => {
                        const sheet = filtered.find(w => w.date === sun);
                        const rowTotal = sheet ? cats.reduce((s, c) => s + (parseFloat((sheet as any)[c.key]) || 0), 0) : null;
                        return (
                          <tr key={sun} className={`${sheet ? 'hover:bg-blue-50' : 'opacity-40'} transition-colors`}>
                            <td className="px-4 py-3 sticky left-0 bg-white font-medium">{new Date(sun + 'T00:00:00').toLocaleDateString('en-GH', { day:'2-digit', month:'short' })}</td>
                            {cats.map(c => <td key={c.key} className="px-4 py-3 text-right text-gray-700">{sheet ? `GH₵${parseFloat((sheet as any)[c.key]||0).toFixed(2)}` : '—'}</td>)}
                            <td className="px-4 py-3 text-right font-bold">{rowTotal !== null ? `GH₵${rowTotal.toFixed(2)}` : '—'}</td>
                            <td className="px-4 py-3 text-center">
                              {sheet ? <div className="flex justify-center gap-2"><button onClick={() => openModal('weeklySheet', sheet)} className="text-blue-600 hover:text-blue-900"><Edit className="w-4 h-4" /></button><button onClick={() => handleDelete('weeklySheet', sheet.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button></div>
                                : <button onClick={() => { setWeeklyForm({ date: sun, tithes:'', dues:'', funeral:'', sundaySchool:'', bookSales:'' }); setModalType('weeklySheet'); setEditingItem(null); setShowModal(true); }} className="text-xs text-blue-500 border border-blue-300 px-2 py-0.5 rounded hover:text-blue-700">+ Record</button>}
                            </td>
                          </tr>
                        );
                      })}
                      <tr className="bg-gray-50 font-bold border-t-2 border-gray-300">
                        <td className="px-4 py-3 sticky left-0 bg-gray-50 text-gray-700">TOTAL</td>
                        {cats.map(c => <td key={c.key} className="px-4 py-3 text-right text-gray-900">GH₵{totals[c.key].toFixed(2)}</td>)}
                        <td className="px-4 py-3 text-right text-emerald-700">GH₵{gross.toFixed(2)}</td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ── EXPENDITURE ── */}
        {activeTab === 'expenditure' && (() => {
          const sorted = [...expenditures].sort((a, b) => a.date?.localeCompare(b.date));
          const totalRevenue = weeklySheets.reduce((s: number, w: any) => s + cats.reduce((ss, c) => ss + (parseFloat(w[c.key]) || 0), 0), 0);
          let running = totalRevenue;
          const rows = sorted.map((e: any) => { const amt = parseFloat(e.amount || 0); running -= amt; return { ...e, balanceAfter: running }; });
          const totalExp = expenditures.reduce((s: number, e: any) => s + parseFloat(e.amount || 0), 0);
          const balance = totalRevenue - totalExp;
          return (
            <div>
              <div className="flex flex-wrap justify-between items-center mb-5 gap-3">
                <div><h2 className="text-xl sm:text-2xl font-bold text-gray-900">Expenditure</h2><p className="text-gray-500 text-sm mt-0.5">All expenses with running balance</p></div>
                <button onClick={() => openModal('expenditure')} className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold shadow-md hover:from-red-700 hover:to-rose-700"><Plus className="w-4 h-4" />Add Expenditure</button>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4"><div className="text-xs font-semibold text-emerald-600 mb-1">Total Revenue</div><div className="text-xl font-bold text-emerald-800">GH₵{totalRevenue.toFixed(2)}</div></div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4"><div className="text-xs font-semibold text-red-600 mb-1">Total Spent</div><div className="text-xl font-bold text-red-800">GH₵{totalExp.toFixed(2)}</div></div>
                <div className={`rounded-xl p-4 border ${balance>=0?'bg-blue-50 border-blue-200':'bg-orange-50 border-orange-200'}`}><div className={`text-xs font-semibold mb-1 ${balance>=0?'text-blue-600':'text-orange-600'}`}>Balance</div><div className={`text-xl font-bold ${balance>=0?'text-blue-800':'text-orange-800'}`}>GH₵{balance.toFixed(2)}</div></div>
              </div>
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50"><tr>
                      {['Date','Description','Category','Amount','Balance After','Actions'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">{h}</th>)}
                    </tr></thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr className="bg-emerald-50">
                        <td className="px-4 py-3 text-gray-500 italic text-xs">—</td>
                        <td className="px-4 py-3 font-semibold text-emerald-800">Opening Balance (Total Revenue)</td>
                        <td className="px-4 py-3"></td>
                        <td className="px-4 py-3 font-bold text-emerald-700">GH₵{totalRevenue.toFixed(2)}</td>
                        <td className="px-4 py-3 font-bold text-emerald-700">GH₵{totalRevenue.toFixed(2)}</td>
                        <td></td>
                      </tr>
                      {rows.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400 italic">No expenditures recorded yet</td></tr>}
                      {rows.map((e: any) => (
                        <tr key={e.id} className="hover:bg-red-50 transition-colors">
                          <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{new Date(e.date + 'T00:00:00').toLocaleDateString('en-GH', { day:'2-digit', month:'short', year:'numeric' })}</td>
                          <td className="px-4 py-3 font-medium text-gray-800">{e.description}</td>
                          <td className="px-4 py-3"><span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{e.category}</span></td>
                          <td className="px-4 py-3 font-semibold text-red-700">- GH₵{parseFloat(e.amount).toFixed(2)}</td>
                          <td className="px-4 py-3 font-bold"><span className={e.balanceAfter>=0?'text-blue-700':'text-orange-700'}>GH₵{e.balanceAfter.toFixed(2)}</span></td>
                          <td className="px-4 py-3"><div className="flex gap-2"><button onClick={() => openModal('expenditure', e)} className="text-blue-600 hover:text-blue-900"><Edit className="w-4 h-4" /></button><button onClick={() => handleDelete('expenditure', e.id)} className="text-red-500 hover:text-red-700"><Trash2 className="w-4 h-4" /></button></div></td>
                        </tr>
                      ))}
                      {rows.length > 0 && <tr className="bg-gray-50 font-bold border-t-2 border-gray-300">
                        <td colSpan={3} className="px-4 py-3 text-gray-700">FINAL BALANCE</td>
                        <td className="px-4 py-3 text-red-700">- GH₵{totalExp.toFixed(2)}</td>
                        <td className="px-4 py-3"><span className={`text-lg ${balance>=0?'text-blue-800':'text-orange-700'}`}>GH₵{balance.toFixed(2)}</span></td>
                        <td></td>
                      </tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })()}

      </div>{/* end main content */}

      {/* ── MEMBER DETAIL SHEET ── */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 backdrop-blur-sm" onClick={() => setSelectedMember(null)}>
          <div className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center"><User className="w-5 h-5 text-white" /></div>
                <div><div className="text-white font-bold text-base">{selectedMember.name}</div><div className="text-blue-100 text-xs">{selectedMember.ministry || 'No Ministry'} · {selectedMember.status}</div></div>
              </div>
              <button onClick={() => setSelectedMember(null)} className="text-white text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20">✕</button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">Phone</div><div className="font-medium">{selectedMember.phone || '—'}</div></div>
                <div className="bg-gray-50 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">Residence</div><div className="font-medium">{selectedMember.residence || '—'}</div></div>
                <div className="bg-gray-50 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">Address</div><div className="font-medium">{selectedMember.address || '—'}</div></div>
                <div className="bg-gray-50 rounded-lg p-3"><div className="text-xs text-gray-500 mb-1">Joined</div><div className="font-medium">{new Date(selectedMember.joinDate).toLocaleDateString()}</div></div>
              </div>

              {/* Dues */}
              {(() => {
                const { expected, paid, owed } = getAccumulatedDues(selectedMember);
                const summary = getMemberDuesSummary(selectedMember);
                return (
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2"><DollarSign className="w-4 h-4 text-indigo-500" />Dues Summary</h3>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="bg-blue-50 rounded-lg p-3 text-center"><div className="text-xs text-blue-600 mb-1">Expected</div><div className="font-bold text-blue-800 text-sm">GH₵{expected.toFixed(2)}</div></div>
                      <div className="bg-green-50 rounded-lg p-3 text-center"><div className="text-xs text-green-600 mb-1">Paid</div><div className="font-bold text-green-800 text-sm">GH₵{paid.toFixed(2)}</div></div>
                      <div className={`rounded-lg p-3 text-center ${owed===0?'bg-green-50':'bg-red-50'}`}><div className={`text-xs mb-1 ${owed===0?'text-green-600':'text-red-600'}`}>Owed</div><div className={`font-bold text-sm ${owed===0?'text-green-800':'text-red-800'}`}>{owed===0?'✓ Clear':`GH₵${owed.toFixed(2)}`}</div></div>
                    </div>
                    {summary.map(ys => (
                      <div key={ys.year} className="mb-3 border border-gray-200 rounded-xl overflow-hidden">
                        <div className="bg-gray-50 px-4 py-2 flex justify-between items-center"><span className="font-semibold text-sm text-gray-700">{ys.year}</span><div className="flex gap-2 text-xs"><span className="text-green-700 bg-green-100 px-2 py-0.5 rounded-full">Paid GH₵{ys.yPaid.toFixed(2)}</span>{ys.yOwed>0&&<span className="text-red-700 bg-red-100 px-2 py-0.5 rounded-full">Owes GH₵{ys.yOwed.toFixed(2)}</span>}</div></div>
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-1 p-2">
                          {ys.months.map((m: any) => <div key={m.label} className={`rounded-lg p-1.5 text-center text-xs ${m.paid>=m.expected?'bg-green-100 text-green-800':m.paid>0?'bg-yellow-100 text-yellow-800':'bg-red-50 text-red-700'}`}><div className="font-medium">{m.label}</div><div>{m.paid>0?`GH₵${m.paid}`:'—'}</div></div>)}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* Tithes */}
              {(() => {
                const mt = tithes.filter(t => t.donor === selectedMember.name);
                const total = mt.reduce((s: number, t: any) => s + parseFloat(t.amount||0), 0);
                return (
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2"><DollarSign className="w-4 h-4 text-emerald-500" />Tithe Records</h3>
                    <div className="bg-emerald-50 rounded-xl p-3 mb-3 flex justify-between items-center"><span className="text-emerald-700 font-semibold text-sm">Total Given</span><span className="text-emerald-800 font-bold text-lg">GH₵{total.toFixed(2)}</span></div>
                    {mt.length===0 ? <p className="text-gray-400 text-sm text-center py-3 italic">No tithe records yet</p> :
                      <div className="space-y-2">{[...mt].sort((a,b)=>b.date.localeCompare(a.date)).map((t:any) => <div key={t.id} className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2 text-sm"><div><div className="font-medium text-gray-800">{new Date(t.date).toLocaleDateString()}</div><div className="text-xs text-gray-500">{t.method}</div></div><span className="font-bold text-emerald-700">GH₵{parseFloat(t.amount).toFixed(2)}</span></div>)}</div>}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-6 text-gray-900">{editingItem?'Edit':'Add'} {modalType === 'weeklySheet' ? 'Weekly Sheet' : modalType === 'expenditure' ? 'Expenditure' : modalType.charAt(0).toUpperCase()+modalType.slice(1)}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {modalType === 'member' && <>
                <input type="text" placeholder="Full Name" value={memberForm.name} onChange={e=>setMemberForm({...memberForm,name:e.target.value})} className={inp} required />
                <input type="tel" placeholder="Phone Number" value={memberForm.phone} onChange={e=>setMemberForm({...memberForm,phone:e.target.value})} className={inp} />
                <input type="text" placeholder="Full Address" value={memberForm.address} onChange={e=>setMemberForm({...memberForm,address:e.target.value})} className={inp} />
                <input type="text" placeholder="Residence (City/Town)" value={memberForm.residence} onChange={e=>setMemberForm({...memberForm,residence:e.target.value})} className={inp} required />
                <input type="text" placeholder="Ministry/Department" value={memberForm.ministry} onChange={e=>setMemberForm({...memberForm,ministry:e.target.value})} className={inp} />
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label><input type="date" value={memberForm.joinDate||''} onChange={e=>setMemberForm({...memberForm,joinDate:e.target.value})} className={inp} required /></div>
                <select value={memberForm.status} onChange={e=>setMemberForm({...memberForm,status:e.target.value})} className={inp}><option>Active</option><option>Inactive</option></select>
              </>}
              {modalType === 'event' && <>
                <input type="text" placeholder="Event Title" value={eventForm.title} onChange={e=>setEventForm({...eventForm,title:e.target.value})} className={inp} required />
                <input type="date" value={eventForm.date} onChange={e=>setEventForm({...eventForm,date:e.target.value})} className={inp} required />
                <input type="time" value={eventForm.time} onChange={e=>setEventForm({...eventForm,time:e.target.value})} className={inp} required />
                <input type="text" placeholder="Location" value={eventForm.location} onChange={e=>setEventForm({...eventForm,location:e.target.value})} className={inp} required />
                <textarea placeholder="Description" value={eventForm.description} onChange={e=>setEventForm({...eventForm,description:e.target.value})} className={inp} rows={3} />
                <select value={eventForm.type} onChange={e=>setEventForm({...eventForm,type:e.target.value})} className={inp}><option>Service</option><option>Study</option><option>Fellowship</option><option>Outreach</option><option>Meeting</option></select>
              </>}
              {modalType === 'tithe' && <>
                <select value={titheForm.donor} onChange={e=>setTitheForm({...titheForm,donor:e.target.value})} className={inp} required><option value="">Select Member</option>{members.map(m=><option key={m.id} value={m.name}>{m.name}</option>)}</select>
                <input type="number" placeholder="Amount (GH₵)" step="0.01" value={titheForm.amount} onChange={e=>setTitheForm({...titheForm,amount:e.target.value})} className={inp} required />
                <input type="date" value={titheForm.date} onChange={e=>setTitheForm({...titheForm,date:e.target.value})} className={inp} required />
                <select value={titheForm.method} onChange={e=>setTitheForm({...titheForm,method:e.target.value})} className={inp}><option>Cash</option><option>Check</option><option>Credit Card</option><option>Online</option><option>Mobile Money</option></select>
              </>}
              {modalType === 'communication' && <>
                <input type="text" placeholder="Title" value={communicationForm.title} onChange={e=>setCommunicationForm({...communicationForm,title:e.target.value})} className={inp} required />
                <textarea placeholder="Message Content" value={communicationForm.content} onChange={e=>setCommunicationForm({...communicationForm,content:e.target.value})} className={inp} rows={4} required />
                <select value={communicationForm.type} onChange={e=>setCommunicationForm({...communicationForm,type:e.target.value})} className={inp}><option>Newsletter</option><option>Announcement</option><option>Prayer Request</option><option>Event Invite</option></select>
                <select value={communicationForm.recipients} onChange={e=>setCommunicationForm({...communicationForm,recipients:e.target.value})} className={inp}><option>All Members</option><option>Leadership</option><option>Youth Group</option><option>Ministry Teams</option></select>
              </>}
              {modalType === 'weeklySheet' && <>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Sunday Date</label>
                  <select value={weeklyForm.date} onChange={e=>setWeeklyForm({...weeklyForm,date:e.target.value})} className={inp} required>
                    <option value="">Select Sunday…</option>
                    {SUNDAYS.map(s=><option key={s} value={s}>{new Date(s+'T00:00:00').toLocaleDateString('en-GH',{weekday:'long',day:'2-digit',month:'long',year:'numeric'})}</option>)}
                  </select>
                </div>
                {[{k:'tithes',l:'Tithes'},{k:'dues',l:'Dues'},{k:'funeral',l:'Funeral Contributions'},{k:'sundaySchool',l:'Sunday School Offering'},{k:'bookSales',l:'Book Sales'}].map(f=>(
                  <div key={f.k}><label className="block text-sm font-medium text-gray-700 mb-1">{f.l} (GH₵)</label><input type="number" step="0.01" min="0" placeholder="0.00" value={(weeklyForm as any)[f.k]} onChange={e=>setWeeklyForm({...weeklyForm,[f.k]:e.target.value})} className={inp} /></div>
                ))}
              </>}
              {modalType === 'expenditure' && <>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Date</label><input type="date" value={expForm.date} onChange={e=>setExpForm({...expForm,date:e.target.value})} className={inp} required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><input type="text" placeholder="What was the expenditure for?" value={expForm.description} onChange={e=>setExpForm({...expForm,description:e.target.value})} className={inp} required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Amount (GH₵)</label><input type="number" step="0.01" min="0" placeholder="0.00" value={expForm.amount} onChange={e=>setExpForm({...expForm,amount:e.target.value})} className={inp} required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={expForm.category} onChange={e=>setExpForm({...expForm,category:e.target.value})} className={inp}><option>General</option><option>Utilities</option><option>Maintenance</option><option>Welfare</option><option>Missions</option><option>Stationery</option><option>Transport</option><option>Other</option></select>
                </div>
              </>}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={closeModal} className="px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 font-medium">Cancel</button>
                <button type="submit" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-semibold shadow-md">{editingItem?'Update':'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChurchManagementSystem;
