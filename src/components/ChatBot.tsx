import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Minimize2, Maximize2, Bot, User, RefreshCw, Trash2 } from 'lucide-react';



interface ChatBotProps {
  onClose: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  className?: string;
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

const SYSTEM_PROMPT = `You are an AI assistant for Anuj Dubey's portfolio website.
Your purpose is to help visitors learn more about Anuj's skills, projects, and experience.
Be concise, helpful, and friendly. If asked about topics unrelated to Anuj or his work,
politely redirect the conversation back to the portfolio.

Key information about Anuj:
- Full-stack developer with expertise in React, TypeScript, Node.js, and Next.js
- Skilled in building responsive web applications with modern UI/UX
- Experienced with various databases and API integrations
- Passionate about creating clean, efficient, and maintainable code
- Currently seeking new opportunities in web development`;

const ChatBot: React.FC<ChatBotProps> = ({
  onClose,
  isFullscreen = false,
  onToggleFullscreen,
  className = ''
}) => {
  const [messages, setMessages] = useState<Message[]>([
  {
    role: 'system',
    content: SYSTEM_PROMPT,
    timestamp: new Date()
  },
  {
    role: 'assistant',
    content: "Hi there! I'm Anuj's AI assistant. How can I help you learn more about his skills, projects, or experience?",
    timestamp: new Date()
  }]
  );
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle input height adjustment
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [input]);

