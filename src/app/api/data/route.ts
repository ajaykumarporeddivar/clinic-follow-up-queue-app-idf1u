import {
  MOCK_CLIENTS,
  MOCK_FOLLOW_UPS,
  MOCK_QUEUE_ITEMS,
  MOCK_REPORTS,
  STATS,
} from '@/lib/data';
import type { Client, FollowUp, QueueItem, Report } from '@/lib/types';

// CORS headers for all responses
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function GET(): Promise<Response> {
  const data = {
    clients: MOCK_CLIENTS,
    followUps: MOCK_FOLLOW_UPS,
    queueItems: MOCK_QUEUE_ITEMS,
    reports: MOCK_REPORTS,
    stats: STATS,
  };

  return Response.json(
    {
      ok: true,
      data: data,
      total: {
        clients: MOCK_CLIENTS.length,
        followUps: MOCK_FOLLOW_UPS.length,
        queueItems: MOCK_QUEUE_ITEMS.length,
        reports: MOCK_REPORTS.length,
      },
    },
    { headers: CORS_HEADERS }
  );
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    return Response.json(
      {
        ok: true,
        message: 'Demo mode — data not persisted',
        received: body,
      },
      { headers: CORS_HEADERS }
    );
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: 'Invalid JSON body',
      },
      { status: 400, headers: CORS_HEADERS }
    );
  }
}

export async function OPTIONS(): Promise<Response> {
  return new Response(null, { status: 200, headers: CORS_HEADERS });
}