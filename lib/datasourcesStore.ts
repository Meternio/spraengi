import { createStore } from "zustand/vanilla";

// Define the types for the new structure
export interface DatasourcesState {
  datasources: Record<string, Record<string, string>>;
  isLoading: boolean;
  version: 'draft' | 'published';
}

export interface DatasourcesActions {
  setDatasources: (data: Record<string, Record<string, string>>) => void;
  getValue: (datasourceName: string, key: string) => string | undefined;
  getDatasource: (name: string) => Record<string, string> | undefined;
}

export type DatasourcesStore = DatasourcesState & DatasourcesActions;

export const initDatasourcesStore = (): DatasourcesState => ({
  datasources: {},
  isLoading: true,
  version: "draft",
});

export const defaultInitState: DatasourcesState = initDatasourcesStore();

export const createDatasourcesStore = (
  initState: DatasourcesState = defaultInitState
) =>
  createStore<DatasourcesStore>()((set, get) => ({
    ...initState,

    // Set all datasources
    setDatasources: (data) => set({ datasources: data, isLoading: false }),

    // Get a specific datasource object
    getDatasource: (name) => get().datasources[name],

    // Get a specific value by key
    getValue: (datasourceName, key) => {
      const datasource = get().datasources[datasourceName];
      return datasource ? datasource[key] : undefined;
    },
  }));
