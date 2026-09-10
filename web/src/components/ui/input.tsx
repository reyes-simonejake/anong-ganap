import { forwardRef, type InputHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input className={cn('ui-input', className)} ref={ref} type={type} {...props} />
  ),
);

Input.displayName = 'Input';
