'use client';

import React from 'react';
import { User, Camera } from 'lucide-react';

type Props = {
  userId: string;
  avatarUrl?: string | null;
  onAvatarUpdated?: (url: string | null) => void;
};

export default function ProfileImageManager({ avatarUrl }: Props) {
  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* Avatar Preview */}
      <div className="relative w-28 h-28 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden flex items-center justify-center">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt="Profile avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-purple-400/10" />
            <User className="h-12 w-12 text-zinc-500 relative z-10" />
          </>
        )}

        {/* Overlay hint */}
        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-full cursor-default">
          <Camera className="h-6 w-6 text-white/70" />
        </div>
      </div>

      <p className="text-[10px] text-zinc-500 text-center leading-relaxed max-w-[180px]">
        Avatar upload coming soon
      </p>
    </div>
  );
}