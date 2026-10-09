'use client';

import {
  useEffect,
  useState,
} from 'react';

import type {
  CreateLocationInput,
  UpdateLocationInput,
  Location,
} from '../types/location.types';

type LocationFormInput =
  | CreateLocationInput
  | UpdateLocationInput;

interface LocationFormDialogProps {
  open: boolean;
  location?: Location | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (
    input: LocationFormInput,
  ) => Promise<void>;
}

export function LocationFormDialog({
  open,
  location,
  loading,
  onClose,
  onSubmit,
}: LocationFormDialogProps) {
  const [
    name,
    setName,
  ] = useState('');

  const [
    address,
    setAddress,
  ] = useState('');

  const [
    province,
    setProvince,
  ] = useState('');

  const [
    latitude,
    setLatitude,
  ] = useState('');

  const [
    longitude,
    setLongitude,
  ] = useState('');

  useEffect(() => {
    if (!open) {
      return;
    }

    setName(
      location?.name ?? '',
    );

    setAddress(
      location?.address ?? '',
    );

    setProvince(
      location?.province ?? '',
    );

    setLatitude(
      location?.latitude != null
        ? String(location.latitude)
        : '',
    );

    setLongitude(
      location?.longitude != null
        ? String(location.longitude)
        : '',
    );
  }, [
    open,
    location,
  ]);

  if (!open) {
    return null;
  }


async function handleSubmit(
  event: React.FormEvent,
) {
  event.preventDefault();

  const input = {
    name: name.trim(),
    address: address.trim() || null,
    province: province.trim() || null,
    latitude:
      latitude !== ''
        ? Number(latitude)
        : null,
    longitude:
      longitude !== ''
        ? Number(longitude)
        : null,
  };

  if (location) {
    await onSubmit({
      id: location.id,
      ...input,
    });
  } else {
    await onSubmit(input);
  }

  onClose();
}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg space-y-4 rounded-lg bg-background p-6 shadow-lg"
      >
        <div>
          <h2 className="text-lg font-semibold">
            {location
              ? 'Edit Location'
              : 'Create Location'}
          </h2>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Name
          </label>

          <input
            value={name}
            onChange={(event) =>
              setName(
                event.target.value,
              )
            }
            required
            maxLength={255}
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Address
          </label>

          <input
            value={address}
            onChange={(event) =>
              setAddress(
                event.target.value,
              )
            }
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Province
          </label>

          <input
            value={province}
            onChange={(event) =>
              setProvince(
                event.target.value,
              )
            }
            maxLength={100}
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Latitude
            </label>

            <input
              type="number"
              step="any"
              value={latitude}
              onChange={(event) =>
                setLatitude(
                  event.target.value,
                )
              }
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Longitude
            </label>

            <input
              type="number"
              step="any"
              value={longitude}
              onChange={(event) =>
                setLongitude(
                  event.target.value,
                )
              }
              className="w-full rounded-md border px-3 py-2"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border px-4 py-2"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
          >
            {loading
              ? 'Saving...'
              : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}