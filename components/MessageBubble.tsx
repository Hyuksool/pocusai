
import React, { useState } from 'react';
import { Message } from '../types';
import { formatMessageText } from '../utils/textFormatter';
import { exportClinicalReport } from '../utils/pdfExport';
import { getCurrentUser } from '../services/authService';

interface MessageBubbleProps {
  message: Message;
  donateLabel?: string;
  mode?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, donateLabel, mode }) => {
  const isUser = message.role === 'user';
  const isError = message.isError;
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    const user = getCurrentUser();
    await exportClinicalReport(
      message.text, 
      message.image, 
      mode || 'General', 
      user?.username || 'Medical Professional'
    );
    setIsExporting(false);
  };

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`
          max-w-[85%] md:max-w-[75%] rounded-2xl px-6 py-4 shadow-sm
          ${
            isUser
              ? 'bg-blue-600 text-white rounded-br-none'
              : isError
              ? 'bg-red-50 text-red-800 border border-red-200 rounded-bl-none'
              : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
          }
        `}
      >
        {/* Render Image if exists */}
        {message.image && (
          <div className="mb-3">
            <img 
              src={message.image} 
              alt="Uploaded ultrasound" 
              className="rounded-lg max-h-64 object-cover border border-black/10"
            />
          </div>
        )}

        <div className="text-sm md:text-base leading-relaxed">
          {isUser ? (
            <div className="whitespace-pre-wrap">{message.text}</div>
          ) : (
            formatMessageText(message.text)
          )}
        </div>
        
        {/* Actions for Model Messages */}
        {!isUser && !isError && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-2 justify-end">
             {/* PDF Export Button */}
             <button
               onClick={handleExport}
               disabled={isExporting}
               className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-full transition-all shadow-sm active:scale-95 disabled:opacity-50"
             >
               {isExporting ? (
                 <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
               ) : (
                 <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                 </svg>
               )}
               {isExporting ? 'Generating...' : 'Download PDF Report'}
             </button>

             {/* Donation Button */}
             {donateLabel && (
               <a 
                 href="https://www.paypal.com/donate" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-400 hover:bg-yellow-500 text-slate-900 text-xs font-semibold rounded-full transition-colors shadow-sm"
               >
                 <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M7.076 21.337l.756-5h2.828c3.683 0 6.613-2.93 6.613-6.613 0-3.683-2.93-6.613-6.613-6.613H4.473a1.104 1.104 0 00-1.08 1.287l2.427 15.652a1.105 1.105 0 001.256.987zM8.88 15.22l-.46 3.036h2.72c2.583 0 4.676-2.093 4.676-4.676 0-2.583-2.093-4.676-4.676-4.676H9.15L8.88 15.22z" />
                   <path d="M10.88 8.903h2.247c1.787 0 3.235 1.448 3.235 3.235 0 1.787-1.448 3.235-3.235 3.235h-1.666l-.58 3.84H7.817l.846-5.597.58-3.84.42-2.775a.96.96 0 01.95-.816h.267z" opacity="0.6"/>
                 </svg>
                 {donateLabel}
               </a>
             )}
          </div>
        )}

        <div
          className={`text-[10px] mt-2 opacity-70 ${
            isUser ? 'text-blue-100' : 'text-slate-400'
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
