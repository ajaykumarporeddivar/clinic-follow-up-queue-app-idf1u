'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Modal,
  Badge,
  Button,
  Avatar,
  Input,
  Command,
  Kbd,
  DialogTitle,
  DialogDescription,
} from '@/components/ui';
import {
  CalendarDays,
  CheckCircle,
  Archive,
  Trash2,
  Search,
  ChevronDown,
  ChevronUp,
  User,
  Mail,
  Phone,
  Tag,
  Clock,
  ClipboardList,
  Info,
  AlertTriangle,
  CircleCheck,
} from 'lucide-react';
import { cn } from '@/components/ui';

interface EntityDetailModalProps {
  item: Record<string, unknown> | null;
  open: boolean;
  onClose: () => void;
  title: string;
}

/**
 * Formats a date string into a human-readable format.
 * @param dateString The date string to format.
 * @returns Formatted date string or original if invalid.
 */
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return dateString; // Return original if parsing fails
  }
};

/**
 * Formats a value, primarily for dates, otherwise returns as string.
 */
const formatValue = (key: string, value: unknown): React.ReactNode => {
  if (value === null || value === undefined) return 'N/A';
  if (typeof value === 'string' && (key.toLowerCase().includes('date') || key.toLowerCase().includes('at'))) {
    return formatDate(value);
  }
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  return String(value);
};

export const EntityDetailModal: React.FC<EntityDetailModalProps> = ({ item, open, onClose, title }) => {
  if (!item) return null;

  const getStatusVariant = (status: string | unknown): React.ComponentProps<typeof Badge>['variant'] => {
    const s = String(status).toLowerCase();
    switch (s) {
      case 'active':
      case 'completed':
      case 'onboarded':
      case 'ready':
      case 'in_progress':
        return 'success';
      case 'pending':
      case 'deferred':
      case 'on_hold':
      case 'escalated':
        return 'warning';
      case 'inactive':
      case 'cancelled':
        return 'danger';
      default:
        return 'default';
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <DialogTitle className="text-xl font-bold text-zinc-900 tracking-tight">{title}</DialogTitle>
            <DialogDescription className="text-zinc-600 text-sm mt-1">Detailed view of the selected record.</DialogDescription>
          </div>
          {item.status && (
            <Badge variant={getStatusVariant(item.status)}>{String(item.status).replace(/_/g, ' ')}</Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-6 text-sm">
          {Object.entries(item)
            .filter(([key]) => key !== 'id' && key !== 'userId' && key !== 'clientId' && key !== 'followUpId' && key !== 'configuration' && key !== '__typename')
            .map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <span className="font-medium text-zinc-500 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim().replace(/id$/, ' ID').replace(/at$/, '')}
                </span>
                <span className="text-zinc-800 break-words">{formatValue(key, value)}</span>
              </div>
            ))}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="success"
            onClick={() => {
              console.log(`Action: Approved item with ID: ${item.id}`);
              onClose();
            }}
            className="group"
          >
            <CheckCircle className="mr-2 h-4 w-4 text-emerald-500 group-hover:text-emerald-700" /> Approve
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              console.log(`Action: Archived item with ID: ${item.id}`);
              onClose();
            }}
            className="group"
          >
            <Archive className="mr-2 h-4 w-4 text-zinc-500 group-hover:text-zinc-700" /> Archive
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              console.log(`Action: Deleted item with ID: ${item.id}`);
              onClose();
            }}
            className="group"
          >
            <Trash2 className="mr-2 h-4 w-4 text-red-500 group-hover:text-red-700" /> Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string | React.ReactNode;
  onConfirm: () => void;
  confirmLabel?: string;
  variant?: 'danger' | 'info';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  onClose,
  title,
  message,
  onConfirm,
  confirmLabel = 'Confirm',
  variant = 'info',
}) => {
  const isDanger = variant === 'danger';
  const confirmButtonVariant = isDanger ? 'danger' : 'primary';
  const icon = isDanger ? <AlertTriangle className="h-5 w-5 text-red-500" /> : <Info className="h-5 w-5 text-zinc-500" />;

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 mb-4">
          {icon}
        </div>
        <DialogTitle className="text-lg font-bold text-zinc-900 tracking-tight mb-2">{title}</DialogTitle>
        <DialogDescription className="text-zinc-600 mb-6">{message}</DialogDescription>
        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant={confirmButtonVariant} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

interface CommandPaletteItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  description?: string;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  items: CommandPaletteItem[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ open, onClose, items }) => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setSearch('');
      setActiveItemIndex(0);
      // Timeout to ensure modal is fully rendered before focusing
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const filteredItems = items.filter(
    (item) =>
      item.label.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    setActiveItemIndex(0); // Reset active item when search changes
  }, [search]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveItemIndex((prev) => (prev + 1) % filteredItems.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveItemIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredItems[activeItemIndex]) {
            router.push(filteredItems[activeItemIndex].href);
            onClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case 'k': // Cmd+K for opening (handled in layout/parent)
          if ((e.metaKey || e.ctrlKey) && !open) {
            e.preventDefault();
          }
          break;
        default:
          break;
      }
    },
    [open, filteredItems, activeItemIndex, router, onClose]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} dialogClassName="max-w-xl">
      <Command>
        <div className="flex items-center border-b border-zinc-200 px-4 py-3">
          <Search className="mr-3 h-4 w-4 text-zinc-400" />
          <Input
            ref={inputRef}
            placeholder="Search commands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-grow border-none focus:ring-0 p-0"
          />
        </div>
        <div className="max-h-[min(50vh,300px)] overflow-y-auto p-2">
          {filteredItems.length === 0 ? (
            <div className="py-6 text-center text-sm text-zinc-500">No results found.</div>
          ) : (
            filteredItems.map((item, index) => (
              <button
                key={item.href}
                className={cn(
                  'flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm',
                  'hover:bg-zinc-100',
                  index === activeItemIndex ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-700'
                )}
                onClick={() => {
                  router.push(item.href);
                  onClose();
                }}
                onMouseEnter={() => setActiveItemIndex(index)}
              >
                {item.icon && <span className="h-4 w-4 text-zinc-500">{item.icon}</span>}
                <div className="flex-grow">
                  <div className="font-medium">{item.label}</div>
                  {item.description && <div className="text-zinc-500 text-xs">{item.description}</div>}
                </div>
              </button>
            ))
          )}
        </div>
        <div className="border-t border-zinc-200 px-4 py-2 text-right text-xs text-zinc-400">
          <Kbd>↑</Kbd> <Kbd>↓</Kbd> to navigate &middot; <Kbd>↩</Kbd> to select &middot; <Kbd>esc</Kbd> to close
        </div>
      </Command>
    </Modal>
  );
};