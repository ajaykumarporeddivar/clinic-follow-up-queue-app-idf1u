import {
  Client,
  FollowUp,
  QueueItem,
  Report,
  DemoUser,
  ActivityType,
} from './types';

// Helper to generate UUID-like IDs
const generateId = (): string => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

// Helper to generate a date string within the last 12 months or next few weeks
const getRandomDate = (pastMonths: number = 12, futureWeeks: number = 4): string => {
  const now = new Date();
  const randomMs = Math.random() * (pastMonths * 30 * 24 * 60 * 60 * 1000 + futureWeeks * 7 * 24 * 60 * 60 * 1000);
  const offsetMs = Math.random() > 0.7 ? randomMs : -randomMs; // More likely to be in the past
  now.setTime(now.getTime() + offsetMs);
  return now.toISOString();
};

const getRecentDate = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
};

export const DEMO_USER: DemoUser = {
  id: 'usr-dr-olivia',
  name: 'Dr. Olivia Lee',
  email: 'olivia.lee@wellnessclinic.com',
  role: 'Clinic Director',
  plan: 'Clinic Pro',
  avatar: 'OL',
  joinedAt: '2023-08-15T10:00:00Z',
};

export const MOCK_CLIENTS: Client[] = [
  {
    id: 'cln-87c2b6e1',
    userId: DEMO_USER.id,
    name: 'Eleanor Vance',
    email: 'eleanor.vance@example.com',
    phone: '555-123-4567',
    internalId: 'CLNT-001',
    lastVisitDate: getRecentDate(25),
    notes: 'Primary focus on posture correction and general wellness check-ups.',
    status: 'active',
    createdAt: getRecentDate(180),
    updatedAt: getRecentDate(2),
  },
  {
    id: 'cln-f3a9d0c2',
    userId: DEMO_USER.id,
    name: 'Marcus Thorne',
    email: 'marcus.thorne@example.com',
    phone: '555-987-6543',
    internalId: 'CLNT-002',
    lastVisitDate: getRecentDate(40),
    notes: 'Interested in nutritional guidance and stress management techniques.',
    status: 'onboarded',
    createdAt: getRecentDate(150),
    updatedAt: getRecentDate(10),
  },
  {
    id: 'cln-e1b4a7d3',
    userId: DEMO_USER.id,
    name: 'Sophia Rodriguez',
    email: 'sophia.r@example.com',
    phone: '555-234-5678',
    internalId: 'CLNT-003',
    lastVisitDate: getRecentDate(8),
    notes: 'New client, initial consultation for chronic fatigue. Requires careful follow-up.',
    status: 'active',
    createdAt: getRecentDate(30),
    updatedAt: getRecentDate(1),
  },
  {
    id: 'cln-d5c8e2a4',
    userId: DEMO_USER.id,
    name: 'David Chung',
    email: 'david.c@example.com',
    phone: '555-876-5432',
    internalId: 'CLNT-004',
    lastVisitDate: getRecentDate(90),
    notes: 'Annual check-up due next month. Generally healthy, good adherence.',
    status: 'active',
    createdAt: getRecentDate(300),
    updatedAt: getRecentDate(5),
  },
  {
    id: 'cln-a9f2b3c5',
    userId: DEMO_USER.id,
    name: 'Isabelle Dubois',
    email: 'isabelle.d@example.com',
    phone: '555-345-6789',
    internalId: 'CLNT-005',
    lastVisitDate: getRecentDate(180),
    notes: 'Has not visited in a while. May need re-engagement outreach.',
    status: 'inactive',
    createdAt: getRecentDate(250),
    updatedAt: getRecentDate(60),
  },
  {
    id: 'cln-b6d7f8e0',
    userId: DEMO_USER.id,
    name: 'Omar Hassan',
    email: 'omar.h@example.com',
    phone: '555-456-7890',
    internalId: 'CLNT-006',
    lastVisitDate: getRecentDate(15),
    notes: 'Follow-up on recent physical therapy session. Expressed interest in meditation classes.',
    status: 'active',
    createdAt: getRecentDate(75),
    updatedAt: getRecentDate(3),
  },
];

