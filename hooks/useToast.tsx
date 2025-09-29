
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    addToast: (message: string, type: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: number) => {
        setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
    }, []);

    const addToast = useCallback((message: string, type: ToastType, duration = 5000) => {
        const id = Date.now();
        setToasts(currentToasts => [...currentToasts, { id, message, type }]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    }, [removeToast]);

    const getBackgroundColor = (type: ToastType) => {
        switch (type) {
            case 'success': return 'bg-green-600';
            case 'error': return 'bg-red-600';
            case 'warning': return 'bg-yellow-500';
            case 'info': return 'bg-blue-500';
        }
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed bottom-5 right-5 z-[100] space-y-3 w-80">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`${getBackgroundColor(toast.type)} text-white p-4 rounded-lg shadow-lg flex items-center justify-between animate-fade-in-right`}
                    >
                        <span>{toast.message}</span>
                        <button onClick={() => removeToast(toast.id)} className="ml-4 text-xl font-bold">&times;</button>
                    </div>
                ))}
            </div>
             <style>{`
                @keyframes fade-in-right {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                .animate-fade-in-right {
                    animation: fade-in-right 0.3s ease-out forwards;
                }
            `}</style>
        </ToastContext.Provider>
    );
};

export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
