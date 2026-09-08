'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAdminInterests } from '@/features/admin/hooks/use-admin-interests';
import { InterestDialog } from '@/features/admin/components/interest-dialog';
import type { AdminInterest } from '@/features/admin/types/interest.types';

export default function AdminInterestsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingInterest, setEditingInterest] = useState<AdminInterest | null>(null);

  const {
    interests,
    pagination,
    loading,
    error,
    createInterest,
    updateInterest,
    deleteInterest,
    createLoading,
    updateLoading,
    deleteLoading,
  } = useAdminInterests(page, search);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const openCreate = () => {
    setEditingInterest(null);
    setDialogOpen(true);
  };

  const openEdit = (interest: AdminInterest) => {
    setEditingInterest(interest);
    setDialogOpen(true);
  };

  const handleSubmit = async (name: string, icon?: File | null) => {
    try {
      if (editingInterest) {
        await updateInterest(editingInterest.id, name, icon);
        toast.success('Cập nhật interest thành công!');
      } else {
        await createInterest(name, icon);
        toast.success('Thêm interest thành công!');
      }

      setDialogOpen(false);
      setEditingInterest(null);
    } catch (error) {
      console.error('Interest mutation failed:', error);
      toast.error(error instanceof Error ? error.message : 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (interest: AdminInterest) => {
    const confirmed = window.confirm(`Bạn có chắc muốn xóa interest "${interest.name}" không?`);

    if (!confirmed) return;

    try {
      await deleteInterest(interest.id);
      toast.success(`Đã xóa interest "${interest.name}"`);
    } catch (error) {
      console.error('Delete interest failed:', error);
      toast.error(error instanceof Error ? error.message : 'Xóa interest thất bại');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Interests</h1>
          <p className="mt-1 text-sm text-muted-foreground">Quản lý các sở thích của người dùng</p>
        </div>

        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm Interest
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Tìm kiếm interest..."
          className="pl-9"
        />
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          Không thể tải danh sách interest.
          <br />
          {error.message}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border bg-background">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/40">
              <th className="w-16 px-4 py-3 text-left text-sm font-medium">#</th>
              <th className="w-24 px-4 py-3 text-left text-sm font-medium">Icon</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Created</th>
              <th className="w-32 px-4 py-3 text-right text-sm font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-16 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                </td>
              </tr>
            ) : interests.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-16 text-center text-sm text-muted-foreground">
                  Không có interest nào.
                </td>
              </tr>
            ) : (
              interests.map((interest, index) => (
                <tr key={interest.id} className="border-b last:border-0 hover:bg-muted/20">
                  <td className="px-4 py-4 text-sm text-muted-foreground">
                    {(page - 1) * 20 + index + 1}
                  </td>

                  <td className="px-4 py-4">
                    {interest.icon_url ? (
                      <img src={interest.icon_url} alt={interest.name} className="h-10 w-10 rounded-lg object-cover" />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-xs text-muted-foreground">
                        N/A
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-4 text-sm font-medium">{interest.name}</td>

                  <td className="px-4 py-4 text-sm text-muted-foreground">
                    {new Date(interest.created_at).toLocaleDateString('vi-VN')}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(interest)} title="Chỉnh sửa">
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(interest)}
                        disabled={deleteLoading}
                        title="Xóa"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Tổng cộng <span className="font-medium text-foreground">{pagination.total}</span> interests
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1 || loading}
            onClick={() => setPage((prev) => prev - 1)}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Trước
          </Button>

          <div className="min-w-24 text-center text-sm">
            Trang <span className="font-medium">{pagination.page || page}</span> /{' '}
            <span className="font-medium">{pagination.totalPages || 1}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={loading || page >= pagination.totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Sau
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>

      <InterestDialog
        open={dialogOpen}
        interest={editingInterest}
        loading={createLoading || updateLoading}
        onClose={() => {
          if (createLoading || updateLoading) return;

          setDialogOpen(false);
          setEditingInterest(null);
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

