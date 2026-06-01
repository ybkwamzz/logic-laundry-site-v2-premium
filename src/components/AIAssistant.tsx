import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, RotateCcw, HelpCircle } from 'lucide-react';
import { ChatMessage, Language, ThemeVersion } from '../types';

interface AIAssistantProps {
  language: Language;
  selectedTheme: ThemeVersion;
}

export default function AIAssistant({ language, selectedTheme }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with greeting
  useEffect(() => {
    const freshGreeting = language === 'en' 
      ? "Safi here, your AI Dobi! 🤖✨ Need fabric advice, quick stain removals (curse you, spillages!), or a quote? Give me your finest questions!"
      : "Safi hapa, dobi wako wa AI! 🤖✨ Unahitaji ushauri wa kitambaa, kuondoa madoa haraka (ole wako kahawa!), au makadirio ya bei? Niulize maswali yako mazuri!";
    
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: freshGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [language]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Hardcode a few quick prompt suggestions
  const suggestions = language === 'en' ? [
    "How to clear red wine stains? 🍷",
    "What is the price of 6kg express? ⚡",
    "Is my estate (Westlands) free delivery? 🚚",
  ] : [
    "Kuondoa madoa ya divai nyekundu? 🍷",
    "Bei ya kilo 6 za express ni ngapi? ⚡",
    "Je, Kasarani mnapeleka bure? 🚚",
  ];

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage.trim();
    if (!textToSend) return;

    if (!customText) setInputMessage('');

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          selectedTheme,
        }),
      });

      const data = await response.json();
      
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || (language === 'en' ? "Hmm, I slipped on some soap. Let me retry." : "Ona, nimeseleka kwenye sabuni. Acha nijaribu tena."),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Error talking to Safi chatbot:', err);
      const errMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: language === 'en' 
          ? "My bubbles popped! Looks like there is a temporary connection issue. Please make sure GEMINI_API_KEY is configured in Settings > Secrets."
          : "Puto langu la sabuni limepasuka! Inaonekana kuna shida ndogo ya mtandao. Tafadhali hakikisha kuwa GEMINI_API_KEY imewekwa katika Settings > Secrets.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleResetChat = () => {
    const originalGreeting = language === 'en'
      ? "Chat reset! What else can I clean up or calculate for you? 🧺"
      : "Soga imeanzishwa upya! Ni nini kingine ninaweza kukusafishia au kukupigia hesabu leo? 🧺";

    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: originalGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <>
      {/* Mini floating launcher button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-24 md:right-8 z-50 flex items-center gap-2 px-5 py-4 bg-brand-blue hover:bg-brand-blue-dk text-white font-poppins text-sm font-semibold rounded-full shadow-2xl transition duration-300 hover:-translate-y-1 hover:scale-105 select-none animate-pulse-whatsapp"
          id="ai-chat-launcher"
        >
          <Sparkles className="w-5 h-5 text-brand-yellow animate-bounce" />
          <span>{language === 'en' ? 'Chat with Safi AI' : 'Ongea na Safi AI'}</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-yellow opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-yellow"></span>
          </span>
        </button>
      )}

      {/* Main expanded chatbot drawer */}
      {isOpen && (
        <div 
          className="fixed bottom-6 right-4 md:right-8 w-[92vw] sm:w-[420px] h-[550px] bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col z-50 overflow-hidden font-sans transition-all duration-300"
          id="ai-chat-container"
        >
          {/* Header */}
          <div className="px-5 py-4 bg-brand-navy text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-blue flex items-center justify-center font-poppins text-lg font-bold border border-brand-yellow text-white">
                🫧
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-poppins font-bold text-sm tracking-tight text-white m-0">Safi - AI Dobi</h3>
                  <span className="text-[10px] bg-brand-blue/30 text-brand-yellow border border-brand-blue-dk px-1.5 py-0.5 rounded font-poppins font-medium">Smart</span>
                </div>
                <p className="text-[11px] text-slate-300 m-0">
                  {language === 'en' ? 'Online • Nairobi-expert' : 'Maji yashachemka • Fundi Dobi'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleResetChat}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                title={language === 'en' ? 'Reset Conversation' : 'Anzisha upya'}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
            {messages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div 
                  key={msg.id} 
                  className={`flex ${isAssistant ? 'justify-start' : 'justify-end'} gap-2`}
                >
                  {isAssistant && (
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-sm select-none border border-slate-300">
                      🧼
                    </div>
                  )}
                  <div className="max-w-[75%]">
                    <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                      isAssistant 
                        ? 'bg-white text-slate-800 shadow-sm rounded-tl-none border border-slate-100' 
                        : 'bg-brand-blue text-white rounded-tr-none'
                    }`}>
                      <p className="whitespace-pre-line leading-relaxed m-0">{msg.content}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block px-1 text-right">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}
            
            {/* Show tiny typing indicator */}
            {isTyping && (
              <div className="flex justify-start gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-sm border border-slate-300">
                  🧼
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl text-sm rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-1">
                  <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* suggestions buttons */}
          {messages.length === 1 && !isTyping && (
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 space-y-1.5">
              <p className="text-[11px] text-slate-400 flex items-center gap-1 shrink-0 m-0">
                <HelpCircle className="w-3 h-3" />
                {language === 'en' ? 'Frequently Asked Questions:' : 'Maswali yanayoulizwa mara kwa mara:'}
              </p>
              <div className="flex flex-col gap-1">
                {suggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(s)}
                    className="text-left text-[11.5px] text-brand-blue hover:text-brand-blue-dk bg-white border border-slate-200 hover:border-brand-blue/30 px-3 py-1.5 rounded-lg transition overflow-ellipsis overflow-hidden whitespace-nowrap"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form message sender footer */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-slate-100 bg-white flex gap-2"
          >
            <input 
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={language === 'en' ? "Ask about laundry, stains, or prices..." : "Uliza kuhusu dobi, madoa, au bei..."}
              className="flex-1 px-4 py-2 text-sm border border-slate-200 rounded-xl focus:border-brand-blue focus:outline-none bg-slate-50 focus:bg-white"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="p-2.5 bg-brand-blue hover:bg-brand-blue-dk disabled:bg-slate-100 text-white disabled:text-slate-300 rounded-xl transition flex items-center justify-center shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
