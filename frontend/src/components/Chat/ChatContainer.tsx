import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShieldCheck, Stethoscope, Phone, AlertCircle, Info } from 'lucide-react';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';

export interface Message {
    role: 'user' | 'assistant';
    content: string;
    isEmergency?: boolean;
    timestamp: Date;
}

const API_BASE_URL = 'https://chatbot-helper-v5s4.onrender.com/api';

const ChatContainer: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: "Hello! I'm your Children's Hospital Assistant. I'm here to help you with any questions about our services, doctors, or general health info for your little ones. How can I help you today?",
            timestamp: new Date(),
        }
    ]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages, loading]);

    const handleSendMessage = async (content: string) => {
        const userMsg: Message = {
            role: 'user',
            content,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setLoading(true);

        try {
            const { data: apiResult } = await axios.post(`${API_BASE_URL}/chat`, { message: content });
            const { response: aiResponse, isEmergency, shouldRedirect, redirectUrl } = apiResult.data;

            // Handle automatic redirection for appointments
            if (shouldRedirect && redirectUrl) {
                window.open(redirectUrl, '_blank');
            }

            const assistantMsg: Message = {
                role: 'assistant',
                content: aiResponse,
                isEmergency,
                timestamp: new Date(),
            };


            setMessages(prev => [...prev, assistantMsg]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMsg: Message = {
                role: 'assistant',
                content: "I'm having a little trouble connecting to the hospital servers right now. Please try again or feel free to call us directly for immediate assistance.",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white/40 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-white/50 overflow-hidden relative">
            {/* Decorative elements */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-pink-400/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <header className="p-6 bg-gradient-to-r from-hospital-600 to-hospital-400 text-white relative z-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-inner">
                                <Heart className="text-white fill-white/80" size={28} />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-hospital-500 rounded-full shadow-sm" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">KidsCare Assistant</h1>
                            <div className="flex items-center text-blue-50 text-xs font-medium opacity-90">
                                <ShieldCheck size={14} className="mr-1" />
                                <span>Hospital-Verified Secure</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <a
                            href="tel:+919491649111"
                            title="Call Shankar Children's Hospital: +91 94916 49111"
                            className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all active:scale-95 border border-white/10 shadow-sm flex items-center justify-center"
                        >
                            <Phone size={20} />
                        </a>
                    </div>
                </div>

                {/* Quick actions/labels */}
                <div className="mt-5 flex space-x-2 overflow-x-auto no-scrollbar pb-1">
                    {[
                        { icon: <Stethoscope size={14} />, label: 'Find Pediatrician', query: 'Which doctors are available?' },
                        { icon: <ShieldCheck size={14} />, label: 'Vaccines', query: 'What vaccines do you provide?' },
                        { icon: <Info size={14} />, label: 'Visiting Hours', query: 'What are the hospital timings?' }
                    ].map((item, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSendMessage(item.query)}
                            className="flex items-center space-x-1.5 whitespace-nowrap bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-full text-[12px] font-semibold border border-white/10 transition-all active:scale-95"
                        >
                            {item.icon} <span className="opacity-95">{item.label}</span>
                        </button>
                    ))}
                </div>
            </header>

            {/* Message Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar relative"
            >
                <AnimatePresence mode="popLayout">
                    {messages.map((msg, idx) => (
                        <MessageBubble key={idx} message={msg} />
                    ))}

                    {loading && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex items-start space-x-3 ml-2"
                        >
                            <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center border border-hospital-100">
                                <Heart className="text-hospital-400 fill-hospital-400/20" size={16} />
                            </div>
                            <div className="bg-hospital-50/80 backdrop-blur-sm px-4 py-3 rounded-2xl rounded-tl-none border border-hospital-100">
                                <div className="flex space-x-1.5 h-4 items-center">
                                    <div className="w-1.5 h-1.5 bg-hospital-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <div className="w-1.5 h-1.5 bg-hospital-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <div className="w-1.5 h-1.5 bg-hospital-400 rounded-full animate-bounce" />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Safety Banner */}
            <div className="px-6 py-2 bg-amber-50/50 border-t border-amber-100/50 flex items-center justify-center space-x-2">
                <AlertCircle size={14} className="text-amber-500 shrink-0" />
                <p className="text-[11px] text-amber-700 font-medium">
                    In case of a medical emergency, please dial 911 immediately.
                </p>
            </div>

            {/* Input Area */}
            <ChatInput onSendMessage={handleSendMessage} />
        </div>
    );
};

export default ChatContainer;
