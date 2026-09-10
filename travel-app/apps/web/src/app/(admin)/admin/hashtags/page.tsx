'use client';

import {
  useEffect,
  useState,
} from 'react';

import {
  Plus,
  Search,
} from 'lucide-react';

import {Button} from '@/components/ui/button';

import {Input} from '@/components/ui/input';



import {
  useAdminHashtags,
} from '@/features/admin/hashtag/hooks/use-admin-hashtags';

import {
  useAdminHashtagMutations,
} from '@/features/admin/hashtag/hooks/use-admin-hashtag-mutations';

import type {
  AdminHashtag,
} from '@/features/admin/hashtag/types/hashtag.types';
import { HashtagTable } from '@/features/admin/hashtag/components/hashtag-table';
import { HashtagEmpty } from '@/features/admin/hashtag/components/hashtag-empty';
import { HashtagDialog } from '@/features/admin/hashtag/components/hashtag-dialog';
import { HashtagDeleteDialog } from '@/features/admin/hashtag/components/hashtag-delete-dialog';

export default function AdminHashtagsPage() {
  const [search, setSearch] =
    useState('');

  const [page, setPage] =
    useState(1);

  const [dialogOpen, setDialogOpen] =
    useState(false);

  const [editingHashtag, setEditingHashtag] =
    useState<AdminHashtag | null>(null);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [deletingHashtag, setDeletingHashtag] =
    useState<AdminHashtag | null>(null);

  const {
    data,
    loading,
    refetch,
  } = useAdminHashtags({
    search: search || undefined,
    page,
    limit: 20,
  });

  const {
    createHashtag,
    updateHashtag,
    deleteHashtag,
    loading: mutationLoading,
  } =
    useAdminHashtagMutations();

  useEffect(() => {
    setPage(1);
  }, [search]);

  const openCreate = () => {
    setEditingHashtag(null);
    setDialogOpen(true);
  };

  const openEdit = (
    hashtag: AdminHashtag,
  ) => {
    setEditingHashtag(hashtag);
    setDialogOpen(true);
  };

  const openDelete = (
    hashtag: AdminHashtag,
  ) => {
    setDeletingHashtag(hashtag);
    setDeleteOpen(true);
  };

  const handleSubmit = async (
    name: string,
  ) => {
    if (editingHashtag) {
      await updateHashtag({
        id: editingHashtag.id,
        name,
      });
    } else {
      await createHashtag({
        name,
      });
    }

    setDialogOpen(false);
    setEditingHashtag(null);

    await refetch();
  };

  const handleDelete = async () => {
    if (!deletingHashtag) {
      return;
    }

    await deleteHashtag(
      deletingHashtag.id,
    );

    setDeleteOpen(false);
    setDeletingHashtag(null);

    await refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Hashtags
          </h1>

          <p className="text-sm text-muted-foreground">
            Manage hashtags used in posts.
          </p>
        </div>

        <Button
          onClick={openCreate}
        >
          <Plus />
          Add hashtag
        </Button>
      </div>

      <div className="flex max-w-md items-center gap-2">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value,
              )
            }
            placeholder="Search hashtags..."
            className="pl-9"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-muted-foreground">
          Loading...
        </div>
      ) : data.items.length === 0 ? (
        <HashtagEmpty />
      ) : (
        <>
          <HashtagTable
            hashtags={data.items}
            onEdit={openEdit}
            onDelete={openDelete}
          />

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {data.total} hashtag(s)
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() =>
                  setPage(
                    (p) =>
                      Math.max(
                        1,
                        p - 1,
                      ),
                  )
                }
              >
                Previous
              </Button>

              <span className="flex items-center px-3 text-sm">
                Page {data.page} /{' '}
                {data.totalPages || 1}
              </span>

              <Button
                variant="outline"
                disabled={
                  page >=
                  data.totalPages
                }
                onClick={() =>
                  setPage(
                    (p) =>
                      p + 1,
                  )
                }
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      <HashtagDialog
        open={dialogOpen}
        hashtag={editingHashtag}
        loading={mutationLoading}
        onOpenChange={
          setDialogOpen
        }
        onSubmit={handleSubmit}
      />

      <HashtagDeleteDialog
        open={deleteOpen}
        hashtag={
          deletingHashtag
        }
        loading={mutationLoading}
        onOpenChange={
          setDeleteOpen
        }
        onConfirm={handleDelete}
      />
    </div>
  );
}