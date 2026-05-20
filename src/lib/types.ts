export interface Client {
  id: string;
  userId: string;
  name: string;
  email: string | null;
  phone: string | null;
  internalId: string | null;
  lastVisitDate: string | null;
  notes: string | null;
  status: 'active' | 'inactive' | 'onboarded';
  createdAt: string;
  updatedAt: string;
}

export interface FollowUp {
  id: string;
  userId: string;
  clientId: string;
  type: 'check_in' | 're_schedule' | 'feedback_request' | 'new_service_offer' | 'referral_request' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  notes: string | null;
  status: 'pending' | 'completed' | 'cancelled' | 'escalated' | 'deferred';
  createdAt: string;
  updatedAt: string;
}

export interface QueueItem {
  id: string;
  userId: string;
  followUpId: string;
  actionRequired: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'ready' | 'in_progress' | 'on_hold' | 'completed' | 'deferred';
  notes: string | null;
  createdAt: string;
  updatedAt: string; // Added missing 'updatedAt' based on other interfaces
}

export interface Activity {
  id: string;
  userId: string;
  type: 'follow_up_created' | 'client_onboarded' | 'queue_item_completed' | 'report_generated';
  description: string;
  timestamp: string;
  relatedEntityId: string;
}

export interface Report {
  id: string;
  userId: string;
  name: string;
  type: 'client_summary' | 'follow_up_status' | 'queue_efficiency' | 'roi_overview';
  generatedDate: string;
  data: Record<string, any>; // Flexible for different report types
  status: 'draft' | 'finalized' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: string;
  plan: string;
  avatar: string; // Initials or URL
  joinedAt: string;
}

export interface Stat {
  label: string;
  value: number;
  change: number; // Percentage change
  sparklineData: number[]; // For mini charts
}

export interface ChartData {
  weekly: number[];
  labels: string[];
}