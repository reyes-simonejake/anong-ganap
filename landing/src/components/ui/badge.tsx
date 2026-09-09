import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
    'inline-flex items-center gap-1 rounded-[var(--radius-full)] px-[10px] py-[2px] text-[var(--text-xs)] font-semibold transition-colors',
    {
        variants: {
            variant: {
                default:
                    'bg-[var(--color-brand-light)] text-[var(--color-brand)]',
                accent: 'bg-[var(--color-accent-light)] text-[var(--color-accent)]',
                muted: 'bg-[var(--color-surface-muted)] text-[var(--color-text-soft)] border border-[var(--color-border)]',
                date: 'bg-[var(--color-date-ring)] text-[var(--color-date-text)]',
                hangout:
                    'bg-[var(--color-hang-ring)] text-[var(--color-hang-text)]',
                family: 'bg-[var(--color-fam-ring)] text-[var(--color-fam-text)]',
                solo: 'bg-[var(--color-solo-ring)] text-[var(--color-solo-text)]',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

export interface BadgeProps
    extends
        React.HTMLAttributes<HTMLSpanElement>,
        VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, children, ...props }: BadgeProps) {
    return (
        <span className={cn(badgeVariants({ variant }), className)} {...props}>
            {children}
        </span>
    );
}
