"use client";

import React from "react";

type AppLayoutProps = {
  children: React.ReactNode;
};

/**
 * AppLayout acts as a lightweight pass-through wrapper.
 * The persistent shell, sidebar, and header are managed by AppShell in app/layout.tsx
 * to ensure only the <main> section changes on navigation.
 */
export function AppLayout({ children }: AppLayoutProps) {
  return <>{children}</>;
}
