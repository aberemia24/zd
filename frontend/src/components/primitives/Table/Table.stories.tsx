import type { Meta, StoryObj } from '@storybook/react';
import Table from './Table';
import type { TableColumn } from './Table';
import Badge from '../Badge';
import { Button } from '../Button';
import { Calendar, Tag, CreditCard, DollarSign, TrendingUp, TrendingDown, ArrowUpRight, Building, Eye, Edit, MoreHorizontal } from 'lucide-react';

/**
 * 🎨 Table Component - Carbon Copper Design System CVA-v2
 */
const meta: Meta<typeof Table> = {
  title: 'CVA-v2/Primitives/Table',
  component: Table,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Table component pentru afișarea datelor tabulare, construit cu CVA-v2 system cu Carbon Copper styling și funcționalități complete.'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      control: false,
      description: 'Array de obiecte cu datele pentru afișare'
    },
    columns: {
      control: false,
      description: 'Configurația coloanelor'
    },
    enableSorting: {
      control: 'boolean',
      description: 'Activează sortarea coloanelor'
    },
    enablePagination: {
      control: 'boolean',
      description: 'Activează paginarea'
    },
    pageSize: {
      control: 'number',
      description: 'Numărul de rânduri per pagină'
    },
    zebra: {
      control: 'boolean',
      description: 'Rânduri alternate colorate'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Mărimea tabelului'
    }
  }
};

export default meta;
type Story = StoryObj<typeof Table>;

// Sample data types
interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  status: string;
}

// Sample data generator
const generateTransactions = (count: number): Transaction[] => {
  const categories = ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping'];
  const statuses = ['completed', 'pending', 'failed'];
  const descriptions = [
    'Grocery Store Purchase',
    'Gas Station Payment',
    'Movie Theater',
    'Electric Bill',
    'Online Shopping',
    'Restaurant Dinner',
    'Uber Ride',
    'Spotify Subscription'
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `txn-${i + 1}`,
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    category: categories[Math.floor(Math.random() * categories.length)],
    amount: Math.round((Math.random() * 500 + 10) * 100) / 100,
    status: statuses[Math.floor(Math.random() * statuses.length)]
  }));
};

// Utility functions
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: 'RON',
    minimumFractionDigits: 2
  }).format(Math.abs(amount));
};

// Basic columns configuration
const basicColumns: TableColumn<Transaction>[] = [
  {
    id: 'date',
    header: 'Date',
    accessorKey: 'date',
    enableSorting: true
  },
  {
    id: 'description',
    header: 'Description',
    accessorKey: 'description',
    enableSorting: true
  },
  {
    id: 'amount',
    header: 'Amount',
    accessorKey: 'amount',
    enableSorting: true,
    align: 'right',
    numeric: true,
    cell: ({ getValue }) => formatCurrency(getValue() as number)
  },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    cell: ({ getValue }) => (
      <Badge variant={
        (getValue() as string) === 'completed' ? 'success' :
        (getValue() as string) === 'pending' ? 'warning' : 'secondary'
      }>
        {(getValue() as string).charAt(0).toUpperCase() + (getValue() as string).slice(1)}
      </Badge>
    )
  }
];

