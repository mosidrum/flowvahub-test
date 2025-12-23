import React from 'react';
import classNames from 'classnames';
import './Card.scss';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glass' | 'outlined';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
    variant = 'default',
    padding = 'md',
    hoverable = false,
    className,
    children,
    ...props
}) => {
    return (
        <div
            className={classNames(
                'card',
                `card--${variant}`,
                `card--padding-${padding}`,
                { 'card--hoverable': hoverable },
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};
