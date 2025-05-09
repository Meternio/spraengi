"use client";

import { createContext, useRef, useContext, ReactNode } from "react";
import { useStore } from "zustand";

import {
  createDatasourcesStore,
  DatasourcesStore,
  DatasourcesState,
} from "@/lib/datasourcesStore";

export type DatasourcesStoreApi = ReturnType<typeof createDatasourcesStore>;

export const DatasourcesStoreContext = createContext<
  DatasourcesStoreApi | undefined
>(undefined);

export interface DatasourcesStoreProviderProps {
  children: ReactNode;
  initialData: DatasourcesState;
}

export const DatasourcesStoreProvider = ({
  children,
  initialData,
}: DatasourcesStoreProviderProps) => {
  const storeRef = useRef<DatasourcesStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createDatasourcesStore(initialData);
  }

  return (
    <DatasourcesStoreContext.Provider value={storeRef.current}>
      {children}
    </DatasourcesStoreContext.Provider>
  );
};

export const useDatasourcesStore = <T,>(
  selector: (store: DatasourcesStore) => T
): T => {
  const datasourcesStoreContext = useContext(DatasourcesStoreContext);

  if (!datasourcesStoreContext) {
    throw new Error(
      `useDatasourcesStore must be used within DatasourcesStoreProvider`
    );
  }

  return useStore(datasourcesStoreContext, selector);
};
