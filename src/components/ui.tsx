'use client';

import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2, X, ChevronUp, ChevronDown, Plus } from 'lucide-react';
import Link from 'next/link';

export function cn(...inputs: Parameters<typeof clsx>): string {
  return twMerge(clsx(inputs));
}

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  href?: string;
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      onClick,
      className,
      href,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

    const sizeStyles = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 py-2 text-sm',
      lg: 'h-12 px-6 text-base',
    };

    const variantStyles = {
      primary: 'bg-zinc-900 text-white hover:bg-zinc-700 focus:ring-zinc-900',
      secondary: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 focus:ring-zinc-900',
      outline: 'border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 focus:ring-zinc-900',
      ghost: 'hover:bg-zinc-100 text-zinc-700 focus:ring-zinc-900',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600',
    };

    const disabledStyles = 'opacity-50 cursor-not-allowed';

    const content = (
      <>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </>
    );

    const commonProps = {
      className: cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        (disabled || loading) && disabledStyles,
        className
      ),
      onClick: loading ? undefined : onClick,
      disabled: disabled || loading,
      ...props,
    };

    if (href) {
      return (
        <Link href={href} {...(commonProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)} ref={ref as React.ForwardedRef<HTMLAnchorElement>}>
          {content}
        </Link>
      );
    }

    return (
      <button {...(commonProps as React.ButtonHTMLAttributes<HTMLButtonElement>)} ref={ref as React.ForwardedRef<HTMLButtonElement>}>
        {content}
      </button>
    );
  }
);
Button.displayName = 'Button';

// Card Components
interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export function Card({ className, children }: CardProps): JSX.Element {
  return (
    <div className={cn('bg-white border border-zinc-200 rounded-xl shadow-sm', className)}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: CardProps): JSX.Element {
  return (
    <div className={cn('flex flex-col space-y-1.5 p-6', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children }: CardProps): JSX.Element {
  return (
    <h3 className={cn('font-bold text-zinc-900 tracking-tight text-lg', className)}>
      {children}
    </h3>
  );
}

export function CardContent({ className, children }: CardProps): JSX.Element {
  return (
    <div className={cn('p-6 pt-0', className)}>
      {children}
    </div>
  );
}

// Badge Component
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple';
}

export function Badge({ children, variant = 'default' }: BadgeProps): JSX.Element {
  const baseStyles = 'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium';

  const variantStyles = {
    default: 'bg-zinc-100 text-zinc-700 ring-1 ring-inset ring-zinc-200',
    success: 'bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-200',
    warning: 'bg-amber-50 text-amber-600 ring-1 ring-inset ring-amber-200',
    error: 'bg-red-50 text-red-600 ring-1 ring-inset ring-red-200',
    info: 'bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-200',
    purple: 'bg-purple-50 text-purple-600 ring-1 ring-inset ring-purple-200',
  };

  return <span className={cn(baseStyles, variantStyles[variant])}>{children}</span>;
}

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, placeholder, value, onChange, error, type = 'text', icon, disabled, className, ...props }, ref) => {
    return (
      <div className="flex flex-col space-y-1">
        {label && (
          <label htmlFor={props.id || props.name} className="text-sm font-medium text-zinc-700">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={cn(
              'flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              icon && 'pl-10',
              error && 'border-red-500 focus-visible:ring-red-500',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

// Spinner Component
export function Spinner({ className }: { className?: string }): JSX.Element {
  return (
    <Loader2 className={cn('h-4 w-4 animate-spin text-zinc-500', className)} />
  );
}

// Avatar Component
const avatarColors = [
  'bg-red-200 text-red-800', 'bg-blue-200 text-blue-800', 'bg-green-200 text-green-800',
  'bg-yellow-200 text-yellow-800', 'bg-purple-200 text-purple-800', 'bg-indigo-200 text-indigo-800',
];

export function Avatar({ name, size = 'md', className }: { name: string; size?: 'xs' | 'sm' | 'md' | 'lg'; className?: string }): JSX.Element {
  const initials = name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
  const charCode = initials.charCodeAt(0) || 0;
  const colorClass = avatarColors[charCode % avatarColors.length];

  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
  };

  return (
    <div className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full items-center justify-center font-medium', sizeClasses[size], colorClass, className)}>
      {initials}
    </div>
  );
}

// Sparkline Component (for StatCard)
interface SparklineProps {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}

export function Sparkline({ data, color = '#6366f1', width = 40, height = 20 }: SparklineProps): JSX.Element {
  if (data.length < 2) {
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke={color} strokeWidth="1.5" />
      </svg>
    );
  }

  const maxVal = Math.max(...data);
  const minVal = Math.min(...data);

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    let y;
    if (maxVal === minVal) {
      y = height / 2; // Flat line if all values are the same
    } else {
      y = height - ((val - minVal) / (maxVal - minVal)) * height;
    }
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        points={points}
      />
    </svg>
  );
}

// StatCard Component
interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  sparkline?: number[];
}

export function StatCard({ title, value, change, changeType = 'neutral', icon, sparkline }: StatCardProps): JSX.Element {
  const changeColor = {
    up: 'text-emerald-600',
    down: 'text-red-500',
    neutral: 'text-zinc-500',
  }[changeType];

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className="text-sm font-medium text-zinc-500">{title}</div>
        {icon && <div className="text-zinc-400">{icon}</div>}
      </div>
      <div className="mt-1 text-3xl font-bold text-zinc-900 tracking-tight">{value}</div>
      <div className="mt-4 flex items-center text-sm">
        {change && (
          <div className={cn('flex items-center font-medium', changeColor)}>
            {changeType === 'up' && <ChevronUp className="h-4 w-4 mr-1" />}
            {changeType === 'down' && <ChevronDown className="h-4 w-4 mr-1" />}
            {change}
          </div>
        )}
        {sparkline && <Sparkline data={sparkline} className="ml-auto" />}
      </div>
    </Card>
  );
}

// Modal Component
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps): JSX.Element | null {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-3xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fadein">
      <div
        ref={modalRef}
        className={cn(
          'relative w-full rounded-2xl bg-white p-6 shadow-xl animate-slideup',
          sizeClasses[size]
        )}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-4">
          <h3 className="text-lg font-bold text-zinc-900 tracking-tight">{title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close modal">
            <X className="h-5 w-5 text-zinc-500" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}

// EmptyState Component
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white border border-zinc-200 rounded-xl shadow-sm">
      <div className="p-3 bg-zinc-100 rounded-lg text-zinc-500 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-zinc-900 tracking-tight mb-2">{title}</h3>
      <p className="text-sm text-zinc-600 mb-4 max-w-sm">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}

// Table Component
interface TableProps<T> {
  columns: Array<{ key: keyof T | string; label: string; render?: (row: T) => React.ReactNode }>;
  data: T[];
  onRowClick?: (row: T) => void;
}

export function Table<T extends { id?: string | number }>({ columns, data, onRowClick }: TableProps<T>): JSX.Element {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-zinc-200 shadow-sm bg-white">
      <table className="w-full text-left text-sm text-zinc-600">
        <thead className="bg-zinc-50 border-b border-zinc-200">
          <tr>
            {columns.map((column, index) => (
              <th key={column.key as string || index} scope="col" className="px-6 py-3 font-semibold text-zinc-900">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-8 text-center text-zinc-500">
                No data available.
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                className={cn(
                  'border-b border-zinc-100 last:border-0',
                  onRowClick && 'cursor-pointer hover:bg-zinc-50'
                )}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((column, colIndex) => (
                  <td key={column.key as string || colIndex} className="px-6 py-4">
                    {column.render ? column.render(row) : (row as any)[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}