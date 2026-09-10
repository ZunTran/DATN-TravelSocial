'use client';

import {
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react';

import {
  Button,
} from '@/components/ui/button';

import {
  Badge,
} from '@/components/ui/badge';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type {
  AdminHashtag,
} from '../types/hashtag.types';

interface HashtagTableProps {
  hashtags: AdminHashtag[];
  onEdit: (
    hashtag: AdminHashtag,
  ) => void;
  onDelete: (
    hashtag: AdminHashtag,
  ) => void;
}

export function HashtagTable({
  hashtags,
  onEdit,
  onDelete,
}: HashtagTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Hashtag</TableHead>
            <TableHead>Posts</TableHead>
            <TableHead className="w-[70px]" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {hashtags.map((hashtag) => (
            <TableRow key={hashtag.id}>
              <TableCell>
                <div className="font-medium">
                  #{hashtag.name}
                </div>
              </TableCell>

              <TableCell>
                <Badge variant="secondary">
                  {hashtag.postCount}
                </Badge>
              </TableCell>

              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                    >
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        onEdit(hashtag)
                      }
                    >
                      <Pencil />
                      Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() =>
                        onDelete(hashtag)
                      }
                    >
                      <Trash2 />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}