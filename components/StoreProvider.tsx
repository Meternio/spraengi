"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

export default function StoreProvider({
  children,
  initialData,
}: {
  children: React.ReactNode;
  initialData: Record<string, Record<string, string>>;
}) {
  const { setDatasources, isLoading } = useStore();

  useEffect(() => {
    if (isLoading && initialData) {
      setDatasources(initialData);
    }
  }, [initialData, setDatasources, isLoading]);

  return <>{children}</>;
}