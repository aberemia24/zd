// Utilitar pentru construirea parametrilor de query pentru tranzacții
export function buildTransactionQueryParams({
  type,
  category,
  limit,
  offset,
  sort,
  dateFrom,
  dateTo,
  amountMin,
  amountMax,
  searchText,
}: {
  type?: string;
  category?: string;
  limit?: number;
  offset?: number;
  sort?: string;
  dateFrom?: string;
  dateTo?: string;
  amountMin?: string | number;
  amountMax?: string | number;
  searchText?: string;
}) {
  const params = new URLSearchParams();

  // Filtre de bază
  if (type) params.append("type", type);
  if (category) params.append("category", category);

  // Filtre avansate
  if (dateFrom) params.append("startDate", dateFrom);
  if (dateTo) params.append("endDate", dateTo);

  // Convertim amountMin/amountMax la număr dacă sunt string-uri valide
  if (amountMin !== undefined && amountMin !== "") {
    const minAmount =
      typeof amountMin === "string" ? parseFloat(amountMin) : amountMin;
    if (!isNaN(minAmount)) params.append("minAmount", minAmount.toString());
  }

  if (amountMax !== undefined && amountMax !== "") {
    const maxAmount =
      typeof amountMax === "string" ? parseFloat(amountMax) : amountMax;
    if (!isNaN(maxAmount)) params.append("maxAmount", maxAmount.toString());
  }

  // Căutare text
  if (searchText) params.append("search", searchText);

  // Paginare și sortare (valori default dacă nu sunt specificate)
  params.append(
    "limit",
    typeof limit !== "undefined" ? limit.toString() : "10",
  );
  params.append(
    "offset",
    typeof offset !== "undefined" ? offset.toString() : "0",
  );
  params.append("sort", typeof sort !== "undefined" ? sort : "date");

  return params.toString();
}
