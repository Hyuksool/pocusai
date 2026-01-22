
import React from 'react';
import { ChatSession, UiTranslation, User } from '../types';
import { APP_NAME } from '../constants';

interface SidebarProps {
  isOpen: boolean;
  history: ChatSession[];
  onSelectSession: (session: ChatSession) => void;
  onNewChat: () => void;
  onClose: () => void;
  t: UiTranslation;
  currentSessionId: string | null;
  onLogout: () => void;
  user: User | null;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  history, 
  onSelectSession, 
  onNewChat,
  onClose,
  t,
  currentSessionId,
  onLogout,
  user
}) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      <aside 
        className={`
          fixed md:relative top-0 left-0 h-full w-64 bg-white border-r border-slate-200 z-30
          transform transition-transform duration-300 ease-in-out flex flex-col shadow-xl md:shadow-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* App Title / Logo Area */}
        <div className="p-4 h-16 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            </div>
            <h1 className="font-bold text-xl text-slate-800 tracking-tight">{APP_NAME}</h1>
          </div>
          <button 
            onClick={onClose}
            className="md:hidden text-slate-500 hover:text-slate-800 p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 768) onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-400 hover:shadow-md text-slate-700 rounded-xl transition-all shadow-sm mb-6 group"
          >
            <div className="bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white p-1.5 rounded-lg transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </div>
            <span className="font-semibold text-sm">{t.newChat}</span>
          </button>

          <div className="px-2 mb-2">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{t.history}</h2>
          </div>

          <div className="space-y-1">
            {history.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm italic">
                {t.noHistory}
                </div>
            ) : (
                history.slice().reverse().map((session) => (
                <button
                    key={session.id}
                    onClick={() => {
                    onSelectSession(session);
                    if (window.innerWidth < 768) onClose();
                    }}
                    className={`
                    w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all border group relative
                    ${currentSessionId === session.id 
                        ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm font-medium' 
                        : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
                    `}
                >
                    <div className="truncate pr-2">{session.title}</div>
                    {currentSessionId === session.id && (
                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-lg"></div>
                    )}
                </button>
                ))
            )}
          </div>
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
              {user?.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">{user?.username}</p>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{user?.isAdmin ? 'Administrator' : 'Medical Professional'}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
