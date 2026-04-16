'use client';

import { useSetting } from '@/hooks/use-settings';

export function AnnouncementBar() {
  const text = useSetting('announcement_text');

  if (!text) return null;

  return (
    <div className="bg-primary text-black font-semibold text-sm py-2 px-4 text-center">
      {text}
    </div>
  );
}
