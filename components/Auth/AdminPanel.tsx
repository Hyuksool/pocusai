
import React, { useState, useEffect } from 'react';
import { getUsers, updateStatus, deleteUser } from '../../services/authService';
import { getAnalytics } from '../../services/analyticsService';
import { User, AnalyticsData } from '../../types';
import { APP_NAME } from '../../constants';

interface AdminPanelProps {
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'analytics'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [adminAuth, setAdminAuth] = useState(false);
  const [user, setUser] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  
  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved'>('all');

  useEffect(() => {
    if (adminAuth) {
      setUsers(getUsers());
      setAnalytics(getAnalytics());
    }
  }, [adminAuth, activeTab]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (user === 'jinuking3g' && pw === 'Sool6718!') {
      setAdminAuth(true);
      setError('');
    } else {
      setError('Invalid Admin Credentials');
    }
  };

  const handleToggleStatus = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'approved' ? 'pending' : 'approved';
    updateStatus(userId, newStatus);
    setUsers(getUsers());
  };

  const handleDelete = (userId: string) => {
    if (window.confirm('정말 이 사용자를 삭제하시겠습니까? 모든 정보가 사라집니다.')) {
      deleteUser(userId);
      setUsers(getUsers());
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (u.occupation?.toLowerCase().includes(searchQuery.toLowerCase()) || '');
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: users.length,
    pending: users.filter(u => u.status === 'pending').length,
    approved: users.filter(u => u.status === 'approved').length,
  };

  if (!adminAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 p-4">
        <form onSubmit={handleAdminLogin} className="w-full max-w-sm bg-slate-800 border border-slate-700 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-black text-white tracking-widest uppercase">{APP_NAME} Admin</h2>
            <p className="text-slate-400 text-xs mt-2">Restricted Access Area</p>
          </div>
          
          {error && <div className="p-3 bg-red-900/30 border border-red-800 text-red-400 text-xs rounded-lg text-center">{error}</div>}

          <input
            type="text"
            placeholder="Admin ID"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
          />
          <input
            type="password"
            placeholder="Password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
          />
          <div className="flex gap-3">
            <button onClick={onBack} type="button" className="flex-1 text-slate-400 font-bold py-3 rounded-xl hover:text-white transition-colors">Cancel</button>
            <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all">Verify</button>
          </div>
        </form>
      </div>
    );
  }

  const renderUsersTab = () => (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="아이디, 이메일, 직업 검색..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 w-full md:w-auto shrink-0">
          {(['all', 'pending', 'approved'] as const).map(f => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${statusFilter === f ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {f === 'all' ? '전체' : f === 'pending' ? '승인 대기' : '승인 완료'}
              <span className="ml-2 opacity-50">{f === 'all' ? stats.total : f === 'pending' ? stats.pending : stats.approved}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-4">아이디 (ID)</th>
                <th className="px-6 py-4">이메일 (Email)</th>
                <th className="px-6 py-4">비밀번호 (PW)</th>
                <th className="px-6 py-4">직업 (Occupation)</th>
                <th className="px-6 py-4">상태 (Status)</th>
                <th className="px-6 py-4 text-right">관리 (Actions)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-20 text-center text-slate-400">검색 결과가 없습니다.</td></tr>
              ) : (
                filteredUsers.map(u => (
                  <React.Fragment key={u.id}>
                    <tr 
                      className={`hover:bg-slate-50 transition-colors cursor-pointer ${expandedUserId === u.id ? 'bg-blue-50/30' : ''}`}
                      onClick={() => setExpandedUserId(expandedUserId === u.id ? null : u.id)}
                    >
                      <td className="px-6 py-4 font-bold text-slate-800">{u.username}</td>
                      <td className="px-6 py-4 text-xs text-slate-500 truncate max-w-[150px]">{u.email}</td>
                      <td className="px-6 py-4 font-mono text-xs text-blue-600">{u.password || '******'}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{u.occupation || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${u.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {u.status === 'approved' ? '승인완료' : '대기중'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {!u.isAdmin && (
                          <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                            <button onClick={() => handleToggleStatus(u.id, u.status)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase ${u.status === 'approved' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-600 text-white'}`}>
                              {u.status === 'approved' ? '승인취소' : '가입승인'}
                            </button>
                            <button onClick={() => handleDelete(u.id)} className="p-2 text-slate-300 hover:text-red-500">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                    {expandedUserId === u.id && (
                      <tr>
                        <td colSpan={6} className="bg-slate-50/50 px-8 py-6 border-b border-slate-100">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                            <div><h4 className="text-[10px] font-black text-slate-400 uppercase mb-1">자기소개</h4><p className="bg-white p-3 rounded-xl border">{u.introduction || 'N/A'}</p></div>
                            <div><h4 className="text-[10px] font-black text-slate-400 uppercase mb-1">사용 용도</h4><p className="bg-white p-3 rounded-xl border">{u.purpose || 'N/A'}</p></div>
                            <div><h4 className="text-[10px] font-black text-slate-400 uppercase mb-1">인증 정보</h4><div className="bg-white p-4 rounded-xl border space-y-2"><div className="flex justify-between"><span>아이디:</span><b>{u.username}</b></div><div className="flex justify-between"><span>생성일:</span><b>{new Date(u.createdAt).toLocaleDateString()}</b></div></div></div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => {
    if (!analytics) return null;
    const sortedTopics = (Object.entries(analytics.topicCounts) as [string, number][]).sort((a, b) => b[1] - a[1]);
    const maxCount = Math.max(...Object.values(analytics.topicCounts) as number[], 1);

    return (
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Total Users</p>
            <p className="text-3xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border shadow-sm">
            <p className="text-[10px] font-black text-emerald-400 uppercase mb-1">Approved</p>
            <p className="text-3xl font-bold text-emerald-600">{stats.approved}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border shadow-sm">
            <p className="text-[10px] font-black text-amber-400 uppercase mb-1">Pending</p>
            <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">Popular Topics</h3>
          <div className="space-y-4">
            {sortedTopics.map(([topic, count]) => (
              <div key={topic} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold"><span>{topic}</span><span>{count} msgs</span></div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden"><div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${((count as number) / maxCount) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 text-white flex justify-between items-center">
          <div><p className="text-xs text-slate-400 uppercase font-bold mb-1">Total System Messages</p><p className="text-4xl font-black">{analytics.totalMessages.toLocaleString()}</p></div>
          <div className="text-right"><p className="text-xs text-slate-400 uppercase font-bold mb-1">Last Active</p><p className="text-sm font-mono">{new Date(analytics.lastActive).toLocaleString()}</p></div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      <div className="bg-white border-b sticky top-0 z-20 shrink-0">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
           <h1 className="font-bold text-slate-800 text-lg">Admin Dashboard</h1>
           <div className="flex items-center gap-4">
             <div className="flex bg-slate-100 p-1 rounded-lg">
               <button onClick={() => setActiveTab('users')} className={`px-4 py-1.5 rounded-md text-sm font-semibold ${activeTab === 'users' ? 'bg-white shadow-sm' : 'text-slate-500'}`}>Users</button>
               <button onClick={() => setActiveTab('analytics')} className={`px-4 py-1.5 rounded-md text-sm font-semibold ${activeTab === 'analytics' ? 'bg-white shadow-sm' : 'text-slate-500'}`}>Analytics</button>
             </div>
             <button onClick={onBack} className="text-sm font-bold text-slate-500">Exit</button>
           </div>
        </div>
      </div>
      <div className="flex-1 p-6 overflow-y-auto min-h-0 custom-scrollbar">
        {activeTab === 'users' ? renderUsersTab() : renderAnalyticsTab()}
      </div>
    </div>
  );
};

export default AdminPanel;
