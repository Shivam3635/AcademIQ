'use client';

import { useEffect, useState } from 'react';
import { UserNav } from './user-nav';
import { Skeleton } from './ui/skeleton';

export function UserNavClient() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <Skeleton className="h-9 w-9 rounded-full" />;
  }

  return <UserNav />;
}
