'use client'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@/components/ui'
import { AppHeader } from '@/components/layout'
import { formatDate } from '@/lib/utils' // Removed formatCurrency as it's not used
import { MOCK_CLIENTS, MOCK_FOLLOW_UPS, MOCK_QUEUE_ITEMS, MOCK_REPORTS } from '@/lib/data'
import { Search, Plus, Download, Eye } from 'lucide-react'
import { Client, FollowUp, QueueItem, Report } from '@/lib/types' // Import types for clarity

// Helper functions for display
const getClientName = (clientId: string, clients: Client[]): string => {
  const client = clients.find(c => c.id === clientId)
  return client ? client.name : 'Unknown Client'
}

const formatFollowUpType = (type: FollowUp['type']): string => {
  switch (type) {
    case 'check_in': return 'Check-in'
    case 're_schedule': return 'Re-schedule'
    case 'feedback_request': return 'Feedback Request'
    case 'new_service_offer': return 'New Service Offer'
    case 'referral_request': return 'Referral Request'
    case 'other': return 'Other'
    default: return type.replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  }
}

const formatReportType = (type: Report['reportType']): string => {
  switch (type) {
    case 'client_engagement': return 'Client Engagement'
    case 'follow_up_efficiency': return 'Follow-up Efficiency'
    case 'priority_breakdown': return 'Priority Breakdown'
    case 'custom': return 'Custom'
    default: return type.replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  }
}

export default function FeaturePage() {
  const params = useParams()
  const slug = (params.feature as string) ?? ''
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selected, setSelected] = useState<string | null>(null)

  // ── Feature 1: Client Follow-up Intake (/dashboard/intake) ──────────────────────
  if (slug === 'intake') {
    const items = MOCK_FOLLOW_UPS.filter(i =>
      (!search || getClientName(i.clientId, MOCK_CLIENTS).toLowerCase().includes(search.toLowerCase()) || formatFollowUpType(i.type).toLowerCase().includes(search.toLowerCase())) &&
      (!statusFilter || i.status === statusFilter)
    ) as FollowUp[]
    return (
      <div className="space-y-6">
        <AppHeader
          title="Client Follow-up Intake"
          subtitle={`${items.length} follow-ups total`}
          actions={<Button size="sm"><Plus size={14} className="mr-1" />New Follow-up</Button>}
        />
        <Card>
          <CardHeader>
            <div className="flex gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search follow-ups..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
                />
              </div>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-zinc-200 rounded-lg bg-white focus:outline-none"
              >
                <option value="">All statuses</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="escalated">Escalated</option>
                <option value="deferred">Deferred</option>
              </select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="border-b border-zinc-100">
                <tr className="text-left text-zinc-500 text-xs uppercase tracking-wide">
                  <th className="px-6 py-3">Client</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Priority</th>
                  <th className="px-6 py-3">Due Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {items.map(item => (
                  <tr
                    key={item.id}
                    onClick={() => setSelected(selected === item.id ? null : item.id)}
                    className={`hover:bg-zinc-50 cursor-pointer transition-colors ${selected === item.id ? 'bg-indigo-50' : ''}`}
                  >
                    <td className="px-6 py-3 font-medium text-zinc-900">{getClientName(item.clientId, MOCK_CLIENTS)}</td>
                    <td className="px-6 py-3 text-zinc-500">{formatFollowUpType(item.type)}</td>
                    <td className="px-6 py-3 text-zinc-700">{item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}</td>
                    <td className="px-6 py-3 text-zinc-400 text-xs">{formatDate(item.dueDate)}</td>
                    <td className="px-6 py-3">
                      <Badge
                        variant={
                          item.status === 'completed' ? 'success' :
                          item.status === 'cancelled' ? 'error' :
                          item.status === 'escalated' ? 'warning' : 'default'
                        }
                      >
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-3">
                      <button className="text-zinc-400 hover:text-zinc-700 p-1"><Eye size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-6 py-3 border-t border-zinc-100 text-xs text-zinc-400">
              Showing {items.length} of {MOCK_FOLLOW_UPS.length} follow-ups
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ── Feature 2: Follow-up Queue (/dashboard/dashboard) ──────────────────────
  if (slug === 'dashboard') {
    const items = MOCK_QUEUE_ITEMS.filter(i =>
      !search || JSON.stringify(i).toLowerCase().includes(search.toLowerCase())
    ) as QueueItem[]
    return (
      <div className="space-y-6">
        <AppHeader
          title="Follow-up Queue"
          subtitle={`${items.length} queue items`}
          actions={<Button size="sm"><Plus size={14} className="mr-1" />Add Queue Item</Button>}
        />
        <div className="mb-4">
          <div className="relative max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search queue items..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelected(item.id)}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                    {item.actionRequired.slice(0, 2).toUpperCase()}
                  </div>
                  <Badge
                    variant={
                      item.status === 'ready'