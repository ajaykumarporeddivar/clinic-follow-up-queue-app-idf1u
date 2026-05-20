import Link from 'next/link';
import { Inter } from 'next/font/google';
import {
  ClipboardEdit,
  LayoutDashboard,
  BarChart2,
  Lock,
  Star,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  Users,
  BriefcaseBusiness,
  TrendingUp,
  Headset,
  MonitorCheck,
  CircleCheck,
  CircleArrowRight,
} from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Clinic Follow-up Queue — Boost Client Retention',
  description: 'The Clinic Follow-up Queue provides wellness clinic operators with a structured way to capture client follow-up needs, prioritize tasks on a centralized dashboard, and generate clear, exportable reports to manage repeat visits efficiently.',
};

export default function HomePage() {
  const PRODUCT