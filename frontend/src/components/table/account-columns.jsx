import { Check } from 'lucide-react'
import { Badge } from '../ui/badge'
import { DataTableColumnHeader } from './DataTableColumnHeader'

export const accountColumns = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Name"
        className="justify-start"
      />
    ),
    enableSorting: true,
    cell: function CellComponent({ row }) {
      return <div className="text-left">{row.original.name}</div>
    },
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    enableSorting: true,
    cell: ({ row }) => <Badge>{row.original.type}</Badge>,
  },
  {
    accessorKey: 'is_default',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Primary" />
    ),
    enableSorting: true,
    cell: ({ row }) => (
      <div className="flex justify-center">
        {row.original.is_default ? <Check /> : null}
      </div>
    ),
  },
]
