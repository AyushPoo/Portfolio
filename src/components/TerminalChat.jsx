import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, Minimize2, Send, Command } from 'lucide-react';
import axios from 'axios';

const TerminalChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { role: 'system', content: 'AYUSH_OS [Version 4.0.2]' },
    { role: 'system', content: '(c) Ayush Poojary. All rights reserved.' },
    { role: 'system', content: 'Type "help" for a list of commands.' },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isTyping]);

  const handleCommand = async (cmd) => {
    const cleanCmd = cmd.toLowerCase().trim();
    setHistory(prev => [...prev, { role: 'user', content: cmd }]);
    setInput('');

    if (cleanCmd === 'help') {
      setHistory(prev => [...prev, { role: 'system', content: 'Available commands: whois, skills, projects, contact, clear, help' }]);
      return;
    }

    if (cleanCmd === 'clear') {
      setHistory([
        { role: 'system', content: 'Terminal cleared.' },
        { role: 'system', content: 'Type "help" for a list of commands.' }
      ]);
      return;
    }

    if (cleanCmd === 'whois') {
      setHistory(prev => [...prev, { role: 'system', content: 'Ayush Poojary: Financial Modeler, Automation Enthusiast, and MBA Aspirant. Currently building Founder Systems.' }]);
      return;
    }

    if (cleanCmd === 'skills') {
      setHistory(prev => [...prev, { role: 'system', content: 'Stack: React, Node.js, Python, n8n, Google Apps Script, Financial Modeling (Excel/VBA).' }]);
      return;
    }

    // AI Chat for everything else
    setIsTyping(true);
    try {
      // Only send the last 10 messages to keep the context clean and fast
      const recentHistory = history.slice(-10).map(h => ({
        role: h.role === 'assistant' ? 'model' : h.role === 'system' ? 'model' : h.role,
        content: h.content
      }));

      const response = await axios.post('/api/chat', {
        messages: recentHistory.concat({ role: 'user', content: cmd })
      });
      
      const text = response.data.text;
      setHistory(prev => [...prev, { role: 'assistant', content: text }]);
    } catch (error) {
      console.error('Terminal Error:', error);
      setHistory(prev => [...prev, { 
        role: 'error', 
        content: 'SYSTEM OVERLOAD: RECALIBRATING BRAIN... Please try another query.' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-black border-2 border-[#00ff00] p-4 rounded-full shadow-[0_0_15px_rgba(0,255,0,0.3)] text-[#00ff00]"
      >
        <Terminal size={24} />
      </motion.button>

      {/* Terminal Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-20 right-0 w-[90vw] md:w-[450px] h-[500px] terminal-container rounded-lg border-2 border-[#00ff00] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#00ff00] text-black px-4 py-2 flex justify-between items-center font-bold text-xs uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <Command size={14} />
                <span>Ayush_OS Terminal</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setIsOpen(false)} className="hover:opacity-70">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Scanlines Overlay */}
            <div className="absolute inset-0 scanlines pointer-events-none opacity-30 z-10" />

            {/* Content Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-2 text-sm crt-flicker relative z-0"
            >
              {history.map((msg, i) => (
                <div key={i} className={`terminal-text whitespace-pre-wrap ${msg.role === 'user' ? 'text-white' : msg.role === 'error' ? 'text-red-500' : 'text-[#00ff00]'}`}>
                  {msg.role === 'user' && <span className="mr-2">C:\USERS\GUEST&gt;</span>}
                  {msg.role === 'system' && <span className="mr-2">[SYSTEM]</span>}
                  {msg.role === 'assistant' && <span className="mr-2">[AYUSH_AI]</span>}
                  {msg.content}
                </div>
              ))}
              {isTyping && (
                <div className="text-[#00ff00] animate-pulse">
                  [AYUSH_AI] Thinking<span className="terminal-cursor" />
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-[#00ff00]/30 bg-black/50 relative z-20">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (input.trim()) handleCommand(input);
                }}
                className="flex items-center gap-2"
              >
                <span className="text-[#00ff00] font-bold">$&gt;</span>
                <input
                  autoFocus
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-[#00ff00] font-mono placeholder-[#00ff00]/30"
                  placeholder="Enter command..."
                />
                <button type="submit" className="text-[#00ff00] hover:scale-110 transition-transform">
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TerminalChat;
