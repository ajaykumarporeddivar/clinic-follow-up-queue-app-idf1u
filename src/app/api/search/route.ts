import {
  MOCK_CLIENTS,
  MOCK_FOLLOW_UPS,
  MOCK_QUEUE_ITEMS,
  MOCK_REPORTS,
} from '@/lib/data';
import type { Client, FollowUp, QueueItem, Report } from '@/lib/types';

interface SearchableCollection {
  type: string;
  collection: (Client | FollowUp | QueueItem | Report)[];
  fields: string[];
}

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const type = searchParams.get('type'); // Optional: 'clients', 'followups', 'queueitems', 'reports'
  const lowerCaseQuery = query.toLowerCase();

  const allSearchableCollections: SearchableCollection[] = [
    { type: 'clients', collection: MOCK_CLIENTS, fields: ['name', 'email', 'internalId', 'notes'] },
    { type: 'followups', collection: MOCK_FOLLOW_UPS, fields: ['type', 'notes'] },
    { type: 'queueitems', collection: MOCK_QUEUE_ITEMS, fields: ['actionRequired', 'notes'] },
    { type: 'reports', collection: MOCK_REPORTS, fields: ['name', 'description'] },
  ];

  let results: (Client | FollowUp | QueueItem | Report)[] = [];

  if (!query) {
    // If query is empty, return the first 5 items from FollowUps as a default
    const defaultResults = MOCK_FOLLOW_UPS.slice(0, 5);
    return Response.json({
      ok: true,
      data: { results: defaultResults, total: defaultResults.length, query: '' },
    });
  }

  for (const { type: collectionType, collection, fields } of allSearchableCollections) {
    // If a specific type is requested, only search that collection
    if (type && type !== collectionType) {
      continue;
    }

    const filteredItems = collection.filter(item =>
      fields.some(field => {
        const value = (item as any)[field];
        return typeof value === 'string' && value.toLowerCase().includes(lowerCaseQuery);
      })
    );
    results.push(...filteredItems);

    // Stop if we have enough results or reached max for a specific type search
    if (results.length >= 20 || (type && type === collectionType)) {
        break;
    }
  }

  // Ensure unique results if searching across multiple collections
  const uniqueResults = Array.from(new Set(results.map(item => item.id)))
    .map(id => results.find(item => item.id === id))
    .filter(Boolean); // Filter out any undefined

  const finalResults = uniqueResults.slice(0, 20); // Max 20 results

  return Response.json({
    ok: true,
    data: { results: finalResults, total: finalResults.length, query },
  });
}