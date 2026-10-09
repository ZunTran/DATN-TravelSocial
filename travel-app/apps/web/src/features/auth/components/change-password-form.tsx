'use client';

import { FormEvent, useState } from 'react';
import { Eye, EyeOff, KeyRound, Loader2 } from 'lucide-react';

import { useChangePassword } from '../hooks/use-change-password';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ChangePasswordFormProps {
  onSuccess?: () => void;
}

type PasswordField = 'current' | 'new' | 'confirm';

export default function ChangePasswordForm({
  onSuccess,
}: ChangePasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState<
    Record<PasswordField, boolean>
  >({
    current: false,
    new: false,
    confirm: false,
  });

  const [validationError, setValidationError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    changePassword,
    loading,
    error,
  } = useChangePassword();

  const togglePassword = (field: PasswordField) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setValidationError('');
    setSuccess(false);

    if (!currentPassword.trim()) {
      setValidationError('Vui lòng nhập mật khẩu hiện tại.');
      return;
    }

    if (!newPassword.trim()) {
      setValidationError('Vui lòng nhập mật khẩu mới.');
      return;
    }

    if (newPassword.length < 6) {
      setValidationError(
        'Mật khẩu mới phải có ít nhất 6 ký tự.',
      );
      return;
    }

    if (newPassword === currentPassword) {
      setValidationError(
        'Mật khẩu mới phải khác mật khẩu hiện tại.',
      );
      return;
    }

    if (!confirmPassword.trim()) {
      setValidationError(
        'Vui lòng xác nhận mật khẩu mới.',
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setValidationError(
        'Mật khẩu xác nhận không khớp.',
      );
      return;
    }

    try {
      const result = await changePassword(
        currentPassword,
        newPassword,
      );

      if (!result) {
        setValidationError(
          'Không thể thay đổi mật khẩu.',
        );
        return;
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccess(true);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Change password error:', err);
    }
  };

  const getErrorMessage = () => {
    if (!error) {
      return '';
    }

    const message = error.message;

    if (
      message.includes('Mật khẩu hiện tại không đúng') ||
      message.toLowerCase().includes('incorrect')
    ) {
      return 'Mật khẩu hiện tại không đúng.';
    }

    if (
      message.includes('mạng xã hội') ||
      message.toLowerCase().includes('oauth')
    ) {
      return 'Tài khoản đăng nhập bằng mạng xã hội không hỗ trợ đổi mật khẩu.';
    }

    return message || 'Đã xảy ra lỗi khi đổi mật khẩu.';
  };

  const backendError = getErrorMessage();

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <KeyRound className="h-5 w-5" />
          </div>

          <div>
            <CardTitle>Change password</CardTitle>
            <CardDescription>
              Update your password to keep your account secure.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {validationError && (
            <Alert variant="destructive">
              <AlertDescription>
                {validationError}
              </AlertDescription>
            </Alert>
          )}

          {backendError && !validationError && (
            <Alert variant="destructive">
              <AlertDescription>
                {backendError}
              </AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription>
                Đổi mật khẩu thành công. Vui lòng đăng nhập lại.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="current-password">
              Current password
            </Label>

            <div className="relative">
              <Input
                id="current-password"
                type={
                  showPassword.current
                    ? 'text'
                    : 'password'
                }
                value={currentPassword}
                onChange={(event) =>
                  setCurrentPassword(event.target.value)
                }
                placeholder="Enter your current password"
                autoComplete="current-password"
                disabled={loading}
                className="pr-10"
              />

              <button
                type="button"
                onClick={() =>
                  togglePassword('current')
                }
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={
                  showPassword.current
                    ? 'Hide password'
                    : 'Show password'
                }
              >
                {showPassword.current ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">
              New password
            </Label>

            <div className="relative">
              <Input
                id="new-password"
                type={
                  showPassword.new
                    ? 'text'
                    : 'password'
                }
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(event.target.value)
                }
                placeholder="Enter your new password"
                autoComplete="new-password"
                disabled={loading}
                className="pr-10"
              />

              <button
                type="button"
                onClick={() =>
                  togglePassword('new')
                }
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={
                  showPassword.new
                    ? 'Hide password'
                    : 'Show password'
                }
              >
                {showPassword.new ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              Password must contain at least 6 characters.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">
              Confirm new password
            </Label>

            <div className="relative">
              <Input
                id="confirm-password"
                type={
                  showPassword.confirm
                    ? 'text'
                    : 'password'
                }
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="Confirm your new password"
                autoComplete="new-password"
                disabled={loading}
                className="pr-10"
              />

              <button
                type="button"
                onClick={() =>
                  togglePassword('confirm')
                }
                disabled={loading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={
                  showPassword.confirm
                    ? 'Hide password'
                    : 'Show password'
                }
              >
                {showPassword.confirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}

            {loading
              ? 'Changing password...'
              : 'Change password'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

