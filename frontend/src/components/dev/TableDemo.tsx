import React, { useState } from 'react';
import Table, { type TableColumn } from '../primitives/Table/Table';

// Tipuri pentru demo
interface DemoTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
}

// Date demo
const demoData: DemoTransaction[] = [
  {
    id: '1',
    date: '2025-06-01',
    description: 'Salar',
    amount: 5000,
    category: 'Venituri',
    type: 'income'
  },
  {
    id: '2',
    date: '2025-06-02',
    description: 'Cumpărături alimentare',
    amount: -350,
    category: 'Alimente',
    type: 'expense'
  },
  {
    id: '3',
    date: '2025-06-03',
    description: 'Abonament internet',
    amount: -89.99,
    category: 'Utilități',
    type: 'expense'
  },
  {
    id: '4',
    date: '2025-06-04',
    description: 'Freelancing',
    amount: 1200,
    category: 'Venituri suplimentare',
    type: 'income'
  },
];

// Coloane pentru tabel
const columns: TableColumn<DemoTransaction>[] = [
  {
    id: 'date',
    header: 'Data',
    accessorKey: 'date',
    enableSorting: true,
  },
  {
    id: 'description',
    header: 'Descriere',
    accessorKey: 'description',
    enableSorting: true,
  },
  {
    id: 'category',
    header: 'Categorie',
    accessorKey: 'category',
    enableSorting: true,
  },
  {
    id: 'amount',
    header: 'Suma',
    accessorKey: 'amount',
    numeric: true,
    align: 'right',
    enableSorting: true,
    cell: ({ getValue }) => {
      const amount = getValue() as number;
      const formatat = new Intl.NumberFormat('ro-RO', {
        style: 'currency',
        currency: 'RON'
      }).format(amount);
      
      return (
        <span className={amount >= 0 ? 'text-success-600' : 'text-danger-600'}>
          {formatat}
        </span>
      );
    },
  },
  {
    id: 'type',
    header: 'Tip',
    accessorKey: 'type',
    enableSorting: true,
    cell: ({ getValue }) => {
      const type = getValue() as string;
      return (
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          type === 'income' 
            ? 'bg-success-100 text-success-800' 
            : 'bg-danger-100 text-danger-800'
        }`}>
          {type === 'income' ? 'Venit' : 'Cheltuială'}
        </span>
      );
    },
  },
];

const TableDemo: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

  const handleRowClick = (row: DemoTransaction) => {
    console.log('Row clicked:', row);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Carbon Data Table Demo
        </h2>
        <p className="text-text-secondary">
          Demonstrație a componentei Table cu TanStack Table și Carbon Design System styling
        </p>
      </div>

      {/* Table cu toate funcționalitățile */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Table completă cu toate funcționalitățile</h3>
        <Table
          data={demoData}
          columns={columns}
          title="Tranzacții Recente"
          description="Tabelul conține tranzacțiile din ultima perioadă cu funcționalități complete"
          enableSorting={true}
          enablePagination={true}
          enableSelection={true}
          stickyHeader={true}
          zebra={true}
          size="md"
          onRowClick={handleRowClick}
          rowSelection={selectedRows}
          onRowSelectionChange={setSelectedRows}
          dataTestId="demo-table-full"
        />
      </div>

      {/* Table simplă */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Table simplă fără funcționalități extra</h3>
        <Table
          data={demoData}
          columns={columns}
          size="sm"
          border="strong"
          interactive={false}
          dataTestId="demo-table-simple"
        />
      </div>

      {/* Table compactă */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Table compactă (size xs)</h3>
        <Table
          data={demoData}
          columns={columns}
          size="xs"
          zebra={false}
          enableSorting={true}
          dataTestId="demo-table-compact"
        />
      </div>

      {/* Table goală */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Table goală (empty state)</h3>
        <Table
          data={[]}
          columns={columns}
          title="Tranzacții"
          description="Nu există tranzacții în această perioadă"
          emptyStateMessage="Nu au fost găsite tranzacții pentru perioada selectată"
          size="md"
          dataTestId="demo-table-empty"
        />
      </div>
    </div>
  );
};

export default TableDemo; 