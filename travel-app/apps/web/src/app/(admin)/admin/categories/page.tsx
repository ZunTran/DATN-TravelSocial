'use client';

import { useState } from 'react';

import {
  CategoryTable,
} from '@/features/admin/category/components/category-table';

import {
  CategoryDialog,
} from '@/features/admin/category/components/category-dialog';

import {
  CategoryDeleteDialog,
} from '@/features/admin/category/components/category-delete-dialog';



import {
  useAdminCategories,
  useAdminCategoryMutations,
} from '@/features/admin/category/hooks/use-admin-categories';



import type {
  AdminCategory,
} from '@/features/admin/category/types/category.types';
import { CategoryEmpty } from '@/features/admin/category/components/category.empty';

export default function CategoriesPage() {
  const [search, setSearch] =
    useState('');

  const [page, setPage] =
    useState(1);

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] =
    useState(false);

  const [selectedCategory, setSelectedCategory] =
    useState<AdminCategory | null>(null);

  const {
    categories,
    total,
    totalPages,
    loading,
    error,
    refetch,
  } = useAdminCategories({
    search,
    page,
    limit: 10,
  });

  const {
    createCategory,
    updateCategory,
    deleteCategory,

    creating,
    updating,
    deleting,
  } = useAdminCategoryMutations();


const handleSearchChange = (value: string) => {
  setSearch(value);
  setPage(1);
};
  const handleCreate = () => {
    setSelectedCategory(null);
    setDialogOpen(true);
  };

  const handleEdit = (
    category: AdminCategory,
  ) => {
    setSelectedCategory(category);
    setDialogOpen(true);
  };

  const handleDelete = (
    category: AdminCategory,
  ) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async (
    name: string,
    description: string,
  ) => {
    if (selectedCategory) {
      await updateCategory(
        selectedCategory.id,
        name,
        description,
      );
    } else {
      await createCategory(
        name,
        description,
      );
    }

    setDialogOpen(false);
    setSelectedCategory(null);

    await refetch();
  };

  const handleConfirmDelete =
    async () => {
      if (!selectedCategory) {
        return;
      }

      await deleteCategory(
        selectedCategory.id,
      );

      setDeleteDialogOpen(false);
      setSelectedCategory(null);

      /**
       * Nếu xóa item cuối cùng
       * của page hiện tại thì lùi page.
       */
      if (
        categories.length === 1 &&
        page > 1
      ) {
        setPage((current) =>
          current - 1,
        );
      } else {
        await refetch();
      }
    };

  return (
    <div className="space-y-6 p-6">
      {/* HEADER */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Categories
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage travel categories used by posts.
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
        >
          + Add category
        </button>
      </div>

      {/* SEARCH */}

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <input
          value={search}
          onChange={(e) =>
            handleSearchChange(e.target.value)
          }
          placeholder="Search categories..."
          className="w-full max-w-md rounded-lg border px-3 py-2 outline-none focus:ring-2"
        />

        <div className="text-sm text-gray-500">
          {total} categories
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          Failed to load categories.
        </div>
      )}

      {/* TABLE */}

      {!loading &&
      categories.length === 0 ? (
        <CategoryEmpty />
      ) : (
        <CategoryTable
          categories={categories}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* PAGINATION */}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </p>

          <div className="flex gap-2">
            <button
              disabled={
                page <= 1 ||
                loading
              }
              onClick={() =>
                setPage(
                  (current) =>
                    current - 1,
                )
              }
              className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
            >
              Previous
            </button>

            <button
              disabled={
                page >= totalPages ||
                loading
              }
              onClick={() =>
                setPage(
                  (current) =>
                    current + 1,
                )
              }
              className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* CREATE / UPDATE */}

      <CategoryDialog
        open={dialogOpen}
        category={selectedCategory}
        loading={
          creating || updating
        }
        onOpenChange={
          setDialogOpen
        }
        onSubmit={handleSubmit}
      />

      {/* DELETE */}

      <CategoryDeleteDialog
        open={deleteDialogOpen}
        category={selectedCategory}
        loading={deleting}
        onOpenChange={
          setDeleteDialogOpen
        }
        onConfirm={
          handleConfirmDelete
        }
      />
    </div>
  );
}