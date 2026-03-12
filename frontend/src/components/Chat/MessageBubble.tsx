import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, User, Heart } from 'lucide-react';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export interface Message {
    role: 'user' | 'assistant';
    content: string;
    isEmergency?: boolean;
    timestamp: Date;
}

interface MessageBubbleProps {
    message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const isUser = message.role === 'user';
    const timeStr = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className={`flex w-full mb-6 ${isUser ? 'justify-end pl-12' : 'justify-start pr-12'}`}
        >
            <div className={`flex items-end max-w-full ${isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row space-x-3'}`}>
                {/* Avatar section */}
                <div className={`flex-shrink-0 h-10 w-10 rounded-2xl flex items-center justify-center shadow-lg border-2 transition-transform hover:scale-105 ${isUser
                        ? 'bg-gradient-to-br from-hospital-500 to-hospital-700 border-white/20'
                        : 'bg-white border-hospital-100'
                    }`}>
                    {isUser ? (
                        <User size={22} className="text-white" />
                    ) : (
                        <Heart size={21} className="text-hospital-500 fill-hospital-400/20" />
                    )}
                </div>

                {/* Message Content Container */}
                <div className="flex flex-col space-y-1.5 min-w-0">
                    <div className={`relative px-5 py-3.5 rounded-[1.5rem] shadow-xl border transition-all hover:shadow-2xl ${isUser
                            ? 'bg-gradient-to-br from-hospital-600 to-hospital-400 text-white rounded-tr-none border-hospital-300/30'
                            : message.isEmergency
                                ? 'bg-gradient-to-br from-red-50 to-white border-red-200 text-red-900 rounded-tl-none ring-4 ring-red-500/10'
                                : 'bg-white text-hospital-800 rounded-tl-none border-hospital-100/50 backdrop-blur-sm'
                        }`}>

                        {message.isEmergency && (
                            <div className="flex items-center mb-2 font-bold text-red-600 text-[11px] tracking-wider uppercase bg-red-100/50 w-fit px-2 py-0.5 rounded-md">
                                <AlertTriangle size={14} className="mr-1.5" />
                                Urgent: Emergency Notice
                            </div>
                        )}

                        <div className={`markdown-content text-[15px] leading-relaxed font-medium ${isUser ? 'text-white' : 'text-hospital-800'}`}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {message.content}
                            </ReactMarkdown>
                        </div>

                        {/* Decorative background pattern for assistant messages */}
                        {!isUser && !message.isEmergency && (
                            <div className="absolute top-0 right-0 p-1 opacity-[0.03] pointer-events-none select-none">
                                <Heart size={40} className="fill-hospital-900" />
                            </div>
                        )}
                    </div>

                    {/* Timestamp */}
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 ${isUser ? 'text-right text-hospital-400' : 'text-left text-hospital-300'}`}>
                        {timeStr}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default MessageBubble;
