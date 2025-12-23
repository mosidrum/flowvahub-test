import React from 'react';
import classNames from 'classnames';
import { Loader2 } from 'lucide-react';
import './Button.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    isLoading = false,
    leftIcon,
    rightIcon,
    className,
    children,
    disabled,
    ...props
}) => {
    return (
        <button
            className={classNames(
                'btn',
                `btn--${variant}`,
                `btn--${size}`,
                { 'btn--full-width': fullWidth },
                { 'btn--loading': isLoading },
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="btn__spinner" size={16} />}
            {!isLoading && leftIcon && <span className="btn__icon-left">{leftIcon}</span>}
            <span className="btn__content">{children}</span>
            {!isLoading && rightIcon && <span className="btn__icon-right">{rightIcon}</span>}
        </button>
    );
};
