import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Table = ({ columns, data, className = '', emptyMessage = 'No data available' }) => {
  return (
    <div className={twMerge(clsx('overflow-x-auto rounded-lg border border-gray-100 shadow-sm', className))}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                scope="col"
                className={twMerge(clsx(
                  'px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider',
                  col.className
                ))}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {data && data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-blue-50/30 transition-colors duration-150">
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className={twMerge(clsx('px-6 py-4 whitespace-nowrap text-sm text-gray-700', col.className))}
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-sm text-gray-500 italic">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
