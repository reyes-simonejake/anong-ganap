import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
    // Base — maps to our design token system
    'inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                primary:
                    'bg-[var(--color-brand)] text-[var(--color-text-inverse)] hover:bg-[var(--color-brand-dark)] hover:-translate-y-px active:translate-y-0 focus-visible:ring-[var(--color-brand)]',
                ghost: 'border border-[var(--color-border-strong)] bg-transparent text-[var(--color-text)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] hover:bg-[var(--color-brand-light)] focus-visible:ring-[var(--color-brand)]',
                nav: 'bg-[var(--color-brand-light)] text-[var(--color-brand)] hover:bg-[var(--color-brand)] hover:text-[var(--color-text-inverse)] focus-visible:ring-[var(--color-brand)]',
            },
            size: {
                sm: 'h-8 rounded-[var(--radius-sm)] px-3 text-[var(--text-xs)]',
                md: 'h-10 rounded-[var(--radius-md)] px-5 text-[var(--text-sm)]',
                lg: 'h-12 rounded-[var(--radius-md)] px-6 text-[var(--text-base)] font-bold',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'lg',
        },
    }
);

export interface ButtonProps
    extends
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

export function Button({
    className,
    variant,
    size,
    children,
    ...props
}: ButtonProps) {
    return (
        <button
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        >
            {children}
        </button>
    );
}

// Export variants so anchor tags can reuse the same classes
export { buttonVariants };
