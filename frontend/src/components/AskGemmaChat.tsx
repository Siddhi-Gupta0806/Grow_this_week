import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChatMessage } from '../types';
import { askGemmaChatApi } from '../utils/api';
import { MessageSquare, Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const AskGemmaChat: React.FC = () => {
  const { city, language } = useApp();

  const [inputMsg, setInputMsg] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello gardener in ${city}! I'm your grounded AI assistant powered by Gemma 4. Ask me anything about your weather, plant care, or why certain crops were chosen for your garden.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isSending, setIsSending] = useState(false);

  const suggestedChips = [
    'Why did you pick okra?',
    'My leaves are yellow, why?',
    'How often should I water in this heat?',
    'Best companion plants for tomatoes?',
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputMsg;
    if (!text.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMsg('');
    setIsSending(true);

    try {
      const replyText = await askGemmaChatApi(text, city, language);
      const assistantMsg: ChatMessage = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      alert('Failed to get response.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto h-[600px] flex flex-col glass-card rounded-3xl border border-sage-500/20 shadow-lift overflow-hidden">
      
      {/* Header */}
      <div className="p-4 bg-forest-800 text-cream-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sage-500 text-cream-50 flex items-center justify-center font-bold text-xl">
            🤖
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg">Ask Gemma 4 Assistant</h3>
            <span className="text-xs text-sage-300 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Grounded on {city} Weather & Memory
            </span>
          </div>
        </div>
      </div>

      {/* Message History Window */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                msg.role === 'user'
                  ? 'bg-sunrise-500 text-cream-50'
                  : 'bg-sage-500 text-cream-50'
              }`}
            >
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[80%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-sunrise-500 text-cream-50 font-medium rounded-tr-none'
                  : 'bg-cream-50 dark:bg-forest-800 text-forest-900 dark:text-cream-50 border border-sage-500/20 rounded-tl-none shadow-soft'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              <span className="block text-[10px] opacity-60 text-right mt-1">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}
        {isSending && (
          <div className="flex items-center gap-2 text-xs text-sage-600 dark:text-sage-400 italic">
            <Loader2 className="w-4 h-4 animate-spin text-sage-500" />
            <span>Gemma 4 is formulating grounded answer...</span>
          </div>
        )}
      </div>

      {/* Prompt Chips */}
      <div className="px-4 py-2 bg-sage-50/50 dark:bg-forest-900/50 border-t border-sage-500/10 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <Sparkles className="w-4 h-4 text-botanical-gold flex-shrink-0" />
        {suggestedChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            className="px-3 py-1 rounded-full text-xs font-semibold bg-cream-50 dark:bg-forest-800 border border-sage-500/30 text-forest-800 dark:text-cream-50 hover:bg-sage-500 hover:text-cream-50 transition-colors whitespace-nowrap flex-shrink-0"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-3 bg-cream-50 dark:bg-forest-900 border-t border-sage-500/20 flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask Gemma about watering, pests, soil, or climate..."
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 px-4 py-2.5 rounded-full bg-cream-100 dark:bg-forest-800 border border-sage-500/30 text-xs sm:text-sm text-forest-900 dark:text-cream-50 focus:outline-none focus:ring-2 focus:ring-sage-500"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputMsg.trim() || isSending}
          className="p-2.5 rounded-full bg-sage-500 text-cream-50 hover:bg-forest-800 disabled:opacity-50 transition-colors flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
