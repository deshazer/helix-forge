import { Badge } from '../ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import Txt from '../ui/typography'
import { DataTableColumnHeader } from './DataTableColumnHeader'

export const accountColumns = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    enableSorting: true,
    cell: ({ row }) => <span>{row.original.id}</span>,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    enableSorting: true,
    cell: function CellComponent({ row }) {
      return <div>{row.original.name}</div>
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
]