// Enhanced columns for advanced examples
const enhancedColumns: TableColumn<Transaction>[] = [
  {
    id: 'date',
    header: 'Date',
    accessorKey: 'date',
    enableSorting: true,
    cell: ({ getValue }) => (
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-carbon-500" />
        {new Date(getValue() as string).toLocaleDateString()}
      </div>
    )
  },
  {
    id: 'description',
    header: 'Description',
    accessorKey: 'description',
    enableSorting: true,
    cell: ({ getValue }) => (
      <div className="font-medium">{getValue() as string}</div>
    )
  },
  {
    id: 'category',
    header: 'Category',
    accessorKey: 'category',
    enableSorting: true,
    cell: ({ getValue }) => (
      <div className="flex items-center gap-2">
        <Tag className="w-4 h-4 text-copper-600" />
        <span className="text-sm">{getValue() as string}</span>
      </div>
    )
  },
  {
    id: 'amount',
    header: 'Amount',
    accessorKey: 'amount',
    enableSorting: true,
    align: 'right',
    numeric: true,
    cell: ({ getValue }) => (
      <div className="font-mono font-medium text-green-600">
        {formatCurrency(getValue() as number)}
      </div>
    )
  },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    cell: ({ getValue }) => (
      <Badge variant={
        (getValue() as string) === 'completed' ? 'success' :
        (getValue() as string) === 'pending' ? 'warning' : 'secondary'
      }>
        {(getValue() as string).charAt(0).toUpperCase() + (getValue() as string).slice(1)}
      </Badge>
    )
  },
  {
    id: 'actions',
    header: 'Actions',
    accessorKey: 'id',
    cell: () => (
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm">
          <Eye className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Edit className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>
    )
  }
];

// Basic Stories
export const Default: Story = {
  args: {
    data: generateTransactions(10),
    columns: basicColumns,
    enableSorting: true,
    enablePagination: true,
    pageSize: 5
  }
};

// All Variants Overview
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8 p-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Small Table</h3>
        <Table
          data={generateTransactions(5)}
          columns={basicColumns}
          size="sm"
          zebra={false}
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Medium Table (Default)</h3>
        <Table
          data={generateTransactions(5)}
          columns={basicColumns}
          size="md"
          zebra={true}
        />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Large Table</h3>
        <Table
          data={generateTransactions(5)}
          columns={basicColumns}
          size="lg"
          interactive={true}
        />
      </div>
    </div>
  )
};

// Interactive Features
export const Interactive: Story = {
  args: {
    data: generateTransactions(25),
    columns: enhancedColumns,
    title: "Transaction History",
    description: "Complete transaction history with sorting, pagination, and selection",
    enableSorting: true,
    enablePagination: true,
    enableSelection: true,
    stickyHeader: true,
    zebra: true,
    pageSize: 10
  },
  parameters: {
    layout: 'fullscreen'
  }
};

// Financial Use Cases
export const FinancialUseCases: Story = {
  render: () => {
    const transactionData = generateTransactions(15);
    
    const financialColumns: TableColumn<Transaction>[] = [
      {
        id: 'date',
        header: 'Date',
        accessorKey: 'date',
        enableSorting: true,
        cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString()
      },
      {
        id: 'description',
        header: 'Transaction',
        accessorKey: 'description',
        enableSorting: true,
        cell: ({ getValue, row }) => (
          <div>
            <div className="font-medium">{getValue() as string}</div>
            <div className="text-sm text-carbon-500">{row.original.category}</div>
          </div>
        )
      },
      {
        id: 'amount',
        header: 'Amount',
        accessorKey: 'amount',
        enableSorting: true,
        align: 'right',
        numeric: true,
        cell: ({ getValue }) => {
          const amount = getValue() as number;
          return (
            <div className="flex items-center justify-end gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="font-mono font-semibold text-green-600">
                {formatCurrency(amount)}
              </span>
            </div>
          );
        }
      },
      {
        id: 'status',
        header: 'Status',
        accessorKey: 'status',
        cell: ({ getValue }) => (
          <Badge variant={
            (getValue() as string) === 'completed' ? 'success' :
            (getValue() as string) === 'pending' ? 'warning' : 'secondary'
          }>
            {(getValue() as string).charAt(0).toUpperCase() + (getValue() as string).slice(1)}
          </Badge>
        )
      }
    ];

    return (
      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        <div className="border border-carbon-200 dark:border-carbon-700 rounded-lg overflow-hidden">
          <Table
            data={transactionData}
            columns={financialColumns}
            title="Recent Transactions"
            description="Latest financial transactions with full details"
            enableSorting={true}
            enablePagination={true}
            pageSize={10}
            zebra={true}
            interactive={true}
          />
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen'
  }
}; 