"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {Camera, Check, Flag, Loader2, MoreHorizontal, Pencil} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle} from "@/components/ui/alert-dialog";

import type { UserProfile } from "../../types/profile";
import { MediaLightbox } from "@/features/social/components/media-lightbox";
import { toast } from "sonner";
interface ProfileHeaderProps {
  profile: UserProfile;
  isOwnProfile?: boolean;
  isFollowing?: boolean;
  onFollow?: () => void;
  followLoading?: boolean;
  onUnfollow?: () => void;
  onEditAvatar?: ( file: File ) => Promise<UserProfile>;
  onEditCover?: () => void;
}

export default function ProfileHeader({
  profile,
  isOwnProfile = true,
  isFollowing = false,
  onFollow,
  followLoading = false,
  onUnfollow,
  onEditAvatar,
  onEditCover,
}: ProfileHeaderProps) {
  const {
    username,
    display_name,
    bio,
    avatar_url,
    cover_url,
  } = profile;


  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarSuccess, setAvatarSuccess] =useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const displayName = display_name || username || "User";
  const initials = displayName.slice(0, 2).toUpperCase();


  const handleAvatarChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file =event.target.files?.[0];

    if (!file || !onEditAvatar) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      console.error( "Avatar must be an image file." );
      event.target.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      console.error(
        "Avatar file must be smaller than 10MB.",
      );

      event.target.value = "";
      return;
    }

    try {
      setAvatarUploading(true);

      const updatedProfile =
        await onEditAvatar(file);

      console.log( "Avatar updated:", updatedProfile);


      toast.success( "Cập nhật ảnh đại diện thành công!");
    } catch (error) {
      console.error(
        "Update avatar failed:",
        error,
      );
    } finally {
      setAvatarUploading(false);
      event.target.value = "";
    }
  };

  const handleAvatarButtonClick = () => {
    if (avatarUploading) {
      return;
    }

    avatarInputRef.current?.click();
  };

  return (
    <>

      <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="relative h-48 w-full bg-muted sm:h-60">
          {cover_url ? (
            <Image
              src={cover_url}
              alt={`${displayName} cover`}
              fill
              priority
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-muted via-muted/70 to-background" />
          )}

          {isOwnProfile && (
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="absolute right-4 top-4 h-9 w-9 rounded-full shadow-md"
              onClick={onEditCover}
              aria-label="Change cover photo"
            >
              <Camera className="h-4 w-4" />
            </Button>
          )}
        </div>


        <div className="relative px-5 pb-6 sm:px-8">
          <div className="-mt-16 flex items-end justify-between">

            <div className="relative">
              {avatar_url ? (
                <button
                  type="button"
                  onClick={() =>
                    setAvatarOpen(true)
                  }
                  className="block rounded-full"
                  aria-label="View profile picture"
                >
                  <Avatar className="h-32 w-32 border-4 border-card shadow-lg transition-transform hover:scale-[1.02] sm:h-36 sm:w-36">
                    <AvatarImage
                      src={avatar_url}
                      alt={displayName}
                      className="object-cover"
                    />

                    <AvatarFallback className="text-2xl font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </button>
              ) : (
                <Avatar className="h-32 w-32 border-4 border-card shadow-lg sm:h-36 sm:w-36">
                  <AvatarFallback className="text-2xl font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              )}


              {isOwnProfile && (
                <>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={
                      handleAvatarChange
                    }
                  />

                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    disabled={avatarUploading}
                    className="absolute bottom-1 right-1 h-9 w-9 rounded-full border-2 border-card shadow-md"
                    onClick={
                      handleAvatarButtonClick
                    }
                    aria-label="Change avatar"
                  >
                    {avatarUploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Pencil className="h-4 w-4" />
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {displayName}
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                @{username}
              </p>

              {bio && (
                <p className="mt-4 max-w-2xl text-sm leading-6 text-foreground/80">
                  {bio}
                </p>
              )}
            </div>

            {!isOwnProfile && (
              <div className="flex shrink-0 items-center gap-2">
                <Button
                  type="button"
                  variant={
                    isFollowing ? "outline": "default"
                  }
                  className="rounded-full px-5"
                  onClick={onFollow}
                  disabled={followLoading}
                >
                  {isFollowing ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Following
                    </>) : ( "Follow")}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 rounded-full"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="w-48"
                  >
                    <DropdownMenuItem
                      className="cursor-pointer text-destructive focus:text-destructive"
                      onClick={() =>
                        setReportOpen(true)
                      }
                    >
                      <Flag className="mr-2 h-4 w-4" />
                      Report User
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem disabled className="text-muted-foreground">
                      More actions coming soon
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>

        {avatar_url && (
          <MediaLightbox
            media={[
              {
                mediaUrl: avatar_url,
                mediaType: "IMAGE",
              },
            ]}
            currentIndex={0}
            open={avatarOpen}
            onClose={() =>
              setAvatarOpen(false)
            }
            onIndexChange={() => {}}
          />
        )}
      </section>

      <AlertDialog
        open={reportOpen}
        onOpenChange={setReportOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Report @{username}?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to report
              this user? We will review the
              report and take appropriate
              action if necessary.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                setReportOpen(false);
              }}
            >
              Report User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}