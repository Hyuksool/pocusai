
import React, { useState, useEffect } from 'react';
import { login, signup, getSavedId, isAutoLoginEnabled } from '../../services/authService';
import { User } from '../../types';
import { APP_NAME } from '../../constants';

interface AuthScreenProps {
  onLoginSuccess: (user: User) => void;
  onAdminClick: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess, onAdminClick }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Persistence checkboxes
  const [rememberId, setRememberId] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);
  
  // Additional profile fields
  const [occupation, setOccupation] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [purpose, setPurpose] = useState('');
  const [referral, setReferral] = useState('');

  const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);

  useEffect(() => {
    if (isLogin) {
      const savedId = getSavedId();
      if (savedId) {
        setUsername(savedId);
        setRememberId(true);
      }
      setAutoLogin(isAutoLoginEnabled());
    }
  }, [isLogin]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (isLogin) {
      const result = login(username, password, rememberId, autoLogin);
      if (result.success && result.user) {
        onLoginSuccess(result.user);
      } else {
        setMessage({ text: result.message, type: 'error' });
      }
    } else {
      const result = signup(username, email, password, {
        occupation,
        introduction,
        purpose,
        referral
      });
      if (result.success) {
        setMessage({ text: result.message, type: 'success' });
        // Clear metadata fields
        setOccupation('');
        setIntroduction('');
        setPurpose('');
        setReferral('');
        setEmail('');
        setTimeout(() => setIsLogin(true), 4000);
      } else {
        setMessage({ text: result.message, type: 'error' });
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
      {/* Container needs a fixed max-height and flex-col for internal scrolling */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-fade-in flex flex-col h-auto max-h-[85vh]">
        <div className="p-8 text-center bg-gradient-to-br from-blue-600 to-blue-800 text-white shrink-0">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold">{APP_NAME}</h2>
          <p className="text-blue-100 text-sm mt-1">Medical Professional Access</p>
        </div>

        {/* Form area: scrollable with custom scrollbar */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5 overflow-y-auto flex-1 custom-scrollbar min-h-0">
          {message && (
            <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
              {message.text}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Username (아이디)</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                placeholder="ID"
              />
            </div>

            {!isLogin && (
              <div className="animate-fade-in">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Email (이메일)</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  placeholder="doctor@hospital.com"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Password (비밀번호)</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                placeholder="••••••••"
              />
            </div>

            {isLogin && (
              <div className="flex flex-col gap-2 px-1 pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberId}
                      onChange={(e) => setRememberId(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-4 h-4 border-2 border-slate-300 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all"></div>
                    <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 left-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-slate-500 group-hover:text-slate-700 transition-colors">아이디 저장 (Remember ID)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={autoLogin}
                      onChange={(e) => setAutoLogin(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-4 h-4 border-2 border-slate-300 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all"></div>
                    <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 left-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-slate-500 group-hover:text-slate-700 transition-colors">자동 로그인 (Stay Logged In)</span>
                </label>
              </div>
            )}

            {!isLogin && (
              <div className="space-y-4 pt-2 border-t border-slate-100 mt-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">Professional Profile</p>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Occupation (직업)</label>
                  <input
                    type="text"
                    required
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                    placeholder="e.g. Pediatrician, Resident"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Introduction (자기소개)</label>
                  <textarea
                    required
                    value={introduction}
                    onChange={(e) => setIntroduction(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm min-h-[80px]"
                    placeholder="Briefly introduce yourself"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Purpose (사용 용도)</label>
                  <input
                    type="text"
                    required
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                    placeholder={`How will you use ${APP_NAME}?`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Referral (알게 된 경로)</label>
                  <input
                    type="text"
                    required
                    value={referral}
                    onChange={(e) => setReferral(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                    placeholder="Where did you hear about us?"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mt-2 shrink-0">
            <h4 className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              Research & Education Disclaimer
            </h4>
            <p className="text-[11px] leading-relaxed text-amber-800 font-medium">
              {APP_NAME} is intended strictly for <strong>research and educational purposes</strong> in the field of Clinical Ultrasound. It is <strong>not</strong> intended for medical diagnosis, clinical decision-making, or patient care.
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] mt-4 shrink-0"
          >
            {isLogin ? 'Log In' : 'Submit for Approval'}
          </button>

          <div className="flex items-center justify-between pt-2 shrink-0 pb-6">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              {isLogin ? "Join as Medical Pro" : "Go to Login"}
            </button>
            <button
              type="button"
              onClick={onAdminClick}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors"
            >
              Admin
            </button>
          </div>
        </form>
      </div>
      <p className="mt-8 text-slate-400 text-xs text-center max-w-sm shrink-0">
        Authorized medical personnel only. Approval is required before initial login.
      </p>
    </div>
  );
};

export default AuthScreen;
