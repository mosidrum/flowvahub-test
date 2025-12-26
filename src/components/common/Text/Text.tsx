import React from 'react';
import classNames from 'classnames';
import './Text.scss';

type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'small';
type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';
type TextColor = 'default' | 'primary' | 'secondary' | 'white';

interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  variant?: TextVariant;
  weight?: TextWeight;
  color?: TextColor;
  gradient?: boolean;
}

export const Text: React.FC<TextProps> = ({
  as,
  variant = 'body',
  weight = 'regular',
  color = 'default',
  gradient = false,
  className,
  children,
  ...props
}) => {
  const Component = as || (variant.startsWith('h') ? variant : 'p');

  return (
    <Component
      className={classNames(
        'text',
        `text--${variant}`,
        `text--weight-${weight}`,
        `text--color-${color}`,
        { 'text--gradient': gradient },
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};