export const MOCK_FOLLOW_UPS: FollowUp[] = [
  {
    id: 'fup-101a',
    userId: DEMO_USER.id,
    clientId: 'cln-e1b4a7d3', // Sophia Rodriguez
    type: 'check_in',
    priority: 'urgent',
    dueDate: getRandomDate(0, 0), // Today
    notes: 'Initial check-in after first consultation for chronic fatigue. Confirm symptoms and energy levels.',
    status: 'pending',
    createdAt: getRecentDate(1),
    updatedAt: getRecentDate(0),
  },
  {
    id: 'fup-102b',
    userId: DEMO_USER.id,
    clientId: 'cln-87c2b6e1', // Eleanor Vance
    type: 're_schedule',
    priority: 'high',
    dueDate: getRandomDate(0, 1), // Tomorrow
    notes: 'Eleanor requested to reschedule her next posture session. Call to confirm new slot.',
    status: 'pending',
    createdAt: getRecentDate(3),
    updatedAt: getRecentDate(1),
  },
  {
    id: 'fup-103c',
    userId: DEMO_USER.id,
    clientId: 'cln-d5c8e2a4', // David Chung
    type: 'feedback_request',
    priority: 'medium',
    dueDate: getRandomDate(0, 3), // In 3 days
    notes: 'Send survey link for feedback on last annual check-up experience.',
    status: 'pending',
    createdAt: getRecentDate(7),
    updatedAt: getRecentDate(2),
  },
  {
    id: 'fup-104d',
    userId: DEMO_USER.id,
    clientId: 'cln-b6d7f8e0', // Omar Hassan
    type: 'new_service_offer',
    priority: 'low',
    dueDate: getRandomDate(0, 7), // In 7 days
    notes: 'Offer meditation class package as discussed in last session.',
    status: 'deferred',
    createdAt: getRecentDate(10),
    updatedAt: getRecentDate(4),
  },
  {
    id: 'fup-105e',
    userId: DEMO_USER.id,
    clientId: 'cln-f3a9d0c2', // Marcus Thorne
    type: 'referral_request',
    priority: 'medium',
    dueDate: getRandomDate(1, 0), // Yesterday (overdue)
    notes: 'Follow-up on interest in referring a friend for nutritional guidance. Overdue by 1 day.',
    status: 'escalated',
    createdAt: getRecentDate(2),
    updatedAt: getRecentDate(0),
  },
  {
    id: 'fup-106f',
    userId: DEMO_USER.id,
    clientId: 'cln-a9f2b3c5', // Isabelle Dubois
    type: 'other',
    priority: 'high',
    dueDate: getRecentDate(15), // 15 days ago (completed, but for example)
    notes: 'Completed re-engagement call. Client plans to re-book next month.',
    status: 'completed',
    createdAt: getRecentDate(20),
    updatedAt: getRecentDate(15),
  },
];

export const MOCK_QUEUE_ITEMS: QueueItem[] = [
  {
    id: 'qit-001',
    userId: DEMO_USER.id,
    followUpId: 'fup-101a', // Sophia Rodriguez: Check-in
    actionRequired: 'Call Sophia Rodriguez to assess chronic fatigue symptoms.',
    dueDate: MOCK_FOLLOW_UPS[0].dueDate,
    priority: 'urgent',
    status: 'in_progress',
    notes: 'Prepared questions for fatigue assessment. Aim to complete by EOD.',
    createdAt: getRecentDate(1),
    updatedAt: getRecentDate(0),
  },
  {
    id: 'qit-002',
    userId: DEMO_USER.id,
    followUpId: 'fup-102b', // Eleanor Vance: Re-schedule
    actionRequired: 'Contact Eleanor Vance to find new appointment slot for posture session.',
    dueDate: MOCK_FOLLOW_UPS[1].dueDate,
    priority: 'high',
    status: 'ready',
    notes: 'Checked calendar, proposed two slots: Thursday 10 AM or Friday 2 PM.',
    createdAt: getRecentDate(3),
    updatedAt: getRecentDate(1),
  },
  {
    id: 'qit-003',
    userId: DEMO_USER.id,
    followUpId: 'fup-103c', // David Chung: Feedback request
    actionRequired: 'Email David Chung the feedback survey for his last visit.',
    dueDate: MOCK_FOLLOW_UPS[2].dueDate,
    priority: 'medium',
    status: 'ready',
    notes: 'Survey link prepared. Add a personal note from Dr. Lee.',
    createdAt: getRecentDate(7),
    updatedAt: getRecentDate(2),
  },
  {
    id: 'qit-004',
    userId: DEMO_USER.id,
    followUpId: 'fup-104d', // Omar Hassan: New service offer
    actionRequired: 'Draft offer for Omar Hassan regarding meditation classes. Send next week.',
    dueDate: MOCK_FOLLOW_UPS[3].dueDate,
    priority: 'low',
    status: 'on_hold',
    notes: 'Waiting for marketing team to finalize new package details.',
    createdAt: getRecentDate(10),
    updatedAt: getRecentDate(4),
  },
  {
    id: 'qit-005',
    userId: DEMO_USER.id,
    followUpId: 'fup-105e', // Marcus Thorne: Referral request
    actionRequired: 'Urgent: Follow up with Marcus Thorne on referral interest. It is past due.',
    dueDate: MOCK_FOLLOW_UPS[4].dueDate,
    priority: 'urgent',
    status: 'in_progress',
    notes: 'Left voicemail. Will try again this afternoon.',
    createdAt: getRecentDate(2),
    updatedAt: getRecentDate(0),
  },
  {
    id: 'qit-006',
    userId: DEMO_USER.id,
    followUpId: 'fup-106f', // Isabelle Dubois: Other (completed)
    actionRequired: 'Archive Isabelle Dubois re-engagement records. Client re-booked.',
    dueDate: MOCK_FOLLOW_UPS[5].dueDate,
    priority: 'low',
    status: 'completed',
    notes: 'Follow-up successfully closed. Re-booking confirmed for 2024-11-01.',
    createdAt: getRecentDate(20),
    updatedAt: getRecentDate(15),
  },
];

