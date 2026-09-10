import type { ReactNode } from 'react';

interface BlurFadeProps {
  children: ReactNode;
  className?: string;
}

export function BlurFade({ children, className = '' }: BlurFadeProps) {
  return <div className={`magic-blur-fade${className ? ` ${className}` : ''}`}>{children}</div>;
}
