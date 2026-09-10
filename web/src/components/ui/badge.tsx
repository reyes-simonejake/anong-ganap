import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva('ui-badge', {
  variants: {
    variant: {
      completed: 'ui-badge--completed',
      draft: 'ui-badge--draft',
      neutral: 'ui-badge--neutral',
      scheduled: 'ui-badge--scheduled',
    },
  },
  defaultVariants: {
    variant: 'neutral',
  },
});

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
  VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ className, variant }))} {...props} />;
}

export { badgeVariants };
