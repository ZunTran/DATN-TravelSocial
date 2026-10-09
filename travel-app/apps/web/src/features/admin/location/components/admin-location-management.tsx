'use client';

import { useState } from 'react';
import { useAdminLocations } from '../hooks/use-admin-locations';
import type { Location, CreateLocationInput, UpdateLocationInput } from '../types/location.types';
import { LocationTable } from './location-table';
import { LocationFormDialog } from './location-form-dialog';
import { LocationDeleteDialog } from './location-delete-dialog';

type LocationFormInput =
  | CreateLocationInput
  | UpdateLocationInput;

export function AdminLocationManagement() {
  const {
    locations,
    total,
    page,
    totalPages,
    loading,
    creating,
    updating,
    deleting,

    search,
    setSearch,

    province,
    setProvince,

    goToPage,
    createLocation,
    updateLocation,
    deleteLocation,
  } = useAdminLocations();

  const [
    formOpen,
    setFormOpen,
  ] = useState(false);

  const [
    editingLocation,
    setEditingLocation,
  ] = useState<Location | null>(null);

  const [
    deletingLocation,
    setDeletingLocation,
  ] = useState<Location | null>(null);

  const openCreate = () => {
    setEditingLocation(null);
    setFormOpen(true);
  };

  const openEdit = (
    location: Location,
  ) => {
    setEditingLocation(location);
    setFormOpen(true);
  };

  const closeForm = () => {
    if (creating || updating) {
      return;
    }
    setFormOpen(false);
    setEditingLocation(null);
  };

  const handleSubmit = async (
    input: LocationFormInput,
  ) => {
    if ('id' in input) {
      await updateLocation(input);
    } else {
      await createLocation(input);
    }
  };

  const openDelete = (
    location: Location,
  ) => {
    setDeletingLocation(location);
  };

  const closeDelete = () => {
    if (deleting) {
      return;
    }

    setDeletingLocation(null);
  };

  const handleDelete = async () => {
    if (!deletingLocation) {
      return;
    }

    await deleteLocation(
      deletingLocation.id,
    );

    setDeletingLocation(null);
  };

  return (
    <div className="space-y-4 rounded-xl border bg-card p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Quản lý địa điểm</h2>
          <p className="text-sm text-muted-foreground"> Quản lý các địa điểm được sử dụng khi tạo bài viết. </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        > + Thêm địa điểm </button>
      </div>


      <div className="grid gap-3 md:grid-cols-2">
        <input
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Tìm theo tên, địa chỉ..."
          className="rounded-md border bg-background px-3 py-2 text-sm"
        />

      </div>

      <LocationTable
        locations={locations}
        loading={loading}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      {totalPages > 0 && (
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">Tổng {total} địa điểm</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => goToPage(page - 1)}
              className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-40"
            >Trước</button>
            <span className="text-sm">{page} / {totalPages}</span>

            <button
              type="button"
              disabled={
                page >= totalPages ||loading
              }
              onClick={() => goToPage(page + 1) }
              className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-40"
            >Sau</button>
          </div>
        </div>
      )}

      <LocationFormDialog
        open={formOpen}
        location={editingLocation}
        loading={ creating || updating }
        onClose={closeForm}
        onSubmit={handleSubmit}
      />

      <LocationDeleteDialog
        location={deletingLocation}
        loading={deleting}
        onCancel={closeDelete}
        onConfirm={handleDelete}
      />
    </div>
  );
}