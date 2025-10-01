import { Minus } from 'lucide-react'
import { Badge } from '../ui/badge'
import { DataTableColumnHeader } from './DataTableColumnHeader'
import dayjs from 'dayjs'
import { formatCurrency } from '@/lib/utils'

export const transactionColumns = [
  {
    accessorKey: 'time',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    enableSorting: true,
    cell: function CellComponent({ row }) {
      return (
        <div className="text-left">
          {dayjs(row.original.time).format('MM/DD/YYYY, ddd')}
        </div>
      )
    },
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    enableSorting: true,
    cell: ({ row }) => <div className="text-center">{row.original.type}</div>,
  },
  {
    accessorKey: 'asset_type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Asset" />
    ),
    enableSorting: true,
    cell: ({ row }) => (
      <div className="text-center">{row.original.asset_type}</div>
    ),
  },
  {
    accessorKey: 'action',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Action" />
    ),
    enableSorting: true,
    cell: ({ row }) => (
      <Badge
        className={`${
          row.original.action === 'BUY'
            ? 'bg-green-500'
            : 'bg-red-500 text-white'
        }`}
      >
        {row.original.action}
      </Badge>
    ),
  },
  {
    accessorKey: 'asset_description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Symbol" />
    ),
    enableSorting: true,
    cell: ({ row }) => <Badge>{row.original.asset_description}</Badge>,
  },
  {
    accessorKey: 'quantity',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Quantity"
        className="justify-center"
      />
    ),
    enableSorting: true,
    cell: ({ row }) => (
      <div className="text-right">{Math.abs(row.original.quantity)} </div>
    ),
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader
        className="justify-end -mr-6"
        column={column}
        title="Price"
      />
    ),
    enableSorting: true,
    cell: function CellComponent({ row }) {
      const price = row.original.price * Math.sign(row.original.quantity) * -1
      return (
        <div className="text-right">
          <div className="flex items-center justify-end">
            {price < 0 && <Minus size={16} className="text-red-500" />}
            {formatCurrency(price)}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'gross',
    header: ({ column }) => (
      <DataTableColumnHeader
        className="justify-end -mr-6"
        column={column}
        title="Gross"
      />
    ),
    enableSorting: true,
    cell: function CellComponent({ row }) {
      const gross =
        row.original.quantity *
        -1 *
        row.original.price *
        row.original.options_multiplier
      return (
        <div className="text-right">
          <div className="flex items-center justify-end">
            {gross < 0 && <Minus size={16} className="text-red-500" />}
            {formatCurrency(gross)}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'total_fees',
    header: ({ column }) => (
      <DataTableColumnHeader
        className="justify-end -mr-6"
        column={column}
        title="Fees"
      />
    ),
    enableSorting: true,
    cell: ({ row }) => (
      <div className="text-right">
        <div className="flex items-center justify-end">
          {row.original.total_fees < 0 && (
            <Minus size={16} className="text-red-500" />
          )}
          {formatCurrency(Math.abs(row.original.total_fees))}{' '}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'net_amount',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Net"
        className="justify-end -mr-2"
      />
    ),
    enableSorting: true,
    cell: ({ row }) => (
      <div className="text-right">
        <div className="flex items-center justify-end">
          {row.original.net_amount < 0 && (
            <Minus size={16} className="text-red-500" />
          )}
          {formatCurrency(Math.abs(row.original.net_amount))}{' '}
        </div>
      </div>
    ),
  },
]
