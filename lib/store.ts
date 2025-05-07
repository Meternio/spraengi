import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define the types for the new structure
export interface DatasourceState {
  datasources: Record<string, Record<string, string>>;
  isLoading: boolean;
  
  // Actions
  setDatasources: (data: Record<string, Record<string, string>>) => void;
  
  // Selectors
  getValue: (datasourceName: string, key: string) => string | undefined;
  getDatasource: (name: string) => Record<string, string> | undefined;
}

// Create the store with sessionStorage
export const useStore = create<DatasourceState>()(
  persist(
    (set, get) => ({
      datasources: {},
      isLoading: true,
      
      // Set all datasources
      setDatasources: (data) => set({ datasources: data, isLoading: false }),
      
      // Get a specific datasource object
      getDatasource: (name) => get().datasources[name],
      
      // Get a specific value by key
      getValue: (datasourceName, key) => {
        const datasource = get().datasources[datasourceName];
        return datasource ? datasource[key] : undefined;
      },
    }),
    {
      name: 'spraengi-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);