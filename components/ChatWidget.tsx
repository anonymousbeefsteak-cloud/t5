import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { getAiChatResponse } from '../services/aiService';
import { ChatMessage } from '../types';
import { useToast } from '../hooks/useToast';
import LoadingSpinner from './common/LoadingSpinner';

const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const SendIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
    </svg>
);

const TypingIndicator = () => (
    <div className="flex items-center space-x-1 p-3">
        <div className="w-2 h-2 bg-brand-gold rounded-full animate-pulse [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-brand-gold rounded-full animate-pulse [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-brand-gold rounded-full animate-pulse"></div>
    </div>
);

const ChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userInput, setUserInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 0, text: "Welcome to Steakhouse Supreme! How can I help you today? Feel free to ask about our menu, delivery times, or special offers.", sender: 'ai' }
    ]);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const { addToast } = useToast();

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const trimmedInput = userInput.trim();
        if (!trimmedInput || isLoading) return;

        const newUserMessage: ChatMessage = {
            id: Date.now(),
            text: trimmedInput,
            sender: 'user',
        };
        const newHistory = [...messages, newUserMessage];
        setMessages(newHistory);
        setUserInput('');
        setIsLoading(true);

        try {
            const aiResponse = await getAiChatResponse(newHistory);
            const newAiMessage: ChatMessage = {
                id: Date.now() + 1,
                text: aiResponse,
                sender: 'ai',
            };
            setMessages(prev => [...prev, newAiMessage]);
        } catch (error) {
            addToast("Failed to get AI response.", 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className={`fixed bottom-5 right-5 z-[90] transition-all duration-300 ${isOpen ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-brand-gold text-brand-dark rounded-full p-4 shadow-lg hover:bg-yellow-500 transform hover:scale-110 transition-all"
                    aria-label="Open chat"
                >
                    <ChatIcon />
                </button>
            </div>

            <div className={`fixed bottom-5 right-5 z-[90] w-[calc(100%-40px)] max-w-sm h-[70vh] max-h-[600px] flex flex-col bg-brand-gray shadow-2xl rounded-lg border border-brand-gold/20 transition-all duration-300 origin-bottom-right ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
                <header className="flex items-center justify-between p-4 bg-brand-dark rounded-t-lg border-b border-brand-gold/20">
                    <h3 className="text-xl font-serif text-brand-gold">AI Assistant</h3>
                    <button onClick={() => setIsOpen(false)} className="text-brand-light hover:text-brand-gold" aria-label="Close chat">
                        <CloseIcon />
                    </button>
                </header>

                <div ref={chatContainerRef} className="flex-1 p-4 space-y-4 overflow-y-auto">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-lg px-4 py-2 ${msg.sender === 'user' ? 'bg-brand-gold text-brand-dark' : 'bg-brand-dark text-brand-light'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                             <div className="max-w-[80%] rounded-lg px-4 py-2 bg-brand-dark text-brand-light">
                                <TypingIndicator />
                             </div>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="p-4 border-t border-brand-gold/20 flex items-center gap-2 bg-brand-dark rounded-b-lg">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Ask a question..."
                        className="flex-1 bg-brand-gray border border-gray-600 rounded-full py-2 px-4 text-brand-light focus:ring-brand-gold focus:border-brand-gold"
                        disabled={isLoading}
                    />
                    <button type="submit" className="bg-brand-gold text-brand-dark rounded-full p-3 hover:bg-yellow-500 disabled:opacity-50" disabled={isLoading}>
                        <SendIcon />
                    </button>
                </form>
            </div>
        </>
    );
};

export default ChatWidget;