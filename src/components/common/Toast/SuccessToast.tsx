import React, { useEffect, useState } from 'react';
import { Flower, Sparkles, Check } from 'lucide-react';
import './SuccessToast.scss';

interface SuccessToastProps {
    message: string;
    onClose: () => void;
}

export const SuccessToast: React.FC<SuccessToastProps> = ({ message, onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300); // Wait for exit animation
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`success-toast ${visible ? 'visible' : ''}`}>
            <div className="toast-content">
                <div className="icon-container">
                    <Check size={20} />
                </div>
                <div className="text-content">
                    <span className="title">Success!</span>
                    <span className="message">{message}</span>
                </div>
                <div className="decorations">
                    <Flower className="flower f1" size={16} />
                    <Flower className="flower f2" size={12} />
                    <Sparkles className="sparkle s1" size={14} />
                    <Sparkles className="sparkle s2" size={10} />
                </div>
            </div>
        </div>
    );
};
