'use client';

import ManagedImage from './ManagedImage';

export default function Logo({ className, showText = false }: { className?: string; showText?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${className || ''}`}>
      <div className="relative h-8 w-8 sm:h-10 sm:w-10 overflow-hidden rounded-md bg-white/5 border border-white/10">
        <ManagedImage src="/images/rare.jpeg" alt="RARE RAB IT logo" fill imgClassName="object-contain p-1" sizes="40px" />
      </div>

      {showText && (
        <span className="hidden sm:inline-flex items-center gap-4">
          <span className="flex flex-col leading-none">
            <span className="block text-sm uppercase tracking-[0.35em] text-white">
              RARE&nbsp;RAB&nbsp;IT
            </span>
            <span className="block mt-1 h-[1px] w-16 bg-gradient-to-r from-cyan-300/60 via-purple-300/60 to-transparent" />
          </span>

          <span className="flex flex-col leading-none">
            <span className="block text-sm uppercase tracking-[0.35em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">
              Premium&nbsp;Luxury
            </span>
          </span>
        </span>
      )}
    </div>
  );
}