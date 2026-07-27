'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, BarChart3, Mail, FolderHeart, Users, FileQuestion, LayoutDashboard, 
  LogOut, Plus, Trash2, Edit3, Download, RefreshCw, Send, CheckCircle2, ChevronRight, Briefcase,
  Loader2
} from 'lucide-react';
import Card from '@/components/ui/primitives/Card';
import { API_BASE_URL } from '@/config';

interface AnalyticsData {
  summary: {
    totalLeads: number;
    leadsByStatus: {
      new: number;
      contacted: number;
      inProgress: number;
      closed: number;
    };
    totalSubscribers: number;
    totalProjects: number;
    totalTeam: number;
    totalBlogs: number;
  };
  charts: {
    dailyLeads: Array<{ day: string; count: number }>;
    projectDistribution: Array<{ name: string; value: number }>;
    trafficStats: Array<{ month: string; visits: number; bounceRate: string }>;
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [adminUser, setAdminUser] = useState<any>(null);
  
  // Dashboard navigation tab
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'subscribers' | 'portfolio' | 'team' | 'services' | 'faqs' | 'blogs'>('overview');
  
  // Dynamic API states
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [leadsList, setLeadsList] = useState<any[]>([]);
  const [subscribersList, setSubscribersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // CMS entity lists
  const [cmsProjects, setCmsProjects] = useState<any[]>([]);
  const [cmsTeam, setCmsTeam] = useState<any[]>([]);
  const [cmsServices, setCmsServices] = useState<any[]>([]);
  const [cmsFaqs, setCmsFaqs] = useState<any[]>([]);
  const [cmsBlogs, setCmsBlogs] = useState<any[]>([]);

  // CMS form states (for adding/updating)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // 1. Generic project form states
  const [projForm, setProjForm] = useState({
    title: '', description: '', category: 'Web Apps', technology: '', client: '', duration: '', github: '', liveDemo: ''
  });

  // 2. Generic team form states
  const [teamForm, setTeamForm] = useState({
    name: '', role: '', bio: '', experience: '', github: '', linkedin: '', twitter: ''
  });

  // 3. Generic service form states
  const [serviceForm, setServiceForm] = useState({
    name: '', description: '', iconName: 'Layout', features: ''
  });

  // 4. Generic FAQ form
  const [faqForm, setFaqForm] = useState({
    question: '', answer: '', order: 0
  });

  // 5. Generic blog form
  const [blogForm, setBlogForm] = useState({
    title: '', excerpt: '', content: '', author: '', readTime: '', tags: ''
  });

  // Token verify hook
  useEffect(() => {
    const localToken = localStorage.getItem('vortex_admin_token');
    const localUser = localStorage.getItem('vortex_admin_user');
    
    if (!localToken) {
      router.push('/admin');
    } else {
      setToken(localToken);
      if (localUser) setAdminUser(JSON.parse(localUser));
    }
  }, [router]);

  // Load dashboard metrics
  const loadDashboardData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      // Load Analytics
      const resAnal = await fetch(`${API_BASE_URL}/api/analytics`, { headers });
      const dataAnal = await resAnal.json();
      if (dataAnal.success) setAnalytics(dataAnal.data);

      // Load Leads
      const resLeads = await fetch(`${API_BASE_URL}/api/cms/leads`, { headers });
      const dataLeads = await resLeads.json();
      if (dataLeads.success) setLeadsList(dataLeads.data);

      // Load Subs
      const resSubs = await fetch(`${API_BASE_URL}/api/cms/subscribers`, { headers });
      const dataSubs = await resSubs.json();
      if (dataSubs.success) setSubscribersList(dataSubs.data);

      // Load static entities for CMS tab use
      const resProj = await fetch(`${API_BASE_URL}/api/public/portfolio`);
      const dataProj = await resProj.json();
      if (dataProj.success) setCmsProjects(dataProj.data);

      const resTeam = await fetch(`${API_BASE_URL}/api/public/team`);
      const dataTeam = await resTeam.json();
      if (dataTeam.success) setCmsTeam(dataTeam.data);

      const resSvc = await fetch(`${API_BASE_URL}/api/public/services`);
      const dataSvc = await resSvc.json();
      if (dataSvc.success) setCmsServices(dataSvc.data);

      const resFaqs = await fetch(`${API_BASE_URL}/api/public/faqs`);
      const dataFaqs = await resFaqs.json();
      if (dataFaqs.success) setCmsFaqs(dataFaqs.data);

      const resBlogs = await fetch(`${API_BASE_URL}/api/public/blogs`);
      const dataBlogs = await resBlogs.json();
      if (dataBlogs.success) setCmsBlogs(dataBlogs.data);

    } catch (err) {
      console.error('Error fetching CMS details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadDashboardData();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('vortex_admin_token');
    localStorage.removeItem('vortex_admin_user');
    router.push('/admin');
  };

  // Lead update pipeline status
  const updateLeadStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/cms/leads/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setLeadsList(prev => prev.map(l => l._id === id ? { ...l, status: newStatus } : l));
        loadDashboardData(); // Refresh summary totals
      }
    } catch (err) {
      alert('Failed to update lead status');
    }
  };

  // Lead deletion
  const deleteLead = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      await fetch(`${API_BASE_URL}/api/cms/leads/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeadsList(prev => prev.filter(l => l._id !== id));
      loadDashboardData();
    } catch (err) {
      alert('Delete failed.');
    }
  };

  // Subscriber Deletion
  const deleteSubscriber = async (id: string) => {
    if (!confirm('Are you sure you want to remove this subscriber?')) return;
    try {
      await fetch(`${API_BASE_URL}/api/cms/subscribers/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubscribersList(prev => prev.filter(s => s._id !== id));
      loadDashboardData();
    } catch (err) {
      alert('Delete failed.');
    }
  };

  // Export Leads to CSV
  const handleCSVExport = () => {
    window.open(`${API_BASE_URL}/api/cms/leads/export?token=${token}`, '_blank');
  };

  // Generic Deletion for CMS Tiers
  const handleCMSDelete = async (entity: string, id: string) => {
    if (!confirm(`Delete this item from ${entity}?`)) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/cms/${entity}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        loadDashboardData();
      }
    } catch (err) {
      alert('Failed to delete item.');
    }
  };

  // Generic Create / Update Submission for CMS elements
  const handleCMSSubmit = async (entity: string, bodyObj: any) => {
    try {
      const isEdit = !!editingId;
      const url = `${API_BASE_URL}/api/cms/${entity}${isEdit ? `/${editingId}` : ''}`;
      const method = isEdit ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(bodyObj),
      });

      const data = await res.json();
      if (data.success) {
        setShowAddForm(false);
        setEditingId(null);
        loadDashboardData();
      } else {
        alert(data.error || 'Operation failed');
      }
    } catch (err) {
      alert('Network request error.');
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex text-ink select-none">
      
      {/* 1. Sidebar Panel */}
      <aside className="w-[260px] bg-surface border-r border-line flex flex-col justify-between p-6 shrink-0 hidden md:flex">
        <div className="flex flex-col gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-accent rounded-full" />
            <span className="font-display text-lg font-bold tracking-wider">PINAKI PANEL</span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2 font-display text-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left cursor-pointer transition-colors ${
                activeTab === 'overview' ? 'bg-accent-soft border border-accent-line text-accent' : 'hover:bg-surface-hover text-ink-muted'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Metrics Dashboard
            </button>

            <button
              onClick={() => setActiveTab('leads')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left cursor-pointer transition-colors ${
                activeTab === 'leads' ? 'bg-accent-soft border border-accent-line text-accent' : 'hover:bg-surface-hover text-ink-muted'
              }`}
            >
              <Mail className="w-4 h-4" />
              Manage Leads ({leadsList.length})
            </button>

            <button
              onClick={() => setActiveTab('subscribers')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left cursor-pointer transition-colors ${
                activeTab === 'subscribers' ? 'bg-accent-soft border border-accent-line text-accent' : 'hover:bg-surface-hover text-ink-muted'
              }`}
            >
              <Users className="w-4 h-4" />
              Subscribers ({subscribersList.length})
            </button>

            <div className="border-t border-line my-4" />
            <span className="text-[9px] font-mono text-ink-subtle px-4 uppercase tracking-widest mb-1">CMS Models</span>

            <button
              onClick={() => { setActiveTab('portfolio'); setShowAddForm(false); setEditingId(null); }}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl w-full text-left cursor-pointer transition-colors ${
                activeTab === 'portfolio' ? 'bg-surface-hover text-ink' : 'hover:bg-surface-hover text-ink-muted'
              }`}
            >
              <FolderHeart className="w-4 h-4" />
              Portfolio CMS
            </button>

            <button
              onClick={() => { setActiveTab('team'); setShowAddForm(false); setEditingId(null); }}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl w-full text-left cursor-pointer transition-colors ${
                activeTab === 'team' ? 'bg-surface-hover text-ink' : 'hover:bg-surface-hover text-ink-muted'
              }`}
            >
              <Users className="w-4 h-4" />
              Team CMS
            </button>

            <button
              onClick={() => { setActiveTab('services'); setShowAddForm(false); setEditingId(null); }}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl w-full text-left cursor-pointer transition-colors ${
                activeTab === 'services' ? 'bg-surface-hover text-ink' : 'hover:bg-surface-hover text-ink-muted'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Services CMS
            </button>

            <button
              onClick={() => { setActiveTab('faqs'); setShowAddForm(false); setEditingId(null); }}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl w-full text-left cursor-pointer transition-colors ${
                activeTab === 'faqs' ? 'bg-surface-hover text-ink' : 'hover:bg-surface-hover text-ink-muted'
              }`}
            >
              <FileQuestion className="w-4 h-4" />
              FAQs CMS
            </button>

            <button
              onClick={() => { setActiveTab('blogs'); setShowAddForm(false); setEditingId(null); }}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl w-full text-left cursor-pointer transition-colors ${
                activeTab === 'blogs' ? 'bg-surface-hover text-ink' : 'hover:bg-surface-hover text-ink-muted'
              }`}
            >
              <Send className="w-4 h-4" />
              Blogs CMS
            </button>
          </nav>
        </div>

        {/* User profile & logout */}
        <div className="flex flex-col gap-4 pt-4 border-t border-line">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent-soft border border-accent-line flex items-center justify-center text-xs font-mono font-bold text-accent">
              {adminUser?.username?.substring(0, 2).toUpperCase() || 'AD'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-display font-medium text-ink truncate">{adminUser?.username || 'Admin'}</span>
              <span className="text-[9px] font-mono text-accent uppercase truncate">ROLE // {adminUser?.role || 'ADMIN'}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 font-display text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-ink transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout Session
          </button>
        </div>
      </aside>

      {/* 2. Main Console Content Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 relative">
        {/* Glow backdrop */}
        <div className="absolute top-[10%] right-[10%] w-[350px] h-[350px] rounded-full bg-accent-soft blur-[120px] pointer-events-none" />

        {/* Header toolbar */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-line">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-ink tracking-tight uppercase flex items-center gap-2">
              <ShieldCheck className="w-7 h-7 text-accent animate-pulse" />
              Console // {activeTab}
            </h1>
            <p className="font-mono text-[9px] tracking-widest text-ink-subtle uppercase mt-1">
              SYSTEM REVALIDATED ONCE PER MINUTE
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadDashboardData}
              className="p-3 border border-line rounded-xl bg-surface text-ink-muted hover:text-ink hover:border-accent transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </header>

        {loading ? (
          <div className="h-[50vh] flex flex-col justify-center items-center font-mono text-xs text-accent tracking-widest">
            <Loader2 className="w-8 h-8 animate-spin mb-4" />
            ESTABLISHING PORTAL FEED_
          </div>
        ) : (
          <>
            {/* TABS 1: METRICS OVERVIEW */}
            {activeTab === 'overview' && analytics && (
              <div className="flex flex-col gap-10">
                {/* 4 Summary Stats widgets */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <span className="block text-[9px] font-mono text-ink-subtle uppercase tracking-widest">Total Inquiries</span>
                    <span className="block text-4xl font-display font-bold text-accent mt-2">{analytics.summary.totalLeads}</span>
                    <span className="block text-[9px] font-mono text-green-400 mt-2">New: {analytics.summary.leadsByStatus.new}</span>
                  </Card>

                  <Card>
                    <span className="block text-[9px] font-mono text-ink-subtle uppercase tracking-widest">Subscribers</span>
                    <span className="block text-4xl font-display font-bold text-accent mt-2">{analytics.summary.totalSubscribers}</span>
                    <span className="block text-[9px] font-mono text-ink-subtle mt-2">Newsletter Active</span>
                  </Card>

                  <Card>
                    <span className="block text-[9px] font-mono text-ink-subtle uppercase tracking-widest">Showcases</span>
                    <span className="block text-4xl font-display font-bold text-ink mt-2">{analytics.summary.totalProjects}</span>
                    <span className="block text-[9px] font-mono text-ink-subtle mt-2">Portfolio items</span>
                  </Card>

                  <Card>
                    <span className="block text-[9px] font-mono text-ink-subtle uppercase tracking-widest">Active Team</span>
                    <span className="block text-4xl font-display font-bold text-green-400 mt-2">{analytics.summary.totalTeam}</span>
                    <span className="block text-[9px] font-mono text-ink-subtle mt-2">Full partners</span>
                  </Card>
                </div>

                {/* Simulated Chart vectors */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Daily Leads Chart */}
                  <div className="lg:col-span-8 rounded-2xl border border-line bg-surface p-6 flex flex-col gap-6">
                    <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-accent flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" /> Inquiries Last 7 Days
                    </h3>
                    {/* SVG/Bar visual chart */}
                    <div className="h-[220px] flex items-end justify-between px-4 pb-2 border-b border-line relative">
                      {analytics.charts.dailyLeads.map((day) => {
                        // Max value calculation for scaling (assume max is 10)
                        const heightPct = Math.min((day.count / 10) * 100, 100);
                        return (
                          <div key={day.day} className="flex flex-col items-center gap-3 flex-1">
                            <div className="relative w-8 bg-accent-soft border border-accent-line rounded-t-md hover:bg-accent transition-all flex items-end justify-center" style={{ height: `${Math.max(heightPct, 15)}px` }}>
                              <span className="font-mono text-[9px] text-ink mb-1.5">{day.count}</span>
                            </div>
                            <span className="font-mono text-[9px] text-ink-subtle">{day.day}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Distribution breakdown */}
                  <div className="lg:col-span-4 rounded-2xl border border-line bg-surface p-6 flex flex-col gap-6">
                    <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-accent">
                      Scopes Distribution
                    </h3>
                    <div className="flex flex-col gap-4 mt-2">
                      {analytics.charts.projectDistribution.map((item) => (
                        <div key={item.name} className="flex flex-col gap-1">
                          <div className="flex justify-between font-mono text-[9px] text-ink-muted uppercase">
                            <span>{item.name}</span>
                            <span>{item.value} count</span>
                          </div>
                          <div className="w-full h-1.5 bg-surface-hover rounded-full overflow-hidden">
                            <div className="h-full bg-accent" style={{ width: `${Math.min((item.value / 12) * 100, 100)}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Mini leads queue */}
                <div className="rounded-2xl border border-line bg-surface p-6">
                  <h3 className="font-display text-xs font-semibold uppercase tracking-wider mb-6">Recent Contact Feed</h3>
                  <div className="flex flex-col gap-3">
                    {leadsList.slice(0, 3).map((lead) => (
                      <div key={lead._id} className="flex items-center justify-between p-4 border border-line rounded-xl hover:bg-surface-hover transition-colors">
                        <div className="flex flex-col">
                          <span className="font-display text-xs font-semibold text-ink">{lead.name}</span>
                          <span className="font-mono text-[9px] text-accent uppercase tracking-widest">{lead.projectType} // {lead.budget}</span>
                        </div>
                        <span className={`text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                          lead.status === 'New' ? 'border-accent-line bg-accent-soft text-accent' : 'border-line text-ink-subtle'
                        }`}>
                          {lead.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TABS 2: LEADS QUEUE MANAGEMENT */}
            {activeTab === 'leads' && (
              <div className="rounded-2xl border border-line bg-surface p-6 flex flex-col gap-6">
                <div className="flex justify-between items-center pb-4 border-b border-line">
                  <h3 className="font-display text-sm font-semibold uppercase tracking-wider">
                    Inquiries Pipeline ({leadsList.length})
                  </h3>
                  
                  <button
                    onClick={handleCSVExport}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-accent-line bg-accent-soft hover:bg-accent text-accent-ink font-display text-[10px] uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export leads CSV
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-line font-mono text-[9px] text-ink-subtle uppercase tracking-widest">
                        <th className="pb-4 font-normal">Contact / Co</th>
                        <th className="pb-4 font-normal">Project Scope</th>
                        <th className="pb-4 font-normal">Budget Tier</th>
                        <th className="pb-4 font-normal">Pipeline Status</th>
                        <th className="pb-4 font-normal">Files</th>
                        <th className="pb-4 font-normal text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {leadsList.map((lead) => (
                        <tr key={lead._id} className="hover:bg-surface-hover transition-colors">
                          <td className="py-4 pr-4">
                            <span className="block font-display text-xs font-semibold text-ink">{lead.name}</span>
                            <span className="block text-[10px] text-ink-subtle">{lead.email}</span>
                            {lead.phone && <span className="block text-[9px] text-ink-subtle font-mono mt-0.5">{lead.phone}</span>}
                          </td>
                          <td className="py-4 pr-4">
                            <span className="font-mono text-[10px] text-accent bg-accent-soft border border-accent-line px-2 py-0.5 rounded">{lead.projectType}</span>
                          </td>
                          <td className="py-4 pr-4 font-mono text-xs text-ink">{lead.budget}</td>
                          <td className="py-4 pr-4">
                            <select
                              value={lead.status}
                              onChange={(e) => updateLeadStatus(lead._id, e.target.value)}
                              className="bg-canvas border border-line rounded-lg py-1.5 px-2.5 text-[10px] font-mono text-ink focus:outline-none focus:border-accent"
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Closed">Closed</option>
                            </select>
                          </td>
                          <td className="py-4 pr-4">
                            {lead.fileAttachment ? (
                              <a
                                href={`${API_BASE_URL}${lead.fileAttachment}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] font-mono text-accent hover:underline"
                              >
                                View File
                              </a>
                            ) : (
                              <span className="text-[10px] font-mono text-ink-subtle">None</span>
                            )}
                          </td>
                          <td className="py-4 text-right">
                            <button
                              onClick={() => deleteLead(lead._id)}
                              className="text-red-400 hover:text-red-300 p-1 border border-line rounded hover:bg-red-500/10 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {leadsList.length === 0 && (
                    <div className="py-12 text-center font-mono text-ink-subtle text-xs">
                      [ INQUIRY QUEUE EMPTY ]
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TABS 3: NEWSLETTER SUBSCRIBERS */}
            {activeTab === 'subscribers' && (
              <div className="rounded-2xl border border-line bg-surface p-6 flex flex-col gap-6">
                <h3 className="font-display text-sm font-semibold uppercase tracking-wider pb-4 border-b border-line">
                  Subscribed Nodes ({subscribersList.length})
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-line font-mono text-[9px] text-ink-subtle uppercase tracking-widest">
                        <th className="pb-4 font-normal">Subscriber Email</th>
                        <th className="pb-4 font-normal">Date Enrolled</th>
                        <th className="pb-4 font-normal text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {subscribersList.map((sub) => (
                        <tr key={sub._id} className="hover:bg-surface-hover transition-colors">
                          <td className="py-4 font-display text-xs font-semibold text-ink">{sub.email}</td>
                          <td className="py-4 font-mono text-xs text-ink-subtle">{new Date(sub.createdAt).toLocaleDateString()}</td>
                          <td className="py-4 text-right">
                            <button
                              onClick={() => deleteSubscriber(sub._id)}
                              className="text-red-400 hover:text-red-300 p-1 border border-line rounded hover:bg-red-500/10 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {subscribersList.length === 0 && (
                    <div className="py-12 text-center font-mono text-ink-subtle text-xs">
                      [ NO SUBSCRIBERS IN DATABASE ]
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TABS 4: CMS VIEWS (Portfolio, Team, Services, FAQs, Blogs) */}
            {['portfolio', 'team', 'services', 'faqs', 'blogs'].includes(activeTab) && (
              <div className="flex flex-col gap-8">
                
                {/* CMS List Header */}
                <div className="flex justify-between items-center">
                  <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-ink-muted">
                    Active {activeTab} instances
                  </h3>
                  
                  {!showAddForm && (
                    <button
                      onClick={() => {
                        setShowAddForm(true);
                        setEditingId(null);
                        // Reset forms
                        setProjForm({ title: '', description: '', category: 'Web Apps', technology: '', client: '', duration: '', github: '', liveDemo: '' });
                        setTeamForm({ name: '', role: '', bio: '', experience: '', github: '', linkedin: '', twitter: '' });
                        setServiceForm({ name: '', description: '', iconName: 'Layout', features: '' });
                        setFaqForm({ question: '', answer: '', order: 0 });
                        setBlogForm({ title: '', excerpt: '', content: '', author: '', readTime: '', tags: '' });
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-accent text-accent-ink font-display text-[10px] uppercase tracking-widest transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Create New Entry
                    </button>
                  )}
                </div>

                {/* Forms overlays */}
                {showAddForm && (
                  <div className="rounded-xl p-6 border border-line bg-surface">
                    <h4 className="font-display text-xs font-bold uppercase tracking-widest text-accent mb-6">
                      {editingId ? 'Modify / Save Details' : 'Create New Database Object'}
                    </h4>

                    {/* PORTFOLIO FORM */}
                    {activeTab === 'portfolio' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1">
                          <label className="font-mono text-[9px] text-ink-subtle">Project Title</label>
                          <input type="text" value={projForm.title} onChange={(e) => setProjForm({...projForm, title: e.target.value})} className="bg-canvas border border-line rounded-xl p-3 text-xs text-ink" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-mono text-[9px] text-ink-subtle">Category</label>
                          <select value={projForm.category} onChange={(e) => setProjForm({...projForm, category: e.target.value})} className="bg-canvas border border-line rounded-xl p-3 text-xs text-ink">
                            <option value="Web Apps">Web Apps</option>
                            <option value="AI Projects">AI Projects</option>
                            <option value="ML Projects">ML Projects</option>
                            <option value="Business Websites">Business Websites</option>
                            <option value="Mobile Apps">Mobile Apps</option>
                            <option value="Dashboards">Dashboards</option>
                            <option value="Admin Panels">Admin Panels</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1 md:col-span-2">
                          <label className="font-mono text-[9px] text-ink-subtle">Project Description</label>
                          <textarea value={projForm.description} onChange={(e) => setProjForm({...projForm, description: e.target.value})} rows={3} className="bg-canvas border border-line rounded-xl p-3 text-xs text-ink resize-none" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-mono text-[9px] text-ink-subtle">Technologies (comma separated)</label>
                          <input type="text" value={projForm.technology} onChange={(e) => setProjForm({...projForm, technology: e.target.value})} placeholder="Next.js, React, Express" className="bg-canvas border border-line rounded-xl p-3 text-xs text-ink" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-mono text-[9px] text-ink-subtle">Client Name</label>
                          <input type="text" value={projForm.client} onChange={(e) => setProjForm({...projForm, client: e.target.value})} className="bg-canvas border border-line rounded-xl p-3 text-xs text-ink" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-mono text-[9px] text-ink-subtle">Duration (e.g. 2 Months)</label>
                          <input type="text" value={projForm.duration} onChange={(e) => setProjForm({...projForm, duration: e.target.value})} className="bg-canvas border border-line rounded-xl p-3 text-xs text-ink" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-mono text-[9px] text-ink-subtle">GitHub URL</label>
                          <input type="text" value={projForm.github} onChange={(e) => setProjForm({...projForm, github: e.target.value})} className="bg-canvas border border-line rounded-xl p-3 text-xs text-ink" />
                        </div>
                        <div className="flex flex-col gap-1 md:col-span-2">
                          <label className="font-mono text-[9px] text-ink-subtle">Live Demo Link</label>
                          <input type="text" value={projForm.liveDemo} onChange={(e) => setProjForm({...projForm, liveDemo: e.target.value})} className="bg-canvas border border-line rounded-xl p-3 text-xs text-ink" />
                        </div>
                        
                        <div className="md:col-span-2 flex gap-4 mt-4">
                          <button onClick={() => handleCMSSubmit('portfolio', { ...projForm, technology: projForm.technology.split(',').map(s=>s.trim()) })} className="px-5 py-3 bg-accent text-accent-ink text-xs uppercase tracking-widest font-mono rounded-xl cursor-pointer">Save Object</button>
                          <button onClick={() => setShowAddForm(false)} className="px-5 py-3 border border-line text-ink-muted text-xs uppercase tracking-widest font-mono rounded-xl cursor-pointer">Cancel</button>
                        </div>
                      </div>
                    )}

                    {/* TEAM FORM */}
                    {activeTab === 'team' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1">
                          <label className="font-mono text-[9px] text-ink-subtle">Name</label>
                          <input type="text" value={teamForm.name} onChange={(e) => setTeamForm({...teamForm, name: e.target.value})} className="bg-canvas border border-line rounded-xl p-3 text-xs text-ink" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-mono text-[9px] text-ink-subtle">Role</label>
                          <input type="text" value={teamForm.role} onChange={(e) => setTeamForm({...teamForm, role: e.target.value})} className="bg-canvas border border-line rounded-xl p-3 text-xs text-ink" />
                        </div>
                        <div className="flex flex-col gap-1 md:col-span-2">
                          <label className="font-mono text-[9px] text-ink-subtle">Biography</label>
                          <textarea value={teamForm.bio} onChange={(e) => setTeamForm({...teamForm, bio: e.target.value})} rows={3} className="bg-canvas border border-line rounded-xl p-3 text-xs text-ink resize-none" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-mono text-[9px] text-ink-subtle">Experience (e.g. 5+ Years)</label>
                          <input type="text" value={teamForm.experience} onChange={(e) => setTeamForm({...teamForm, experience: e.target.value})} className="bg-canvas border border-line rounded-xl p-3 text-xs text-ink" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-mono text-[9px] text-ink-subtle">GitHub link</label>
                          <input type="text" value={teamForm.github} onChange={(e) => setTeamForm({...teamForm, github: e.target.value})} className="bg-canvas border border-line rounded-xl p-3 text-xs text-ink" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-mono text-[9px] text-ink-subtle">LinkedIn link</label>
                          <input type="text" value={teamForm.linkedin} onChange={(e) => setTeamForm({...teamForm, linkedin: e.target.value})} className="bg-canvas border border-line rounded-xl p-3 text-xs text-ink" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-mono text-[9px] text-ink-subtle">Twitter link</label>
                          <input type="text" value={teamForm.twitter} onChange={(e) => setTeamForm({...teamForm, twitter: e.target.value})} className="bg-canvas border border-line rounded-xl p-3 text-xs text-ink" />
                        </div>
                        
                        <div className="md:col-span-2 flex gap-4 mt-4">
                          <button onClick={() => handleCMSSubmit('team', { ...teamForm, socialLinks: { github: teamForm.github, linkedin: teamForm.linkedin, twitter: teamForm.twitter }, skills: [{name: 'Full Stack Dev', level: 90}] })} className="px-5 py-3 bg-accent text-accent-ink text-xs uppercase tracking-widest font-mono rounded-xl cursor-pointer">Save Object</button>
                          <button onClick={() => setShowAddForm(false)} className="px-5 py-3 border border-line text-ink-muted text-xs uppercase tracking-widest font-mono rounded-xl cursor-pointer">Cancel</button>
                        </div>
                      </div>
                    )}

                    {/* SERVICES FORM */}
                    {activeTab === 'services' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1">
                          <label className="font-mono text-[9px] text-ink-subtle">Service Name</label>
                          <input type="text" value={serviceForm.name} onChange={(e) => setServiceForm({...serviceForm, name: e.target.value})} className="bg-canvas border border-line rounded-xl p-3 text-xs text-ink" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-mono text-[9px] text-ink-subtle">Icon Component (e.g. Layout, Brain)</label>
                          <input type="text" value={serviceForm.iconName} onChange={(e) => setServiceForm({...serviceForm, iconName: e.target.value})} className="bg-canvas border border-line rounded-xl p-3 text-xs text-ink" />
                        </div>
                        <div className="flex flex-col gap-1 md:col-span-2">
                          <label className="font-mono text-[9px] text-ink-subtle">Description</label>
                          <textarea value={serviceForm.description} onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})} rows={3} className="bg-canvas border border-line rounded-xl p-3 text-xs text-ink resize-none" />
                        </div>
                        <div className="flex flex-col gap-1 md:col-span-2">
                          <label className="font-mono text-[9px] text-ink-subtle">Key Features (comma separated)</label>
                          <input type="text" value={serviceForm.features} onChange={(e) => setServiceForm({...serviceForm, features: e.target.value})} placeholder="SEO Friendly, Secure, AWS ready" className="bg-canvas border border-line rounded-xl p-3 text-xs text-ink" />
                        </div>
                        
                        <div className="md:col-span-2 flex gap-4 mt-4">
                          <button onClick={() => handleCMSSubmit('services', { ...serviceForm, features: serviceForm.features.split(',').map(s=>s.trim()) })} className="px-5 py-3 bg-accent text-accent-ink text-xs uppercase tracking-widest font-mono rounded-xl cursor-pointer">Save Object</button>
                          <button onClick={() => setShowAddForm(false)} className="px-5 py-3 border border-line text-ink-muted text-xs uppercase tracking-widest font-mono rounded-xl cursor-pointer">Cancel</button>
                        </div>
                      </div>
                    )}

                    {/* FAQs FORM */}
                    {activeTab === 'faqs' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1 md:col-span-2">
                          <label className="font-mono text-[9px] text-ink-subtle">Question</label>
                          <input type="text" value={faqForm.question} onChange={(e) => setFaqForm({...faqForm, question: e.target.value})} className="bg-canvas border border-line rounded-xl p-3 text-xs text-ink" />
                        </div>
                        <div className="flex flex-col gap-1 md:col-span-2">
                          <label className="font-mono text-[9px] text-ink-subtle">Answer</label>
                          <textarea value={faqForm.answer} onChange={(e) => setFaqForm({...faqForm, answer: e.target.value})} rows={3} className="bg-canvas border border-line rounded-xl p-3 text-xs text-ink resize-none" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-mono text-[9px] text-ink-subtle">Order (Numerical sorting)</label>
                          <input type="number" value={faqForm.order} onChange={(e) => setFaqForm({...faqForm, order: parseInt(e.target.value) || 0})} className="bg-canvas border border-line rounded-xl p-3 text-xs text-ink" />
                        </div>
                        
                        <div className="md:col-span-2 flex gap-4 mt-4">
                          <button onClick={() => handleCMSSubmit('faqs', faqForm)} className="px-5 py-3 bg-accent text-accent-ink text-xs uppercase tracking-widest font-mono rounded-xl cursor-pointer">Save Object</button>
                          <button onClick={() => setShowAddForm(false)} className="px-5 py-3 border border-line text-ink-muted text-xs uppercase tracking-widest font-mono rounded-xl cursor-pointer">Cancel</button>
                        </div>
                      </div>
                    )}

                    {/* BLOGS FORM */}
                    {activeTab === 'blogs' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1 md:col-span-2">
                          <label className="font-mono text-[9px] text-ink-subtle">Title</label>
                          <input type="text" value={blogForm.title} onChange={(e) => setBlogForm({...blogForm, title: e.target.value})} className="bg-canvas border border-line rounded-xl p-3 text-xs text-ink" />
                        </div>
                        <div className="flex flex-col gap-1 md:col-span-2">
                          <label className="font-mono text-[9px] text-ink-subtle">Excerpt</label>
                          <input type="text" value={blogForm.excerpt} onChange={(e) => setBlogForm({...blogForm, excerpt: e.target.value})} className="bg-canvas border border-line rounded-xl p-3 text-xs text-ink" />
                        </div>
                        <div className="flex flex-col gap-1 md:col-span-2">
                          <label className="font-mono text-[9px] text-ink-subtle">Content (Markdown body)</label>
                          <textarea value={blogForm.content} onChange={(e) => setBlogForm({...blogForm, content: e.target.value})} rows={6} className="bg-canvas border border-line rounded-xl p-3 text-xs text-ink resize-none" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-mono text-[9px] text-ink-subtle">Author Name</label>
                          <input type="text" value={blogForm.author} onChange={(e) => setBlogForm({...blogForm, author: e.target.value})} className="bg-canvas border border-line rounded-xl p-3 text-xs text-ink" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-mono text-[9px] text-ink-subtle">Read Time (e.g. 5 Min Read)</label>
                          <input type="text" value={blogForm.readTime} onChange={(e) => setBlogForm({...blogForm, readTime: e.target.value})} className="bg-canvas border border-line rounded-xl p-3 text-xs text-ink" />
                        </div>
                        <div className="flex flex-col gap-1 md:col-span-2">
                          <label className="font-mono text-[9px] text-ink-subtle">Tags (comma separated)</label>
                          <input type="text" value={blogForm.tags} onChange={(e) => setBlogForm({...blogForm, tags: e.target.value})} placeholder="Design, Web, Python" className="bg-canvas border border-line rounded-xl p-3 text-xs text-ink" />
                        </div>
                        
                        <div className="md:col-span-2 flex gap-4 mt-4">
                          <button onClick={() => handleCMSSubmit('blogs', { ...blogForm, tags: blogForm.tags.split(',').map(s=>s.trim()) })} className="px-5 py-3 bg-accent text-accent-ink text-xs uppercase tracking-widest font-mono rounded-xl cursor-pointer">Save Object</button>
                          <button onClick={() => setShowAddForm(false)} className="px-5 py-3 border border-line text-ink-muted text-xs uppercase tracking-widest font-mono rounded-xl cursor-pointer">Cancel</button>
                        </div>
                      </div>
                    )}

                  </div>
                )}

                {/* Active Lists display */}
                {!showAddForm && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Portfolio item loop */}
                    {activeTab === 'portfolio' && cmsProjects.map((p) => (
                      <Card key={p._id} className="flex flex-col justify-between h-[200px]">
                        <div>
                          <span className="text-[9px] font-mono text-accent uppercase">{p.category}</span>
                          <h4 className="font-display text-sm font-semibold text-ink truncate mt-1">{p.title}</h4>
                          <p className="text-[10px] text-ink-subtle line-clamp-2 mt-2 leading-relaxed">{p.description}</p>
                        </div>
                        <div className="flex gap-3 justify-end pt-4 border-t border-line">
                          <button
                            onClick={() => {
                              setEditingId(p._id);
                              setShowAddForm(true);
                              setProjForm({
                                title: p.title, description: p.description, category: p.category,
                                technology: p.technology?.join(', ') || '', client: p.client || '', duration: p.duration || '',
                                github: p.github || '', liveDemo: p.liveDemo || ''
                              });
                            }}
                            className="text-xs text-accent hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button onClick={() => handleCMSDelete('portfolio', p._id)} className="text-xs text-red-400 hover:underline flex items-center gap-1 cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </Card>
                    ))}

                    {/* Team items loop */}
                    {activeTab === 'team' && cmsTeam.map((m) => (
                      <Card key={m._id} className="flex flex-col justify-between h-[200px]">
                        <div>
                          <span className="text-[9px] font-mono text-accent uppercase">{m.experience} Experience</span>
                          <h4 className="font-display text-sm font-semibold text-ink mt-1">{m.name}</h4>
                          <p className="text-[10px] text-ink-subtle line-clamp-2 mt-2">{m.role}</p>
                        </div>
                        <div className="flex gap-3 justify-end pt-4 border-t border-line">
                          <button
                            onClick={() => {
                              setEditingId(m._id);
                              setShowAddForm(true);
                              setTeamForm({
                                name: m.name, role: m.role, bio: m.bio, experience: m.experience || '',
                                github: m.socialLinks?.github || '', linkedin: m.socialLinks?.linkedin || '', twitter: m.socialLinks?.twitter || ''
                              });
                            }}
                            className="text-xs text-accent hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button onClick={() => handleCMSDelete('team', m._id)} className="text-xs text-red-400 hover:underline flex items-center gap-1 cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </Card>
                    ))}

                    {/* Services loop */}
                    {activeTab === 'services' && cmsServices.map((s) => (
                      <Card key={s._id} className="flex flex-col justify-between h-[200px]">
                        <div>
                          <span className="text-[9px] font-mono text-accent uppercase">ICON // {s.iconName}</span>
                          <h4 className="font-display text-sm font-semibold text-ink mt-1">{s.name}</h4>
                          <p className="text-[10px] text-ink-subtle line-clamp-2 mt-2 leading-relaxed">{s.description}</p>
                        </div>
                        <div className="flex gap-3 justify-end pt-4 border-t border-line">
                          <button
                            onClick={() => {
                              setEditingId(s._id);
                              setShowAddForm(true);
                              setServiceForm({
                                name: s.name, description: s.description, iconName: s.iconName || 'Layout',
                                features: s.features?.join(', ') || ''
                              });
                            }}
                            className="text-xs text-accent hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button onClick={() => handleCMSDelete('services', s._id)} className="text-xs text-red-400 hover:underline flex items-center gap-1 cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </Card>
                    ))}

                    {/* FAQs loop */}
                    {activeTab === 'faqs' && cmsFaqs.map((f) => (
                      <Card key={f._id} className="flex flex-col justify-between h-[200px]">
                        <div>
                          <span className="text-[9px] font-mono text-accent uppercase">ORDER // {f.order}</span>
                          <h4 className="font-display text-sm font-semibold text-ink mt-1 line-clamp-2">{f.question}</h4>
                          <p className="text-[10px] text-ink-subtle line-clamp-2 mt-2 leading-relaxed">{f.answer}</p>
                        </div>
                        <div className="flex gap-3 justify-end pt-4 border-t border-line">
                          <button
                            onClick={() => {
                              setEditingId(f._id);
                              setShowAddForm(true);
                              setFaqForm({ question: f.question, answer: f.answer, order: f.order });
                            }}
                            className="text-xs text-accent hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button onClick={() => handleCMSDelete('faqs', f._id)} className="text-xs text-red-400 hover:underline flex items-center gap-1 cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </Card>
                    ))}

                    {/* Blogs loop */}
                    {activeTab === 'blogs' && cmsBlogs.map((b) => (
                      <Card key={b._id} className="flex flex-col justify-between h-[200px]">
                        <div>
                          <span className="text-[9px] font-mono text-accent uppercase">BY {b.author} // {b.readTime}</span>
                          <h4 className="font-display text-sm font-semibold text-ink mt-1 line-clamp-2">{b.title}</h4>
                          <p className="text-[10px] text-ink-subtle line-clamp-2 mt-2 leading-relaxed">{b.excerpt}</p>
                        </div>
                        <div className="flex gap-3 justify-end pt-4 border-t border-line">
                          <button
                            onClick={() => {
                              setEditingId(b._id);
                              setShowAddForm(true);
                              setBlogForm({
                                title: b.title, excerpt: b.excerpt, content: b.content,
                                author: b.author, readTime: b.readTime || '3 Min Read',
                                tags: b.tags?.join(', ') || ''
                              });
                            }}
                            className="text-xs text-accent hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button onClick={() => handleCMSDelete('blogs', b._id)} className="text-xs text-red-400 hover:underline flex items-center gap-1 cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
