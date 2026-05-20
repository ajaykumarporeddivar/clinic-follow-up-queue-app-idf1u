'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  MOCK_CLIENTS,
  MOCK_FOLLOW_UPS,
  MOCK_QUEUE_ITEMS,
  RECENT_ACTIVITY,
  DEMO_USER,
  // Assuming these are available from '@/lib/data' based on prompt
  STATS, // Array of { label: string; value: number; change: number; sparklineData: number[] }
  CHART_DATA, // { weekly: number[]; labels: string[] }
} from '@/lib/data';
import { formatDate, formatCurrency } from '@/lib/utils';
import {
  StatCard,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Avatar,
  Table,
  Button,
  Input,
  cn,
} from '@/components/ui';
import { AppHeader } from '@/components/layout'; // Assuming AppHeader is available
import { BarChart, Sparkline } from '@/components/charts'; // Assuming charts are available
import { Search, Download } from 'lucide-react';
import type { Client, FollowUp, QueueItem } from '@/lib/types';

interface EnrichedQueueItem extends QueueItem {
  clientName: string;
  followUpType: FollowUp['type'];
  followUpPriority: FollowUp['priority'];
  followUpDueDate: string;
}

export default function DashboardPage() {
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'activity'>('overview'); // Not used in this specific layout, but kept for state consistency.
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const showToast = (message: string) => {
    setToastMessage(message);
  };

  const enrichedQueueItems = useMemo(() => {
    return MOCK_QUEUE_ITEMS.map(item => {
      const followUp = MOCK_FOLLOW_UPS.find(fu => fu.id === item.followUpId);
      const client = followUp ? MOCK_CLIENTS.find(cl => cl.id === followUp.clientId) : undefined;
      return {
        ...item,
        clientName: client?.name || 'Unknown Client',
        followUpType: followUp?.type || 'other',
        followUpPriority: followUp?.priority || 'medium',
        followUpDueDate: followUp?.dueDate || '',
      };
    }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()); // Sort by queue item due date
  }, [MOCK_QUEUE_ITEMS, MOCK_FOLLOW_UPS, MOCK_CLIENTS]);

  const filteredItems = useMemo(() => {
    return enrichedQueueItems.filter(item =>
      item.actionRequired.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [enrichedQueueItems, searchTerm]);

  const getStatusBadgeVariant = (status: QueueItem['status']) => {
    switch (status) {
      case 'ready':
        return 'primary';
      case 'in_progress':
        return 'amber';
      case 'on_hold':
        return 'zinc';
      case 'completed':
        return 'emerald';
      case 'deferred':
        return 'red';
      default:
        return 'zinc';
    }
  };

  const handleExportCSV = () => {
    const headers = ["Action Required", "Client Name", "Follow-up Type", "Due Date", "Priority", "Status", "Created At"];
    const csvRows = filteredItems.map(item => [
      `"${item.actionRequired.replace(/"/g, '""')}"`,
      `"${item.clientName.replace(/"/g, '""')}"`,
      `"${item.followUpType.replace(/"/g, '""')}"`,
      `"${formatDate(item.dueDate).replace(/"/g, '""')}"`,
      `"${item.priority.replace(/"/g, '""')}"`,
      `"${item.status.replace(/"/g, '""')}"`,
      `"${formatDate(item.createdAt).replace(/"/g, '""')}"`,
    ].join(','));

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `clinic_queue_items_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Queue items exported to CSV!');
  };

  const handleNewFollowUp = () => {
    // In a real app, this would navigate to the intake page
    showToast('Navigating to New Follow-up form...');
  };

  const handleViewOverdue = () => {
    setSearchTerm('overdue'); // Example: filter table for overdue items
    showToast('Filtering for overdue items...');
  };

  const handleGenerateReport = () => {
    // In a real app, this would navigate to the reports page or open a report modal
    showToast('Generating a comprehensive report...');
  };

  // Ensure STATS and CHART_DATA are structured as expected or use defaults
  const kpiStats = STATS && STATS.length >= 4 ? STATS : [
    { label: 'Total Follow-ups', value: MOCK_FOLLOW_UPS.length, change: 5.2, sparklineData: [20, 30, 25, 35, 40, 38, 45] },
    { label: 'Pending Today', value: MOCK_FOLLOW_UPS.filter(fu => new Date(fu.dueDate).toDateString() === new Date().toDateString() && fu.status === 'pending').length, change: -2.1, sparklineData: [10, 12, 8, 15, 11, 14, 9] },
    { label: 'Overdue', value: MOCK_FOLLOW_UPS.filter(fu => new Date(fu.dueDate) < new Date() && fu.status === 'pending').length, change: 8.7, sparklineData: [5, 7, 6, 8, 10, 9, 12] },
    { label: 'Avg. Completion Time', value: 3.5, unit: 'days', change: 1.5, sparklineData: [2, 3, 4, 3, 5, 4, 3] },
  ];

  const chartData = CHART_DATA || {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    weekly: [120, 150, 130, 180, 200, 190, 220, 240, 210, 250, 230, 270],
  };


  return (
    <>
      <AppHeader
        title="Dashboard"
        subtitle={`Good morning, ${DEMO_USER.name}`}
        actions={<Button size="sm" onClick={handleNewFollowUp}>+ New Follow-up</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {kpiStats.map((stat, index) => (
          <StatCard
            key={stat.label}
            title={stat.label}
            value={stat.unit === 'days' ? `${stat.value}` : stat.label.includes('Avg. Completion Time') ? `${stat.value} days` : stat.label.includes('Revenue') ? formatCurrency(stat.value) : stat.value.toLocaleString()}
            change={stat.change}
            sparkline={<Sparkline data={stat.sparklineData} value={stat.value} />}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Follow-up Overview</CardTitle>
            <p className="text-zinc-600 text-sm">Last 12 months</p>
          </CardHeader>
          <CardContent>
            {chartData && chartData.weekly && chartData.labels ? (
              <BarChart data={chartData.weekly} labels={chartData.labels} />
            ) : (
              <div className="h-64 flex items-center justify-center text-zinc-400">Chart data not available</div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {RECENT_ACTIVITY.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 py-2 border-b border-zinc-50 last:border-0">
                  <Avatar name={activity.user} src={activity.avatar} className="h-8 w-8 text-xs" />
                  <div>
                    <p className="text-sm text-zinc-900">
                      <span className="font-medium">{activity.user}</span> {activity.action} <span className="font-medium">{activity.target}</span>
                    </p>
                    <p className="text-zinc-400 text-xs">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Queue Items</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <Input
                  type="text"
                  placeholder="Search queue items..."
                  className="pl-9 pr-3 py-2 text-sm rounded-md border border-zinc-200 focus:ring-zinc-900 focus:border-zinc-900"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table className="min-w-full divide-y divide-zinc-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Action Required</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Client</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Follow-up Type</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Due Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Priority</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Created At</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-zinc-200">
              {filteredItems.slice(0, 10).map((item) => ( // Show 10 rows
                <tr
                  key={item.id}
                  onClick={() => setSelectedRow(item.id)}
                  className={cn(
                    "hover:bg-zinc-50 cursor-pointer transition-colors",
                    selectedRow === item.id && "bg-zinc-100"
                  )}
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-zinc-900">{item.actionRequired}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-zinc-600">{item.clientName}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-zinc-600 capitalize">{item.followUpType.replace(/_/g, ' ')}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-zinc-600">{formatDate(item.dueDate)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <Badge variant={
                      item.priority === 'urgent' ? 'red' :
                      item.priority === 'high' ? 'amber' :
                      item.priority === 'medium' ? 'primary' : 'zinc'
                    }>{item.priority}</Badge>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <Badge variant={getStatusBadgeVariant(item.status)}>{item.status.replace(/_/g, ' ')}</Badge>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-zinc-400">{formatDate(item.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="flex justify-between items-center mt-4 text-sm text-zinc-600">
            <span>Showing {Math.min(filteredItems.length, 10)} of {filteredItems.length} results</span>
            {/* Pagination would go here */}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 mt-6">
        <Button variant="primary" onClick={handleNewFollowUp}>New Follow-up</Button>
        <Button variant="outline" onClick={handleViewOverdue}>View Overdue</Button>
        <Button variant="secondary" onClick={handleGenerateReport}>Generate Report</Button>
      </div>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm shadow-md">
          {toastMessage}
        </div>
      )}
    </>
  );
}