'use client';

import {
  MapPin,
  Pencil,
  Trash2,
} from 'lucide-react';

import type {
  Location,
} from '@/features/admin/location/types/location.types';

interface LocationTableProps {
  locations: Location[];

  onEdit: (
    location: Location,
  ) => void;

  onDelete: (
    location: Location,
  ) => void;

  loading?: boolean;
}

export function LocationTable({
  locations,
  onEdit,
  onDelete,
  loading,
}: LocationTableProps) {
  if (loading) {
    return (
      <div className="p-6 text-center">
        Loading locations...
      </div>
    );
  }

  if (!locations.length) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        No locations found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left">
              Name
            </th>

            <th className="px-4 py-3 text-left">
              Province
            </th>

            <th className="px-4 py-3 text-left">
              Address
            </th>

            <th className="px-4 py-3 text-left">
              Coordinates
            </th>

            <th className="px-4 py-3 text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {locations.map(
            (location) => (
              <tr
                key={location.id}
                className="border-b last:border-0"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4" />

                    <span className="font-medium">
                      {location.name}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-3">
                  {location.province ??
                    '-'}
                </td>

                <td className="max-w-xs truncate px-4 py-3">
                  {location.address ??
                    '-'}
                </td>

                <td className="px-4 py-3">
                  {location.latitude != null &&
                  location.longitude != null
                    ? `${location.latitude}, ${location.longitude}`
                    : '-'}
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onEdit(location)
                      }
                      className="rounded-md p-2 hover:bg-muted"
                    >
                      <Pencil className="size-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onDelete(location)
                      }
                      className="rounded-md p-2 text-destructive hover:bg-muted"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
}