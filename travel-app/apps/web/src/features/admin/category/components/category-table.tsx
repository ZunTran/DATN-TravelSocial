'use client';

import type {
  AdminCategory,
} from '../types/category.types';

interface CategoryTableProps {
  categories: AdminCategory[];
  loading?: boolean;

  onEdit: (
    category: AdminCategory,
  ) => void;

  onDelete: (
    category: AdminCategory,
  ) => void;
}

export function CategoryTable({
  categories,
  loading = false,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  if (loading) {
    return (
      <div className="rounded-xl border">
        <div className="p-6 text-sm text-gray-500">
          Loading categories...
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-white">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-gray-50 text-left text-sm">
            <th className="px-4 py-3">
              Name
            </th>

            <th className="px-4 py-3">
              Description
            </th>

            <th className="px-4 py-3 text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {categories.map((category) => (
            <tr
              key={category.id}
              className="border-b last:border-0"
            >
              <td className="px-4 py-4">
                <div className="font-medium">
                  {category.name}
                </div>
              </td>

              <td className="px-4 py-4 text-sm text-gray-600">
                {category.description ||
                  '—'}
              </td>

              <td className="px-4 py-4">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() =>
                      onEdit(category)
                    }
                    className="rounded-md border px-3 py-1.5 text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      onDelete(category)
                    }
                    className="rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}