  // Simple local response function for fallback
  const getLocalResponse = (message: string): string => {
    const lowercaseMessage = message.toLowerCase();

    if (lowercaseMessage.includes('hello') || lowercaseMessage.includes('hi')) {
      return "Hello! I'm Anuj's portfolio assistant. How can I help you learn about his skills and projects?";
    }

    if (lowercaseMessage.includes('skills') || lowercaseMessage.includes('technologies')) {
      return "Anuj is skilled in React, TypeScript, Node.js, Next.js, Tailwind CSS, and various other web technologies. He's particularly strong in frontend development with modern JavaScript frameworks.";
    }

    if (lowercaseMessage.includes('project') || lowercaseMessage.includes('portfolio')) {
      return "Anuj has worked on several projects including web applications, responsive websites, and interactive UIs. This portfolio itself is built with React, TypeScript, and Tailwind CSS to showcase his skills.";
    }

    if (lowercaseMessage.includes('contact') || lowercaseMessage.includes('email') || lowercaseMessage.includes('reach')) {
      return "You can contact Anuj through the contact form in this portfolio. Just click on the mail icon in the sidebar or type 'contact' in the terminal.";
    }

    if (lowercaseMessage.includes('experience') || lowercaseMessage.includes('work')) {
      return "Anuj has experience working on various web development projects, focusing on creating responsive and interactive user interfaces with modern technologies.";
    }

    return "I'm a simple assistant for Anuj's portfolio. I can tell you about his skills, projects, and experience. What would you like to know?";
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    // Add user message to chat
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Check if we have an API key
      if (!import.meta.env.VITE_OPENROUTER_API_KEY) {
        console.log("No API key found, using local fallback responses");

        // Use local fallback if no API key
        setTimeout(() => {
          const localResponse = getLocalResponse(userMessage.content);

          setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: localResponse,
            timestamp: new Date()
          }]
          );
          setIsLoading(false);
        }, 1000); // Simulate API delay

        return;
      }

      // Add a debug message to help troubleshoot
      console.log("Sending message to OpenRouter API");

      // Prepare conversation history for the API
      const conversationHistory = messages.
      filter((msg) => msg.role !== 'system').
      map((msg) => ({
        role: msg.role,
        content: msg.content
      }));

      // Add user's new message
      conversationHistory.push({
        role: userMessage.role,
        content: userMessage.content
      });

      // For debugging
      console.log("Using API Key:", import.meta.env.VITE_OPENROUTER_API_KEY ? "Key exists" : "Key missing");

      // Call OpenRouter API
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Portfolio Chatbot'
        },
        body: JSON.stringify({
          model: 'qwen/qwen3-0.6b-04-28:free', // Using a more reliable model
          messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...conversationHistory],

          temperature: 0.7,
          max_tokens: 1024
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log("API Response:", data);
      const assistantResponse = data.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a response.';

      // Add assistant response to chat
      setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date()
      }]
      );
    } catch (err) {
      console.error('Error calling AI API:', err);

      // Log the error message for debugging
      const errorDetails = err instanceof Error ? err.message : String(err);
      console.error('Error details:', errorDetails);
      setError(`Failed to get a response. Using fallback mode.`);

      // Use local fallback if API fails
      const localResponse = getLocalResponse(userMessage.content);

      setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: localResponse,
        timestamp: new Date()
      }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Clear chat history
  const handleClearChat = () => {
    setMessages([
    {
      role: 'system',
      content: SYSTEM_PROMPT,
      timestamp: new Date()
    },
    {
      role: 'assistant',
      content: "Hi there! I'm Anuj's AI assistant. How can I help you learn more about his skills, projects, or experience?",
      timestamp: new Date()
    }]
    );
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className={`flex flex-col bg-[#1e1e1e] border border-[#2d2d2d] ${
      isFullscreen ? 'fixed inset-0 z-50' : 'h-full'} ${
      className}`}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] text-white/80">
        <div className="flex items-center gap-2">
          <Bot size={18} className="text-vscode-accent" />
          <span className="text-sm font-medium">Portfolio Assistant</span>
        </div>
        <div className="flex items-center">
          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              className="p-1.5 hover:bg-[#3d3d3d] rounded-sm transition-colors"
              title={isFullscreen ? "Minimize" : "Maximize"}>

              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
            )}
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#3d3d3d] rounded-sm transition-colors ml-1"
            title="Close">

            <X size={14} />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.filter((msg) => msg.role !== 'system').map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>

            <div
              className={`max-w-[80%] rounded-lg p-3 ${
              message.role === 'user' ?
              'bg-vscode-accent/20 text-white' :
              'bg-[#2d2d2d] text-white/90'}`
              }>

              <div className="flex items-center gap-2 mb-1">
                {message.role === 'assistant' ? (
                <Bot size={16} className="text-vscode-accent" />
                ) : (
                <User size={16} className="text-green-400" />
                )}
                <span className={`text-xs ${message.role === 'user' ? 'text-green-400' : 'text-vscode-accent'}`}>
                  {message.role === 'user' ? 'You' : 'Assistant'}
                </span>
                <span className="text-xs text-white/40 ml-auto">
                  {formatTime(message.timestamp)}
                </span>
              </div>
              <div className="whitespace-pre-wrap">
                {message.content}
              </div>
            </div>
          </div>
          ))}
        {isLoading && (
            <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-[#2d2d2d] text-white/90">
              <div className="flex items-center gap-2 mb-1">
                <Bot size={16} className="text-vscode-accent" />
                <span className="text-xs text-vscode-accent">Assistant</span>
                <RefreshCw size={14} className="text-white/60 ml-2 animate-spin" />
              </div>
              <div className="flex space-x-1">
                <span className="animate-pulse">•</span>
                <span className="animate-pulse delay-100">•</span>
                <span className="animate-pulse delay-200">•</span>
              </div>
            </div>
          </div>
          )}
        {error && (
          <div className="text-red-400 text-sm p-2 bg-red-400/10 rounded-md">
            {error}
          </div>
          )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-[#2d2d2d] p-3">
        <div className="flex items-end gap-2">
          <button
            onClick={handleClearChat}
            className="p-2 text-white/40 hover:text-white/80 transition-colors"
            title="Clear chat">

            <Trash2 size={18} />
          </button>
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="w-full bg-[#2d2d2d] text-white/90 rounded-md py-2 px-3 pr-10 outline-none resize-none min-h-[40px] max-h-[120px]"
              rows={1} />

            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className={`absolute right-2 bottom-2 p-1 rounded-md ${
              input.trim() && !isLoading ?
              'text-vscode-accent hover:bg-vscode-accent/10' :
              'text-white/20'} transition-colors`
              }
              title="Send message">

              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;