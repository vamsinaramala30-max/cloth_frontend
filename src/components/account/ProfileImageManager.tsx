'use client';

import React, { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Cropper from 'cropperjs';


import { supabase, SUPABASE_STORAGE_BUCKET } from '@/lib/supabaseClient';

type Props = {
  userId: string;
  avatarUrl?: string | null;
  onAvatarUpdated?: (url: string | null) => void;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function ProfileImageManager({
  userId,
  avatarUrl,
  onAvatarUpdated,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const cropperRef = useRef<Cropper | null>(null);

  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [cropping, setCropping] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canUpload = !!userId && !busy;

  const avatarPreview = useMemo(() => {
    return selectedFileUrl || avatarUrl || null;
  }, [selectedFileUrl, avatarUrl]);

  const bucketPath = useMemo(() => {
    // Keep deterministic path so update/delete is simple.
    return `avatars/${userId}/avatar.jpg`;
  }, [userId]);

  const openFilePicker = () => {
    setError(null);
    fileInputRef.current?.click();
  };

  const initCropper = (imgEl: HTMLImageElement) => {
    cropperRef.current?.destroy();

    cropperRef.current = new Cropper(imgEl, {
      // Keep TS compatible with the installed cropperjs types
      // @ts-expect-error cropperjs types vary by version
      aspectRatio: 1,
      viewMode: 1,
      autoCropArea: 1,
      responsive: true,
      background: false,
      zoomable: true,
      movable: true,
      scalable: false,
      cropBoxResizable: true,
    });
  };

  const handleFileSelected = async (file: File) => {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }

    // Read as data URL for Cropper.
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });

    setSelectedFileUrl(dataUrl);
    setCropping(true);
  };

  const handleConfirmCrop = async () => {
    try {
      setError(null);
      setBusy(true);

      const cropper = cropperRef.current;
      if (!cropper) throw new Error('Cropper not ready');

      // cropperjs types vary; fall back to getCropperCanvas when needed.
      const canvas: HTMLCanvasElement | null =
        (cropper as any).getCroppedCanvas
          ? (cropper as any).getCroppedCanvas({
              width: 512,
              height: 512,
              imageSmoothingEnabled: true,
              imageSmoothingQuality: 'high',
            })
          : (cropper as any).getCropperCanvas
            ? (cropper as any).getCropperCanvas()
            : null;

      if (!canvas) throw new Error('Failed to crop image');

      const blob: Blob | null = await new Promise((resolve) => {
        canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.82);
      });

      if (!blob) throw new Error('Failed to compress image');

      const { error: uploadError } = await supabase.storage
        .from(SUPABASE_STORAGE_BUCKET)
        .upload(bucketPath, blob, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage
        .from(SUPABASE_STORAGE_BUCKET)
        .getPublicUrl(bucketPath);

      const publicUrl = publicData.publicUrl;

      const { error: dbError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (dbError) {
        setError('Uploaded, but could not save avatar URL to profiles table yet.');
      }

      onAvatarUpdated?.(publicUrl);

      cropperRef.current?.destroy();
      cropperRef.current = null;
      setSelectedFileUrl(null);
      setCropping(false);
    } catch (e: any) {
      setError(e?.message || 'Failed to upload avatar');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    try {
      setError(null);
      setBusy(true);

      const { error: delError } = await supabase.storage
        .from(SUPABASE_STORAGE_BUCKET)
        .remove([bucketPath]);

      if (delError) {
        // If object doesn't exist, treat as success.
      }

      const { error: dbError } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('id', userId);

      if (dbError) {
        setError('Deleted from storage, but could not clear avatar URL in profiles yet.');
      }

      onAvatarUpdated?.(null);
      cropperRef.current?.destroy();
      cropperRef.current = null;
      setSelectedFileUrl(null);
      setCropping(false);
    } catch (e: any) {
      setError(e?.message || 'Failed to delete avatar');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-5">
        <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm">
          {avatarPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <Image
              src={avatarPreview}
              alt="Profile avatar"
              fill
              className="object-cover"
              sizes="112px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-zinc-500 text-sm">
              No photo
            </div>
          )}
          <motion.div
            className="absolute -inset-2 rounded-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          />
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap gap-2">
            <button
              className="px-4 py-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 transition-all text-xs md:text-sm text-white"
              onClick={openFilePicker}
              disabled={!canUpload}
            >
              Upload
            </button>

            <button
              className="px-4 py-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 transition-all text-xs md:text-sm text-white"
              onClick={openFilePicker}
              disabled={!canUpload}
            >
              Update
            </button>

            <button
              className="px-4 py-2 rounded-lg border border-red-400/20 bg-red-500/10 hover:bg-red-500/20 transition-all text-xs md:text-sm text-red-200"
              onClick={handleDelete}
              disabled={!canUpload}
            >
              Delete
            </button>
          </div>

          <p className="mt-2 text-xs text-zinc-400">
            Image is cropped to square and compressed before upload.
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFileSelected(file);
          // reset so selecting the same file triggers change
          if (e.currentTarget) e.currentTarget.value = '';
        }}
      />

      {cropping ? (
        <div className="mt-6 p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <div className="text-sm font-semibold text-white tracking-wide">Crop & Preview</div>
              <div className="text-xs text-zinc-400">Centered square crop. Zoom for precision.</div>
            </div>
            <button
              className="text-xs text-zinc-300 hover:text-white"
              onClick={() => {
                cropperRef.current?.destroy();
                cropperRef.current = null;
                setSelectedFileUrl(null);
                setCropping(false);
              }}
            >
              Close
            </button>
          </div>

          <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-white/10 bg-black/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={selectedFileUrl ?? undefined}
              alt="Crop source"
              className="w-full h-full object-contain"
              onLoad={() => {
                const imgEl = imgRef.current;
                if (imgEl) initCropper(imgEl);
              }}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-400 to-purple-400 text-black font-bold tracking-widest uppercase text-xs hover:shadow-lg hover:shadow-cyan-400/50 transition-all disabled:opacity-60"
              onClick={() => void handleConfirmCrop()}
              disabled={busy}
            >
              {busy ? 'Uploading…' : 'Confirm Upload'}
            </button>

            <button
              className="px-4 py-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 transition-all text-xs text-white disabled:opacity-60"
              onClick={() => {
                cropperRef.current?.destroy();
                cropperRef.current = null;
                setSelectedFileUrl(null);
                setCropping(false);
              }}
              disabled={busy}
            >
              Cancel
            </button>

            {error ? <div className="text-xs text-red-200 mt-2 w-full">{error}</div> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

