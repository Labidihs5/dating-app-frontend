'use client';

import React from "react"

export function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <main className="pb-20 md:pb-0 md:ml-20">
      {children}
    </main>
  );
}
