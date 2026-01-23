import React, { useState, useEffect } from 'react';
import { login, signup, getSavedId, isAutoLoginEnabled } from '../../services/authService';
import { User } from '../../types';
import { APP_NAME } from '../../constants';

interface AuthScreenProps {
  onLoginSuccess: (user: User) => void;
  onAdminClick: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess, onAdminClick }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'contact'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  
  // Signup specific fields
  const [signupData, setSignupData] = useState({
    occupation: '',
    introduction: '',
    purpose: '',
    referral: ''
  });

  const [rememberId, setRememberId] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);
  
  const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);

  useEffect(() => {
    if (activeTab === 'login') {
      const savedId = getSavedId();
      if (savedId) {
        setUsername(savedId);
        setRememberId(true);
      }
      setAutoLogin(isAutoLoginEnabled());
    }
    setMessage(null);
  }, [activeTab]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (activeTab === 'login') {
      const result = login(username, password, rememberId, autoLogin);
      if (result.success && result.user) {
        onLoginSuccess(result.user);
      } else {
        setMessage({ text: result.message, type: 'error' });
      }
    } else if (activeTab === 'signup') {
      const result = signup(username, email, password, signupData);
      if (result.success) {
        setMessage({ text: result.message, type: 'success' });
        // 성공 후 필드 초기화
        setUsername('');
        setPassword('');
        setEmail('');
        setSignupData({ occupation: '', introduction: '', purpose: '', referral: '' });
      } else {
        setMessage({ text: result.message, type: 'error' });
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-transparent">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        
        <div className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white overflow-hidden flex flex-col max-h-[90vh]">
          
          {/* Brand Header */}
          <div className="relative pt-8 pb-6 px-8 text-center bg-gradient-to-br from-blue-600 to-indigo-700 shrink-0">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <div className="relative z-10">
              <div className="mx-auto h-12 w-12 bg-white rounded-xl flex items-center justify-center shadow-xl mb-3 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">{APP_NAME}</h2>
              <p className="mt-0.5 text-[10px] text-blue-100 font-bold opacity-80 uppercase tracking-[0.2em]">Medical Consultant</p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-slate-50 border-b border-slate-100 shrink-0">
            {(['login', 'signup', 'contact'] as const).map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-[11px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab 
                    ? 'text-blue-600 bg-white border-b-2 border-blue-600' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab === 'login' ? 'Sign In' : tab === 'signup' ? 'Sign Up' : 'Contact'}
              </button>
            ))}
          </div>

          {/* Form / Content Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
            <div className="p-8">
              {message && (
                <div className={`p-4 rounded-2xl text-xs font-bold animate-fade-in border mb-6 ${
                  message.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                }`}>
                  {message.text}
                </div>
              )}

              {activeTab === 'login' || activeTab === 'signup' ? (
                <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
                  <div className="group">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Username (ID)</label>
                    <input
                      type="text" required value={username} onChange={e => setUsername(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                      placeholder="Enter ID"
                    />
                  </div>

                  {activeTab === 'signup' && (
                    <div className="group">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
                      <input
                        type="email" required value={email} onChange={e => setEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                        placeholder="example@email.com"
                      />
                    </div>
                  )}

                  <div className="group">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Password</label>
                    <input
                      type="password" required value={password} onChange={e => setPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                      placeholder="••••••••"
                    />
                  </div>

                  {activeTab === 'signup' && (
                    <div className="space-y-4 pt-2 border-t border-slate-50">
                      <div className="group">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Occupation</label>
                        <input
                          type="text" required value={signupData.occupation} onChange={e => setSignupData({...signupData, occupation: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                          placeholder="MD, Student, etc."
                        />
                      </div>
                      <div className="group">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Research Purpose</label>
                        <textarea
                          required value={signupData.purpose} onChange={e => setSignupData({...signupData, purpose: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all min-h-[80px] resize-none"
                          placeholder="Why do you want to use this tool?"
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'login' && (
                    <div className="flex flex-col gap-2 pt-1">
                      <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input type="checkbox" checked={rememberId} onChange={e => setRememberId(e.target.checked)} className="w-4 h-4 rounded border-slate-200 text-blue-600 focus:ring-blue-500/20" />
                        <span className="text-[11px] font-bold text-slate-500">Remember ID</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer select-none">
                        <input type="checkbox" checked={autoLogin} onChange={e => setAutoLogin(e.target.checked)} className="w-4 h-4 rounded border-slate-200 text-blue-600 focus:ring-blue-500/20" />
                        <span className="text-[11px] font-bold text-slate-500">Auto Login</span>
                      </label>
                    </div>
                  )}

                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-200 transition-all active:scale-[0.98] mt-2">
                    {activeTab === 'login' ? 'Sign In' : 'Create Account'}
                  </button>

                  {activeTab === 'login' && (
                    <div className="text-center pt-2">
                      <button type="button" onClick={onAdminClick} className="text-[10px] font-black text-slate-300 hover:text-slate-500 uppercase tracking-[0.2em] transition-colors">
                        Administrator Access
                      </button>
                    </div>
                  )}
                </form>
              ) : (
                <div className="space-y-6 animate-fade-in text-slate-700">
                  <div className="text-center space-y-1">
                    <h3 className="text-xl font-bold text-slate-900">Hyuksool Kwon, MD.PhD.</h3>
                    <div className="w-10 h-1 bg-blue-600 mx-auto rounded-full"></div>
                  </div>

                  <div className="space-y-5">
                    <div className="flex gap-4">
                      <div className="shrink-0 w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Affiliations</p>
                        <ul className="text-xs leading-relaxed font-semibold space-y-1 text-slate-600">
                          <li>• Professor, Dept. of Emergency Medicine, SNU</li>
                          <li>• CMO & Co-Founder, Barreleye Inc.</li>
                          <li>• Director, Quantitative Ultrasound Research Center</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="shrink-0 w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Contact Info</p>
                        <div className="space-y-1.5">
                          <a href="mailto:jinuking3g@snubh.org" className="block text-xs font-bold text-slate-800 hover:text-blue-600 transition-colors">jinuking3g@snubh.org</a>
                          <a href="mailto:hskwon@barreleye.co.kr" className="block text-xs font-bold text-slate-800 hover:text-blue-600 transition-colors">hskwon@barreleye.co.kr</a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold leading-relaxed text-center italic">
                      "Advancing Point-of-Care Ultrasound through Hybrid Intelligence."
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Warning */}
          <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 shrink-0">
             <div className="flex items-start gap-3">
               <div className="mt-0.5 text-amber-500 shrink-0">
                 <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
               </div>
               <p className="text-[9px] leading-relaxed text-slate-500 font-medium">
                 This system is for <strong>authorized research only</strong>. Final diagnostic decisions must be made by a licensed physician.
               </p>
             </div>
          </div>
        </div>
        
        <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AuthScreen;
