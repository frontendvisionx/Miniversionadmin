/**
 * AI Business Assistant Component
 * Floating chat widget powered by Gemini 2.0 AI
 * Provides intelligent business type and category suggestions
 */

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Sparkles, TrendingUp, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { aiSuggestionsAPI } from '../services/api.js';
import toast from 'react-hot-toast';
import { COLORS } from '../hooks/useColors.js';

const AIBusinessAssistant = ({ onSuggestionSelect: _onSuggestionSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConfigured, setIsConfigured] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: "👋 Hey! I'm your AI Business Assistant.\n\nI'm here to help you with all your business needs:\n\n• Suggest relevant business types for your marketplace\n• Create structured categories and subcategories\n• Analyze market trends and demand\n• Validate business ideas\n• Provide insights on vendor onboarding\n\nWhat would you like to know about businesses today?",
        timestamp: new Date().toISOString()
      }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check AI configuration on mount
  useEffect(() => {
    checkAIHealth();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const checkAIHealth = async () => {
    try {
      const response = await aiSuggestionsAPI.checkHealth();
      setIsConfigured(response.data?.configured || false);
    } catch (error) {
      setIsConfigured(false);
    }
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    
    if (!inputMessage.trim() || isLoading) return;

    if (!isConfigured) {
      toast.error('AI service is not configured. Please set GEMINI_API_KEY.');
      return;
    }

    const userMessage = inputMessage.trim();
    setInputMessage('');

    // Add user message to chat
    const newUserMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Prepare conversation history (last 5 messages for context)
      const conversationHistory = messages.slice(-5).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Get AI response
      const response = await aiSuggestionsAPI.getChatSuggestions(
        userMessage,
        conversationHistory
      );

      const aiData = response.data;
      
      // Add AI response to chat (conversational format)
      const aiMessage = {
        role: 'assistant',
        content: aiData.conversationalResponse || 'Here are my suggestions:',
        isConversational: aiData.isConversational || false,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('AI Chat Error:', error);
      
      const errorMessage = {
        role: 'assistant',
        content: `❌ ${error.message || 'Failed to get AI response. Please try again.'}`,
        isError: true,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = async (action) => {
    if (isLoading) return;

    const quickMessages = {
      trending: "What are the trending business types in 2026?",
      restaurant: "Suggest categories for a restaurant business",
      service: "What service-based businesses work well in marketplaces?",
      ecommerce: "Suggest product categories for an e-commerce vendor"
    };

    setInputMessage(quickMessages[action] || '');
  };

  // Format AI message content with better readability
  const formatMessageContent = (content) => {
    if (!content) return '';
    
    // Convert markdown-style formatting to HTML
    let formatted = content
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Bullet points
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/^• (.+)$/gm, '<li>$1</li>')
      // Headers
      .replace(/^### (.+)$/gm, '<h4 class="font-semibold text-base mt-3 mb-2">$1</h4>')
      .replace(/^## (.+)$/gm, '<h3 class="font-bold text-lg mt-4 mb-2">$1</h3>')
      // Line breaks
      .replace(/\n\n/g, '<br/><br/>');
    
    // Wrap consecutive <li> tags in <ul>
    formatted = formatted.replace(/(<li>.*?<\/li>[\s\S]*?<li>.*?<\/li>)/g, '<ul class="list-disc ml-5 space-y-1">$1</ul>');
    
    return formatted;
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{ 
            background: `linear-gradient(135deg, ${COLORS.adminMain} 0%, ${COLORS.secondaryMain} 100%)`,
          }}
          className="fixed bottom-6 right-6 text-white p-4 rounded-full shadow-2xl hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 group"
          title="Open AI Business Assistant"
        >
          <Sparkles className="w-6 h-6" />
          <span 
            style={{ backgroundColor: COLORS.success }}
            className="absolute -top-2 -right-2 text-white text-xs px-2 py-1 rounded-full animate-pulse font-semibold"
          >
            AI
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[440px] h-[600px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div 
            style={{ 
              background: `linear-gradient(135deg, ${COLORS.adminMain} 0%, ${COLORS.adminDark} 100%)`,
            }}
            className="text-white p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">AI Business Assistant</h3>
                <p className="text-xs opacity-90">
                  {isConfigured === false ? '⚠️ Not Configured' : 
                   isConfigured === true ? '🟢 Ready to assist' : '🔄 Checking...'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div className="p-3 border-b border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-600 mb-2">Quick Actions:</p>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => handleQuickAction('restaurant')}
                  style={{ borderColor: COLORS.adminLight, color: COLORS.adminMain }}
                  className="text-xs px-3 py-1.5 bg-white border rounded-full hover:bg-opacity-10 transition-colors font-medium"
                >
                  🍽️ Restaurant
                </button>
                <button
                  onClick={() => handleQuickAction('service')}
                  style={{ borderColor: COLORS.adminLight, color: COLORS.adminMain }}
                  className="text-xs px-3 py-1.5 bg-white border rounded-full hover:bg-opacity-10 transition-colors font-medium"
                >
                  🛠️ Services
                </button>
                <button
                  onClick={() => handleQuickAction('ecommerce')}
                  style={{ borderColor: COLORS.adminLight, color: COLORS.adminMain }}
                  className="text-xs px-3 py-1.5 bg-white border rounded-full hover:bg-opacity-10 transition-colors font-medium"
                >
                  🛒 E-commerce
                </button>
              </div>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  style={
                    message.role === 'user'
                      ? { 
                          background: `linear-gradient(135deg, ${COLORS.adminMain} 0%, ${COLORS.adminDark} 100%)`,
                          color: 'white'
                        }
                      : {}
                  }
                  className={`max-w-[85%] rounded-2xl p-4 ${
                    message.role === 'user'
                      ? 'text-white'
                      : message.isError
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-white text-gray-800 shadow-md border border-gray-100'
                  }`}
                >
                  {/* Message Content - Formatted */}
                  <div 
                    className="text-sm leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: formatMessageContent(message.content) }}
                  />
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex items-center gap-2">
                  <Loader2 style={{ color: COLORS.adminMain }} className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-gray-600">AI is thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
            {!isConfigured && isConfigured !== null && (
              <div className="mb-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>AI service not configured. Check GEMINI_API_KEY in .env</span>
              </div>
            )}
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={isConfigured === false ? "AI service not configured..." : "Ask for business suggestions..."}
                disabled={isLoading || isConfigured === false}
                style={{ 
                  borderColor: COLORS.gray200,
                  focusBorderColor: COLORS.adminMain 
                }}
                className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                onFocus={(e) => e.target.style.borderColor = COLORS.adminMain}
                onBlur={(e) => e.target.style.borderColor = COLORS.gray200}
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim() || isConfigured === false}
                style={{ 
                  background: `linear-gradient(135deg, ${COLORS.adminMain} 0%, ${COLORS.adminDark} 100%)`,
                }}
                className="text-white p-2 rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default AIBusinessAssistant;
