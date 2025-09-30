import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { memo } from 'react'
import { DataTablePagination } from './DataTablePagination'

const DataTable = ({
  columns,
  data,
  pagination = true,
  getRowClassName,
  onRowClick,
}) => {
  const table = useReactTable({
    data,
    columns,
    initialState: {
      pagination: { pageSize: pagination ? 50 : data?.length || 1000 },
      columnVisibility: {},
    },
    getCoreRowModel: getCoreRowModel(),
    ...(pagination && { getPaginationRowModel: getPaginationRowModel() }),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="rounded-sm border overflow-auto">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              const rowClassName = getRowClassName
                ? getRowClassName(row.original)
                : ''
              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={`${rowClassName} ${onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}`}
                  onClick={
                    onRowClick ? () => onRowClick(row.original) : undefined
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {pagination && <DataTablePagination table={table} />}
    </div>
  )
}

export default memo(DataTable)
