// Utilitar pentru construirea parametrilor de query pentru tranzacții
export function buildTransactionQueryParams({ type, category, limit, offset, sort }: {
  type?: string;
  category?: string;
  limit?: number;
  offset?: number;
  sort?: string;
}) {
  const params = new URLSearchParams();
  if (type) params.append('type', type);
  if (category) params.append('category', category);
  params.append('limit', typeof limit !== 'undefined' ? limit.toString() : '10');
  params.append('offset', typeof offset !== 'undefined' ? offset.toString() : '0');
  params.append('sort', typeof sort !== 'undefined' ? sort : 'date');
  return params.toString();
}
