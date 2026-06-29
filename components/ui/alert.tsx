import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const alertVariants = cva(
  'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive:
          'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Alert = ({
  ref,
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof alertVariants> & { ref?: React.Ref<HTMLDivElement> }) => (
  <div
    ref={ref}
    role='alert'
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
);
Alert.displayName = 'Alert';

// react-doctor-disable-next-line react-doctor/no-multiple-components
const AlertTitle = ({
  ref,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & {
  ref?: React.Ref<HTMLParagraphElement>;
}) => (
  <h5
    ref={ref}
    aria-label={typeof props.children === 'string' ? props.children : 'Alert title'}
    className={cn('mb-1 font-medium leading-none tracking-tight', className)}
    {...props}
  />
);
AlertTitle.displayName = 'AlertTitle';

// react-doctor-disable-next-line react-doctor/no-multiple-components
const AlertDescription = ({
  ref,
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement> & {
  ref?: React.Ref<HTMLParagraphElement>;
}) => (
  <div
    ref={ref}
    className={cn('text-sm [&_p]:leading-relaxed', className)}
    {...props}
  />
);
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