export const MOCK_REPORTS: Report[] = [
  {
    id: 'rep-eng-001',
    userId: DEMO_USER.id,
    name: 'Q3 Client Engagement Summary',
    description: 'Overview of client interaction and follow-up completion rates for Q3.',
    reportType: 'client_engagement',
    configuration: {
      period: 'Q3 2024',
      metrics: ['follow_up_completion', 'client_retention_rate'],
    },
    createdAt: getRecentDate(45),
    updatedAt: getRecentDate(30),
  },
  {
    id: 'rep-eff-002',
    userId: DEMO_USER.id,
    name: 'Weekly Follow-up Efficiency',
    description: 'Analysis of average time to complete follow-ups this week.',
    reportType: 'follow_up_efficiency',
    configuration: {
      period: 'Last 7 Days',
      focus: 'completion_time_by_type',
    },
    createdAt: getRecentDate(7),
    updatedAt: getRecentDate(1),
  },
  {
    id: 'rep-pbd-003',
    userId: DEMO_USER.id,
    name: 'Current Priority Breakdown',
    description: 'Distribution of pending follow-ups by priority level.',
    reportType: 'priority_breakdown',
    configuration: {
      date_scope: 'active',
      group_by: 'priority',
    },
    createdAt: getRecentDate(2),
    updatedAt: getRecentDate(0),
  },
  {
    id: 'rep-eng-004',
    userId: DEMO_USER.id,
    name: 'Client Feedback Analysis October',
    description: 'Summary of feedback collected from client surveys in October.',
    reportType: 'client_engagement',
    configuration: {
      period: 'October 2024',
      survey_id: 'S-789',
    },
    createdAt: getRecentDate(20),
    updatedAt: getRecentDate(10),
  },
  {
    id: 'rep-eff-005',
    userId: DEMO_USER.id,
    name: 'Practitioner Performance Review',
    description: 'Follow-up completion rates per practitioner.',
    reportType: 'follow_up_efficiency',
    configuration: {
      period: 'Last 30 Days',
      group_by: 'practitioner',
    },
    createdAt: getRecentDate(35),
    updatedAt: getRecentDate(5),
  },
  {
    id: 'rep-cst-006',
    userId: DEMO_USER.id,
    name: 'New Service Offer Performance',
    description: 'Tracking client responses to the new meditation class offer.',
    reportType: 'custom',
    configuration: {
      campaign_name: 'Meditation Launch',
      follow_up_type: 'new_service_offer',
    },
    createdAt: getRecentDate(10),
    updatedAt: getRecentDate(3),
  },
];

export const STATS = {
  totalFollowUps: 1247,
  followUpGrowth: '+8.2%',
  pendingToday: 18,
  pendingTodayGrowth: '-2.1%',
  overdueFollowUps: 5,
  overdueGrowth: '+15.3%',
  avgCompletionTime: '3.2 days',
  avgCompletionTimeChange: '-0.5 days',
};

export const CHART_DATA = {
  weeklyFollowUps: [42, 58, 51, 73, 88, 65, 79, 94], // New follow-ups created
  weeklyCompleted: [30, 45, 40, 60, 75, 55, 68, 80], // Follow-ups completed
  labels: ['Oct W1', 'Oct W2', 'Oct W3', 'Oct W4', 'Nov W1', 'Nov W2', 'Nov W3', 'Nov W4'],
  followUpsByStatus: [
    { name: 'Ready', value: 35 },
    { name: 'In Progress', value: 20 },
    { name: 'On Hold', value: 10 },
    { name: 'Completed', value: 120 },
  ],
};

export const RECENT_ACTIVITY: { id: string; action: string; user: string; avatar: string; time: string; type: ActivityType }[] = [
  { id: generateId(), action: 'Initiated new check-in for Sophia Rodriguez', user: DEMO_USER.name, avatar: DEMO_USER.avatar, time: '2 minutes ago', type: 'create' },
  { id: generateId(), action: 'Marked Eleanor Vance re-schedule as urgent', user: 'Dr. Marcus Thorne', avatar: 'MT', time: '1 hour ago', type: 'update' },
  { id: generateId(), action: 'Generated "Weekly Follow-up Efficiency" report', user: 'Sarah Chen', avatar: 'SC', time: '3 hours ago', type: 'generate' },
  { id: generateId(), action: 'Deferred Omar Hassan service offer to next week', user: DEMO_USER.name, avatar: DEMO_USER.avatar, time: '1 day ago', type: 'update' },
  { id: generateId(), action: 'Added new client: Isabella Dubois', user: 'Admin User', avatar: 'AU', time: '2 days ago', type: 'create' },
  { id: generateId(), action: 'Completed follow-up for Isabelle Dubois re-engagement', user: DEMO_USER.name, avatar: DEMO_USER.avatar, time: '3 days ago', type: 'complete' },
];

export function getById<T extends { id: string }>(arr: T[], id: string): T | undefined {
  return arr.find(x => x.id === id);
}