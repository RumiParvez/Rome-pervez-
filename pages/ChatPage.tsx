
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { generateResponse, generateImage } from '../services/geminiService';
import { adminService } from '../services/adminService';
import { firebaseService } from '../services/firebaseService';
import { ChatSession, ChatMessage, Role } from '../types';
import { IconLogo, IconBot, IconSend, IconPlus, IconImage, IconMic, IconTrash, IconUser, IconCopy, IconVolume, IconBranch, IconRefresh, IconThumbsUp, IconThumbsDown, IconCheck, IconStop, IconPalette, IconZap, IconLock, IconBell, IconDownload, IconMenu, IconCode } from '../components/Icons';
import { APP_NAME, SAMPLE_QUESTIONS } from '../constants';
import { Navigate } from 'react-router-dom';

// Helper component to render Markdown-like content (Code blocks & Bold)
const MessageContent: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(/(```[\s\S]*?```|\*\*.*?\*\*)/g);

  return (
    <div className="text-sm md:text-base leading-relaxed break-words whitespace-pre-wrap w-full min-w-0">
      {parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          // Code Block
          const content = part.slice(3, -3).replace(/^[a-z]+\n/, ''); // remove language tag if simple
          const language = part.match(/^```([a-z]+)/)?.[1] || 'Code';
          return (
            <div key={index} className="my-4 rounded-lg overflow-hidden bg-gray-950 border border-gray-800 w-full max-w-full">
              <div className="flex justify-between items-center px-4 py-2 bg-gray-900 border-b border-gray-800 text-xs text-gray-400">
                <span className="uppercase font-mono truncate">{language}</span>
                <button 
                    onClick={() => navigator.clipboard.writeText(content)}
                    className="hover:text-white transition-colors flex-shrink-0 ml-2"
                >
                    Copy
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-green-50 font-mono text-sm custom-scroll w-full">
                <code>{content}</code>
              </pre>
            </div>
          );
        } else if (part.startsWith('**') && part.endsWith('**')) {
          // Bold Text
          return <strong key={index} className="text-white font-bold">{part.slice(2, -2)}</strong>;
        }
        // Regular Text
        return <span key={index}>{part}</span>;
      })}
    </div>
  );
};

export const ChatPage: React.FC = () => {
  const { user, deductTokens, isLoading: isAuthLoading } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default closed on mobile
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [isImageGenMode, setIsImageGenMode] = useState(false);
  const [isCodingMode, setIsCodingMode] = useState(false);
  const [systemAlert, setSystemAlert] = useState<string | null>(null);
  const [isMaintenance, setIsMaintenance] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Default sidebar state based on screen width
  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth >= 768) {
            setIsSidebarOpen(true);
        } else {
            setIsSidebarOpen(false);
        }
    };
    handleResize(); // Init
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check Admin Settings
  useEffect(() => {
      const checkSettings = async () => {
          const settings = await adminService.getSettings();
          setSystemAlert(settings.globalAlert);
          setIsMaintenance(settings.maintenanceMode);
      };
      
      checkSettings();
      const interval = setInterval(checkSettings, 10000); // Polling slower for Firestore
      return () => clearInterval(interval);
  }, []);

  // Load chats from Firebase
  useEffect(() => {
    const loadChats = async () => {
        if (user) {
            const remoteChats = await firebaseService.getUserChats(user.id);
            setSessions(remoteChats);
        }
    };
    loadChats();
  }, [user]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessions, currentSessionId, isLoading]);

  useEffect(() => {
    return () => {
        window.speechSynthesis.cancel();
    };
  }, []);

  // --- Helper to save specific session to Firebase ---
  const saveSessionToFirebase = async (session: ChatSession) => {
      if (!user) return;
      await firebaseService.saveChat(user.id, session);
  };

  if (isAuthLoading) {
      return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Loading...</div>;
  }

  if (!user) {
      return <Navigate to="/login" replace />;
  }

  if (isMaintenance && !user.isAdmin) {
      return (
          <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-center px-4">
              <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mb-6 border border-red-900/50">
                  <IconLock className="w-10 h-10 text-red-500" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Under Maintenance</h1>
              <p className="text-gray-400 max-w-md">
                  We are currently performing scheduled maintenance to improve {APP_NAME}. Please check back shortly.
              </p>
          </div>
      );
  }

  if (user.subscriptionPlan === 'none' && !user.isAdmin) {
      return <Navigate to="/pricing" replace />;
  }

  const getCurrentSession = () => sessions.find(s => s.id === currentSessionId);

  const createNewChat = () => {
    const newSession: ChatSession = {
      id: user.id + '_' + Date.now().toString(), // Ensure unique ID per user
      title: 'New Chat',
      messages: [],
      updatedAt: Date.now(),
      userId: user.id
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setInput('');
    setSelectedImage(null);
    setIsImageGenMode(false);
    setIsCodingMode(false);
    if (window.innerWidth < 768) setIsSidebarOpen(false); // Close sidebar on mobile on new chat
  };

  const deleteChat = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSessions(prev => prev.filter(s => s.id !== id));
    if (currentSessionId === id) setCurrentSessionId(null);
    await firebaseService.deleteChat(id);
  };

  const selectSession = (id: string) => {
      setCurrentSessionId(id);
      if (window.innerWidth < 768) setIsSidebarOpen(false); // Close sidebar on mobile selection
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
          alert("Image is too large. Please select an image under 1MB.");
          return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVoiceInput = () => {
     if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
         const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
         const recognition = new SpeechRecognition();
         recognition.lang = 'en-US';
         recognition.start();
         
         recognition.onresult = (event: any) => {
             const transcript = event.results[0][0].transcript;
             setInput(prev => prev + (prev ? ' ' : '') + transcript);
         };
         
         recognition.onerror = (event: any) => {
             alert("Microphone access denied or error occurred.");
         };
     } else {
         alert("Voice input is not supported in this browser.");
     }
  };

  const handleCopy = (text: string, id: string) => {
      navigator.clipboard.writeText(text).then(() => {
          setCopiedMessageId(id);
          setTimeout(() => setCopiedMessageId(null), 2000);
      });
  };

  const handleSpeak = (text: string, id: string) => {
      if (speakingMessageId === id) {
          window.speechSynthesis.cancel();
          setSpeakingMessageId(null);
          return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setSpeakingMessageId(null);
      utterance.onerror = () => setSpeakingMessageId(null);
      speechRef.current = utterance;
      
      setSpeakingMessageId(id);
      window.speechSynthesis.speak(utterance);
  };

  const handleDownloadImage = (imageUrl: string, timestamp: number) => {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `openyhool-gen-${timestamp}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const handleBranch = (messageId: string) => {
      const currentSession = getCurrentSession();
      if (!currentSession) return;

      const msgIndex = currentSession.messages.findIndex(m => m.id === messageId);
      if (msgIndex === -1) return;

      const slicedMessages = currentSession.messages.slice(0, msgIndex + 1);
      
      const newSession: ChatSession = {
          id: user.id + '_' + Date.now().toString(),
          title: `Branch: ${currentSession.title}`,
          messages: slicedMessages,
          updatedAt: Date.now(),
          userId: user.id
      };

      setSessions(prev => [newSession, ...prev]);
      setCurrentSessionId(newSession.id);
      saveSessionToFirebase(newSession);
  };

  // Define handleImageGeneration first as it's used by processStream
  const handleImageGeneration = async (sessionId: string, promptText: string) => {
      setIsLoading(true);
      const botMessageId = (Date.now() + 1).toString();
      const placeholderMessage: ChatMessage = { id: botMessageId, role: Role.MODEL, text: "Generating image...", timestamp: Date.now() };

      setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, messages: [...s.messages, placeholderMessage] } : s));

      try {
          const imageUrl = await generateImage(promptText);
          setSessions(prev => {
              const updated = prev.map(s => {
                  if (s.id !== sessionId) return s;
                  return {
                      ...s,
                      messages: s.messages.map(msg => {
                          if (msg.id !== botMessageId) return msg;
                          return {
                              ...msg,
                              text: `Generated image for: "${promptText}"`,
                              image: imageUrl
                          };
                      })
                  };
              });
              
              const session = updated.find(s => s.id === sessionId);
              if (session) saveSessionToFirebase({ ...session, updatedAt: Date.now() });
              return updated;
          });
      } catch (error) {
           setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, messages: s.messages.map(msg => msg.id === botMessageId ? { ...msg, text: `Sorry, I failed to generate an image. Reason: ${(error as Error).message}` } : msg) } : s));
      } finally {
          setIsLoading(false);
      }
  };

  const processStream = async (sessionId: string, messagesContext: ChatMessage[], promptText: string, promptImage?: string, mode: 'chat' | 'coding' = 'chat') => {
      setIsLoading(true);
      try {
          const stream = await generateResponse(messagesContext, promptText, promptImage, mode);
          let fullResponse = "";
          const botMessageId = (Date.now() + 1).toString();
          const botMessage: ChatMessage = { id: botMessageId, role: Role.MODEL, text: "", timestamp: Date.now() };
          
          setSessions(prev => {
              const updated = prev.map(s => s.id === sessionId ? { ...s, messages: [...messagesContext, botMessage] } : s);
              // Optimistic local update, explicit save at end
              return updated;
          });

          for await (const chunk of stream) {
            fullResponse += chunk;
            if (fullResponse.includes('[GENERATE_IMAGE]')) {
                setIsImageGenMode(true);
                // Revert bot message for text, switch mode
                setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, messages: messagesContext } : s));
                await handleImageGeneration(sessionId, promptText);
                return;
            }
            setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, messages: s.messages.map(msg => msg.id === botMessageId ? { ...msg, text: fullResponse } : msg) } : s));
          }
          
          // Save complete session to Firebase after generation is done
          setSessions(prev => {
              const session = prev.find(s => s.id === sessionId);
              if (session) {
                 const updatedSession = { ...session, updatedAt: Date.now() };
                 saveSessionToFirebase(updatedSession);
              }
              return prev;
          });

      } catch (error) {
          console.error(error);
          const errorMessage: ChatMessage = { id: Date.now().toString(), role: Role.MODEL, text: "Sorry, I encountered an error.", timestamp: Date.now() };
           setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, messages: [...messagesContext, errorMessage] } : s));
      } finally {
          setIsLoading(false);
      }
  };

  const handleRegenerate = async () => {
      const currentSession = getCurrentSession();
      if (!currentSession || isLoading) return;

      const messages = currentSession.messages;
      if (messages.length === 0) return;

      let lastUserMsgIndex = -1;
      for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].role === Role.USER) {
          lastUserMsgIndex = i;
          break;
        }
      }

      if (lastUserMsgIndex === -1) return;

      const lastUserMsg = messages[lastUserMsgIndex];
      const newContext = messages.slice(0, lastUserMsgIndex + 1);
      
      setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, messages: newContext } : s));

      if (isImageGenMode) {
          await handleImageGeneration(currentSessionId!, lastUserMsg.text);
      } else {
          // Use current mode state for regenerate
          const mode = isCodingMode ? 'coding' : 'chat';
          await processStream(currentSessionId!, newContext, lastUserMsg.text, lastUserMsg.image, mode);
      }
  };

  const toggleImageGenMode = () => {
      if (!user?.isPro) {
          alert("Image Generation is a Pro feature. Please upgrade to use it.");
          return;
      }
      setIsImageGenMode(!isImageGenMode);
      if (!isImageGenMode) setIsCodingMode(false); // Mutually exclusive
      setSelectedImage(null);
  };

  const toggleCodingMode = () => {
      if (!user?.isPro) {
          alert("Coding Assistant is a Pro feature. Please upgrade to use it.");
          return;
      }
      setIsCodingMode(!isCodingMode);
      if (!isCodingMode) setIsImageGenMode(false); // Mutually exclusive
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!input.trim() && !selectedImage) || isLoading) return;

    if (!deductTokens(10)) {
        alert("You have run out of free tokens! Please upgrade to continue.");
        return;
    }

    let activeSessionId = currentSessionId;
    let activeSession = getCurrentSession();

    if (!activeSessionId || !activeSession) {
        const newSession: ChatSession = {
            id: user.id + '_' + Date.now().toString(),
            title: input.slice(0, 30) || 'New Conversation',
            messages: [],
            updatedAt: Date.now(),
            userId: user.id
        };
        setSessions(prev => [newSession, ...prev]);
        setCurrentSessionId(newSession.id);
        activeSessionId = newSession.id;
        activeSession = newSession;
    }

    const userMessage: ChatMessage = { id: Date.now().toString(), role: Role.USER, text: input, timestamp: Date.now(), image: selectedImage || undefined };

    const updatedMessages = [...(activeSession?.messages || []), userMessage];
    setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, messages: updatedMessages, title: s.messages.length === 0 ? input.slice(0, 30) : s.title } : s));
    
    setInput('');
    setSelectedImage(null);

    if (isImageGenMode) {
        await handleImageGeneration(activeSessionId, userMessage.text);
    } else {
        const mode = isCodingMode ? 'coding' : 'chat';
        await processStream(activeSessionId, updatedMessages, userMessage.text, userMessage.image, mode);
    }
  };

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-gray-950 relative">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
      )}

      {/* Sidebar - Responsive Drawer */}
      <div className={`
          fixed md:relative inset-y-0 left-0 z-40 
          w-72 md:w-64 bg-gray-950 border-r border-gray-800 
          transform transition-transform duration-300 ease-in-out flex flex-col
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          md:flex-shrink-0
      `}>
        <div className="p-4 flex items-center justify-between">
            <button 
              onClick={createNewChat} 
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-lg p-3 transition-colors border border-green-500 shadow-lg shadow-green-500/20 font-medium text-sm"
            >
              <IconPlus className="w-4 h-4" /> New Chat
            </button>
            {/* Close button for mobile */}
            <button onClick={() => setIsSidebarOpen(false)} className="ml-2 md:hidden p-2 text-gray-400 hover:text-white">
                <IconPlus className="w-5 h-5 rotate-45" />
            </button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scroll px-2 space-y-2">
           <div className="text-xs font-semibold text-gray-500 px-2 py-2 uppercase tracking-wider">History</div>
           {sessions.map(session => (
             <div 
               key={session.id}
               onClick={() => selectSession(session.id)}
               className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${currentSessionId === session.id ? 'bg-gray-800 text-white border border-gray-700' : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200 border border-transparent'}`}
             >
                <div className="flex items-center gap-3 overflow-hidden">
                    <IconLogo className={`w-4 h-4 flex-shrink-0 ${currentSessionId === session.id ? 'text-green-500' : 'text-gray-600'}`} />
                    <span className="truncate text-sm font-medium">{session.title || 'Untitled Chat'}</span>
                </div>
                <button 
                  onClick={(e) => deleteChat(e, session.id)} 
                  className="md:opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-opacity"
                >
                    <IconTrash className="w-3 h-3" />
                </button>
             </div>
           ))}
        </div>

        {/* Global Navigation in Sidebar (Chat Page Only) */}
        <div className="px-3 py-2 border-t border-gray-800 bg-gray-900/30">
            <div className="text-xs font-semibold text-gray-500 px-2 mb-2 uppercase tracking-wider">Navigation</div>
            <a href="#/" className="block px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">Home</a>
            <a href="#/pricing" className="block px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">Pricing</a>
            <a href="#/about" className="block px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">About</a>
            <a href="#/admin" className="block px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-colors">Admin Panel</a>
        </div>

        <div className="p-4 border-t border-gray-800 bg-gray-900/50">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                        <IconUser className="w-4 h-4" />
                        <span className="truncate font-semibold">{user.name}</span>
                </div>
                <div className="text-xs text-gray-500 flex justify-between">
                        <span>Tokens:</span>
                        <span className={user.isPro ? "text-yellow-400 font-bold" : "text-green-400 font-bold"}>
                            {user.isPro ? "Unlimited" : user.tokens}
                        </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                    Plan: <span className="capitalize text-white font-medium">{user.subscriptionPlan}</span>
                </div>
            </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative w-full min-w-0">
        {/* Mobile Header with Sidebar Toggle */}
        <div className="md:hidden flex items-center justify-between p-4 bg-gray-950 border-b border-gray-800">
             <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-gray-400 hover:text-white">
                 <IconMenu className="w-6 h-6" />
             </button>
             <span className="font-semibold text-white truncate max-w-[200px]">{getCurrentSession()?.title || 'New Chat'}</span>
             <div className="w-6"></div> {/* Spacer for alignment */}
        </div>

        {/* Global Admin Alert */}
        {systemAlert && (
            <div className="bg-yellow-900/40 border-b border-yellow-700/50 text-yellow-200 px-4 py-2 text-sm text-center flex items-center justify-center gap-2 animate-fade-in z-10">
                <IconBell className="w-4 h-4 flex-shrink-0" />
                <span className="font-medium">System Alert:</span> {systemAlert}
            </div>
        )}

        {!getCurrentSession() ? (
            <div className="flex-1 flex flex-col items-center justify-center p-4 text-center overflow-y-auto custom-scroll">
                <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-green-500/30 animate-pulse-slow">
                    <IconLogo className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">How can I help you?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 max-w-2xl w-full">
                    {SAMPLE_QUESTIONS.map((q, i) => (
                        <button key={i} onClick={() => setInput(q)} className="p-4 bg-gray-800/50 border border-gray-700 hover:bg-gray-800 hover:border-gray-600 rounded-xl text-left text-sm text-gray-300 transition-all hover:scale-[1.02]">
                            {q}
                        </button>
                    ))}
                </div>
            </div>
        ) : (
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 custom-scroll">
                {getCurrentSession()?.messages.map((msg, index) => (
                    <div key={msg.id} className={`flex gap-3 md:gap-4 ${msg.role === Role.USER ? 'flex-row-reverse' : ''} min-w-0`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === Role.USER ? 'bg-gray-700' : 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/20'}`}>
                            {msg.role === Role.USER ? <IconUser className="w-5 h-5 text-gray-300" /> : <IconLogo className="w-5 h-5 text-white" />}
                        </div>
                        <div className={`flex flex-col max-w-[85%] md:max-w-[75%] ${msg.role === Role.USER ? 'items-end' : 'items-start'} min-w-0`}>
                            <div className={`p-4 rounded-2xl shadow-sm ${msg.role === Role.USER ? 'bg-gray-800 text-white rounded-tr-none' : 'bg-none text-gray-100 rounded-tl-none p-0'} w-full overflow-hidden`}>
                                {msg.image && (
                                    <div className="mb-2 relative group inline-block max-w-full">
                                        <img src={msg.image} alt="Attachment" className="max-w-full md:max-w-[400px] rounded-lg border border-gray-700 shadow-lg" />
                                        <button 
                                            onClick={() => handleDownloadImage(msg.image!, msg.timestamp)}
                                            className="absolute bottom-2 right-2 bg-black/70 hover:bg-black text-white p-2 rounded-lg md:opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Download Image"
                                        >
                                            <IconDownload className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                                <div className="leading-relaxed">
                                    <MessageContent text={msg.text} />
                                    {isLoading && msg.role === Role.MODEL && index === getCurrentSession()!.messages.length - 1 && !msg.text && <span className="animate-pulse">...</span>}
                                </div>
                            </div>
                            
                            {msg.role === Role.MODEL && msg.text && (
                                <div className="flex flex-wrap items-center gap-1 mt-2 text-gray-500 select-none">
                                    <button onClick={() => handleCopy(msg.text, msg.id)} className="p-1.5 rounded-md hover:bg-gray-800 hover:text-gray-300 transition-colors" title="Copy">
                                        {copiedMessageId === msg.id ? <IconCheck className="w-4 h-4 text-green-500" /> : <IconCopy className="w-4 h-4" />}
                                    </button>
                                    <button onClick={() => handleSpeak(msg.text, msg.id)} className={`p-1.5 rounded-md hover:bg-gray-800 hover:text-gray-300 transition-colors ${speakingMessageId === msg.id ? 'text-green-400' : ''}`}>
                                        {speakingMessageId === msg.id ? <IconStop className="w-4 h-4 animate-pulse" /> : <IconVolume className="w-4 h-4" />}
                                    </button>
                                    <button onClick={handleRegenerate} className="p-1.5 rounded-md hover:bg-gray-800 hover:text-gray-300 transition-colors" disabled={isLoading}>
                                        <IconRefresh className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                                    </button>
                                    <div className="w-px h-4 bg-gray-800 mx-1"></div>
                                    <button className="p-1.5 rounded-md hover:bg-gray-800 hover:text-gray-300 transition-colors"><IconThumbsUp className="w-4 h-4" /></button>
                                    <button className="p-1.5 rounded-md hover:bg-gray-800 hover:text-gray-300 transition-colors"><IconThumbsDown className="w-4 h-4" /></button>
                                    <div className="w-px h-4 bg-gray-800 mx-1 hidden sm:block"></div>
                                    <button onClick={() => handleBranch(msg.id)} className="flex items-center gap-1.5 p-1.5 rounded-md hover:bg-gray-800 hover:text-gray-300 transition-colors">
                                        <IconBranch className="w-4 h-4" />
                                        <span className="text-xs hidden sm:inline">Branch</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
        )}

        <div className="p-4 bg-gray-950 border-t border-gray-800">
           <div className="max-w-4xl mx-auto">
               {selectedImage && (
                   <div className="mb-2 relative inline-block">
                       <img src={selectedImage} alt="Preview" className="h-16 rounded-lg border border-gray-700" />
                       <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white hover:bg-red-600 shadow-md">
                           <IconPlus className="w-3 h-3 rotate-45" />
                       </button>
                   </div>
               )}
               <form onSubmit={handleSubmit} className={`relative flex items-center gap-2 border rounded-2xl p-2 shadow-lg transition-all ${
                   isImageGenMode ? 'bg-purple-900/10 border-purple-500/50' : 
                   isCodingMode ? 'bg-orange-900/10 border-orange-500/50' :
                   'bg-gray-800 border-gray-700 focus-within:ring-2 focus-within:ring-green-500/50 focus-within:border-green-500'
               }`}>
                   {isImageGenMode && (
                        <div className="flex items-center px-2 flex-shrink-0">
                             <IconZap className="w-5 h-5 text-purple-400 mr-2 animate-pulse" />
                             <span className="text-xs font-bold text-purple-400 uppercase tracking-wider hidden sm:block">Image Gen</span>
                        </div>
                   )}
                   {isCodingMode && (
                        <div className="flex items-center px-2 flex-shrink-0">
                             <IconCode className="w-5 h-5 text-orange-400 mr-2 animate-pulse" />
                             <span className="text-xs font-bold text-orange-400 uppercase tracking-wider hidden sm:block">Coding Mode</span>
                        </div>
                   )}
                   
                   {!isImageGenMode && !isCodingMode && (
                       <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl transition-colors flex-shrink-0">
                            <IconImage className="w-5 h-5" />
                        </button>
                   )}

                   <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageSelect} />
                   
                   {/* Coding Mode Toggle */}
                   <button 
                        type="button" 
                        onClick={toggleCodingMode} 
                        title={user.isPro ? "Toggle Coding Mode" : "Upgrade to use Coding Assistant"} 
                        className={`p-2 rounded-xl transition-colors flex-shrink-0 ${isCodingMode ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30' : 'text-gray-400 hover:text-orange-400 hover:bg-gray-700'}`}
                   >
                       <IconCode className="w-5 h-5" />
                   </button>

                   {/* Image Mode Toggle */}
                   <button 
                        type="button" 
                        onClick={toggleImageGenMode} 
                        title={user.isPro ? "Toggle Image Generation" : "Upgrade to use Image Gen"} 
                        className={`p-2 rounded-xl transition-colors flex-shrink-0 ${isImageGenMode ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'text-gray-400 hover:text-purple-400 hover:bg-gray-700'}`}
                   >
                       <IconPalette className="w-5 h-5" />
                   </button>
                   
                   <input 
                        type="text" 
                        value={input} 
                        onChange={(e) => setInput(e.target.value)} 
                        placeholder={isImageGenMode ? "Describe image..." : isCodingMode ? "Describe code to generate..." : `Message ${APP_NAME}...`} 
                        className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 h-10 px-2 min-w-0" 
                   />
                   
                   {!isImageGenMode && !isCodingMode && (
                        <button type="button" onClick={handleVoiceInput} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl transition-colors flex-shrink-0 hidden sm:block">
                            <IconMic className="w-5 h-5" />
                        </button>
                   )}
                   
                   <button type="submit" disabled={isLoading || (!input.trim() && !selectedImage)} className={`p-2 rounded-xl transition-all flex-shrink-0 ${
                       isImageGenMode ? (input.trim() ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gray-700 text-gray-500') : 
                       isCodingMode ? (input.trim() ? 'bg-orange-600 text-white hover:bg-orange-700' : 'bg-gray-700 text-gray-500') :
                       (input.trim() || selectedImage ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-700 text-gray-500')
                   }`}>
                       <IconSend className="w-5 h-5" />
                   </button>
               </form>
               <p className="text-center text-xs text-gray-500 mt-2 truncate">
                   {isImageGenMode ? "Pro feature: Generates Square (1:1) images." : isCodingMode ? "Pro feature: Optimized for clean code generation." : `${APP_NAME} can make mistakes. Check important info.`}
               </p>
           </div>
        </div>
      </div>
    </div>
  );
};
