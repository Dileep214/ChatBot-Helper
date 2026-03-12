import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, Paperclip, Mic, MicOff, X } from 'lucide-react';
import type { EmojiClickData } from 'emoji-picker-react';
import EmojiPicker, { Theme } from 'emoji-picker-react';

interface ChatInputProps {
    onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
    const [input, setInput] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [attachedFile, setAttachedFile] = useState<File | null>(null);

    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if ((input.trim() || attachedFile)) {
            let finalMessage = input.trim();
            if (attachedFile) {
                finalMessage += `\n[Attached File: ${attachedFile.name}]`;
            }
            onSendMessage(finalMessage);
            setInput('');
            setAttachedFile(null);
            setShowEmojiPicker(false);
            // Reset height
            if (textAreaRef.current) {
                textAreaRef.current.style.height = 'auto';
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const onEmojiClick = (emojiData: EmojiClickData) => {
        setInput(prev => prev + emojiData.emoji);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAttachedFile(e.target.files[0]);
        }
    };

    const toggleRecording = () => {
        if (isRecording) {
            setIsRecording(false);
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Your browser does not support voice recognition. Please try Chrome.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-IN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsRecording(true);
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInput(prev => prev + (prev ? " " : "") + transcript);
            setIsRecording(false);
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setIsRecording(false);
        };

        recognition.onend = () => {
            setIsRecording(false);
        };

        recognition.start();
    };

    // Close emoji picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Auto-resize textarea
    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = 'auto';
            textAreaRef.current.style.height = `${Math.min(textAreaRef.current.scrollHeight, 120)}px`;
        }
    }, [input]);

    return (
        <form
            onSubmit={handleSubmit}
            className="p-6 bg-white/80 backdrop-blur-md border-t border-hospital-100/50 shadow-sm relative z-20"
        >
            {/* Emoji Picker Overlay */}
            {showEmojiPicker && (
                <div ref={emojiPickerRef} className="absolute bottom-full left-6 mb-2 z-30 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
                    <EmojiPicker
                        onEmojiClick={onEmojiClick}
                        theme={Theme.LIGHT}
                        autoFocusSearch={false}
                        width={300}
                        height={400}
                    />
                </div>
            )}

            {/* Attachment Preview */}
            {attachedFile && (
                <div className="flex items-center space-x-2 mb-3 bg-hospital-50 px-3 py-1.5 rounded-full border border-hospital-100 w-fit animate-in zoom-in-95 duration-200">
                    <Paperclip size={14} className="text-hospital-500" />
                    <span className="text-xs font-medium text-hospital-700 max-w-[150px] truncate">{attachedFile.name}</span>
                    <button
                        type="button"
                        onClick={() => setAttachedFile(null)}
                        className="p-0.5 hover:bg-hospital-200 rounded-full transition-colors"
                    >
                        <X size={14} className="text-hospital-500" />
                    </button>
                </div>
            )}

            <div className="flex items-end space-x-3 bg-hospital-50/50 hover:bg-hospital-100/50 rounded-[1.5rem] px-5 py-3 transition-all focus-within:ring-2 focus-within:ring-hospital-400 focus-within:ring-offset-2 border border-hospital-100/50 min-h-[56px]">
                {/* Secondary buttons */}
                <div className="flex items-center space-x-1 md:space-x-2 md:mr-1">
                    <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className={`transition-colors p-1.5 hover:bg-white rounded-xl active:scale-90 ${showEmojiPicker ? 'text-hospital-600 bg-white' : 'text-hospital-400 hover:text-hospital-600'}`}
                        title="Add emojis"
                    >
                        <Smile size={22} strokeWidth={2} />
                    </button>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-hospital-400 hover:text-hospital-600 transition-colors p-1.5 hover:bg-white rounded-xl active:scale-90"
                        title="Attach file"
                    >
                        <Paperclip size={22} strokeWidth={2} />
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>

                {/* Visual separator */}
                <div className="w-[1px] h-6 bg-hospital-200/50 mx-1" />

                {/* Text Area Input */}
                <textarea
                    ref={textAreaRef}
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isRecording ? "Listening..." : "Message KidsCare assistant..."}
                    className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-[15px] text-hospital-800 placeholder-hospital-400/80 py-1.5 resize-none leading-relaxed min-h-[24px]"
                    aria-label="Chat input"
                />

                <div className="flex items-center space-x-2">
                    {/* Voice Input Button */}
                    <button
                        type="button"
                        onClick={toggleRecording}
                        className={`p-1.5 rounded-xl transition-all active:scale-90 ${isRecording ? 'text-red-500 bg-red-50 animate-pulse' : 'text-hospital-400 hover:text-hospital-600 hover:bg-white'}`}
                        aria-label="Voice input"
                        title={isRecording ? "Stop recording" : "Voice input"}
                    >
                        {isRecording ? <MicOff size={20} strokeWidth={2} /> : <Mic size={20} strokeWidth={2} />}
                    </button>

                    {/* Send Button */}
                    <button
                        type="submit"
                        disabled={!input.trim() && !attachedFile}
                        className={`p-3 rounded-2xl transition-all transform active:scale-95 shadow-lg group ${input.trim() || attachedFile
                            ? 'bg-gradient-to-br from-hospital-500 to-hospital-700 text-white shadow-hospital-200/50 hover:shadow-hospital-300/60'
                            : 'bg-hospital-200 text-hospital-400 cursor-not-allowed grayscale'
                            }`}
                        aria-label="Send message"
                    >
                        <Send
                            size={20}
                            strokeWidth={2.5}
                            className={`${(input.trim() || attachedFile) ? 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform' : ''}`}
                        />
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between mt-3 px-2">
                <p className="text-[10px] text-hospital-400/80 font-bold uppercase tracking-[0.2em]">
                    End-to-End Encrypted & HIPAA Compliant
                </p>
                <div className="flex space-x-3 opacity-60">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] font-bold text-hospital-400">SERVER ONLINE</span>
                </div>
            </div>
        </form>
    );
};

export default ChatInput;

