'use client';

import React from 'react';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
}

export default function DataTable<T>({
  columns,
  data,
  emptyMessage = 'No records available.',
}: DataTableProps<T>) {
  if (!data || data.length === 0) {
    return (
      <div className="p-8 text-center rounded-2xl bg-[#091024]/60 border border-slate-800 text-xs text-slate-400 font-mono">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-800 bg-[#091024]/90 backdrop-blur-md">
      <table className="w-full text-left text-xs">
        <thead className="border-b border-slate-800 bg-[#060b19] font-mono text-slate-400 uppercase tracking-wider">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="px-5 py-3.5 font-bold">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-slate-200">
          {data.map((row, rowIdx) => {
            const rowKey = (row as { id?: string | number; nodeId?: string; name?: string }).id ||
              (row as { nodeId?: string }).nodeId ||
              (row as { name?: string }).name ||
              rowIdx;
            return (
              <tr key={rowKey} className="hover:bg-slate-800/40 transition-colors">
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="px-5 py-4 whitespace-nowrap">
                    {col.cell
                      ? col.cell(row)
                      : col.accessorKey
                      ? (row[col.accessorKey] as React.ReactNode) ?? '--'
                      : '--'}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
