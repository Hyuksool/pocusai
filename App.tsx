
import React, { useState, useRef, useEffect } from 'react';
import Header from './components/Header';
import InputArea from './components/InputArea';
import MessageBubble from './components/MessageBubble';
import Sidebar from './components/Sidebar';
import AuthScreen from './components/Auth/AuthScreen';
import AdminPanel from './components/Auth/AdminPanel';
import { Message, ChatSession, PocusMode, User, AuthView } from './types';
import { sendMessageToGemini } from './services/geminiService';
import { initAuth, getCurrentUser, logout, isAutoLoginEnabled } from './services/authService';
import { trackUsage } from './services/analyticsService';
import { SUPPORTED_LANGUAGES, UI_TRANSLATIONS } from './constants';

const App: React.FC = () => {
  const [authView, setAuthView] = useState<AuthView>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [language, setLanguage] = useState<string>(SUPPORTED_LANGUAGES[0].code);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [mode, setMode] = useState<PocusMode | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS['en'];

  useEffect(() => {
    initAuth();
    const user = getCurrentUser();
    if (user && isAutoLoginEnabled()) {
      setCurrentUser(user);
      setAuthView('app');
    } else if (user) {
      setCurrentUser(user);
      setAuthView('app');
    }
  }, []);

  useEffect(() => {
    if (mode && messages.length > 0 && messages[0].id === 'welcome') {
      setMessages(prev => {
        const newMsgs = [...prev];
        if (newMsgs[0]) newMsgs[0].text = t.welcome;
        return newMsgs;
      });
    }
  }, [language, t.welcome, mode]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, mode]);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setAuthView('app');
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setAuthView('login');
    setMessages([]);
    setMode(null);
  };

  const handleSelectMode = (selectedMode: PocusMode) => {
    setMode(selectedMode);
    setMessages([{
      id: 'welcome',
      role: 'model',
      text: t.welcome,
      timestamp: Date.now()
    }]);
    setCurrentSessionId(null);
  };

  const saveCurrentSession = () => {
    if (mode && messages.length > 1) {
      const userFirstMsg = messages.find(m => m.role === 'user');
      const baseTitle = userFirstMsg ? userFirstMsg.text.slice(0, 30) + (userFirstMsg.text.length > 30 ? '...' : '') : 'New Chat';
      const titlePrefix = mode === 'adult' ? '[Adult] ' : '[Ped] ';
      
      const newSession: ChatSession = {
        id: currentSessionId || Date.now().toString(),
        title: titlePrefix + baseTitle,
        messages: messages,
        timestamp: Date.now(),
        mode: mode
      };

      setChatHistory(prev => {
        if (currentSessionId) {
          return prev.map(s => s.id === currentSessionId ? newSession : s);
        }
        return [...prev, newSession];
      });
    }
  };

  const handleHome = () => {
    saveCurrentSession();
    setCurrentSessionId(null);
    setMode(null);
    setMessages([]);
    setIsSidebarOpen(false);
  };

  const handleLoadSession = (session: ChatSession) => {
    saveCurrentSession();
    setMode(session.mode);
    setCurrentSessionId(session.id);
    setMessages(session.messages);
  };

  const handleSendMessage = async (text: string, image?: string) => {
    if (!mode) return;

    const quickActionMatch = t.quickActions[mode].find(a => a.query === text);
    if (quickActionMatch) trackUsage(quickActionMatch.label);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      image,
      timestamp: Date.now()
    };
    
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(updatedMessages, text, image, language, mode);
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: error instanceof Error ? error.message : "Error generating response.",
        timestamp: Date.now(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (authView === 'login' || authView === 'signup') {
    return (
      <div className="relative w-full h-screen overflow-hidden medical-bg">
        <div className="relative z-10 w-full h-full overflow-y-auto custom-scrollbar">
          <AuthScreen onLoginSuccess={handleLoginSuccess} onAdminClick={() => setAuthView('admin')} />
        </div>
      </div>
    );
  }

  if (authView === 'admin') {
    return <AdminPanel onBack={() => setAuthView('login')} />;
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      <Sidebar 
        isOpen={isSidebarOpen}
        history={chatHistory}
        onSelectSession={handleLoadSession}
        onNewChat={handleHome} 
        onClose={() => setIsSidebarOpen(false)}
        t={t}
        currentSessionId={currentSessionId}
        onLogout={handleLogout}
        user={currentUser}
      />

      <div className="flex-1 flex flex-col h-full relative min-w-0">
        <Header 
          currentLanguage={language} 
          onLanguageChange={setLanguage} 
          onNewChat={handleHome}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        
        <main className="flex-1 overflow-y-auto pt-20 pb-40 px-4 md:px-6 scroll-smooth custom-scrollbar min-h-0">
          <div className="max-w-3xl mx-auto flex flex-col min-h-full">
            {!mode && (
              <div className="animate-fade-in py-12 flex flex-col items-center justify-center flex-1">
                <div className="text-center mb-10 bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-sm border border-slate-100 w-full">
                   <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">{t.selectMode}</h2>
                   <p className="text-slate-500">Welcome, {currentUser?.username}. Select the patient group to initialize the AI consultant.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl px-4">
                  <button 
                    onClick={() => handleSelectMode('adult')}
                    className="flex flex-col items-center justify-center p-8 bg-white/90 backdrop-blur-sm border border-slate-200 hover:border-blue-400 hover:shadow-xl rounded-3xl transition-all duration-300 group shadow-sm"
                  >
                     <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:scale-110">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                     </div>
                     <span className="text-xl font-bold text-slate-700 group-hover:text-blue-700">{t.adultLabel}</span>
                  </button>

                  <button 
                    onClick={() => handleSelectMode('pediatric')}
                    className="flex flex-col items-center justify-center p-8 bg-white/90 backdrop-blur-sm border border-slate-200 hover:border-emerald-400 hover:shadow-xl rounded-3xl transition-all duration-300 group shadow-sm"
                  >
                     <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-hover:scale-110">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                     </div>
                     <span className="text-xl font-bold text-slate-700 group-hover:text-emerald-700">{t.pediatricLabel}</span>
                  </button>
                </div>
              </div>
            )}

            {mode && (
              <div className="flex-1">
                {messages.map((msg) => (
                  <MessageBubble 
                    key={msg.id} 
                    message={msg} 
                    donateLabel={t.donate} 
                    mode={mode}
                  />
                ))}
                
                {messages.length === 1 && !isLoading && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 mb-8 animate-fade-in">
                    <h3 className="col-span-1 md:col-span-2 text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 px-3 py-1">
                      {t.commonTopics}
                    </h3>
                    {t.quickActions[mode].map((action, index) => (
                      <button
                        key={index}
                        onClick={() => handleSendMessage(action.query)}
                        className="text-left bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-2xl p-4 shadow-sm transition-all duration-200 group flex items-center justify-between"
                      >
                        <span className="font-semibold text-slate-700 group-hover:text-blue-700 text-sm">
                          {action.label}
                        </span>
                        <svg className="w-4 h-4 text-slate-300 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ))}
                  </div>
                )}

                {isLoading && (
                  <div className="flex justify-start mb-6 w-full animate-fade-in">
                    <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none px-6 py-4 shadow-sm flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                
                <div ref={bottomRef} className="h-4" />
              </div>
            )}
          </div>
        </main>

        {mode && (
          <InputArea 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading} 
            placeholder={t.placeholder}
            disclaimer={t.disclaimer}
          />
        )}
      </div>
    </div>
  );
};

export default App;
