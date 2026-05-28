import { create } from "zustand";

export type PropertyType = "villa" | "apartment" | "house" | "studio" | null;

interface FilterState {
  search: string;
  type: PropertyType;
  maxPrice: number | null;
  minPrice: number | null;
  bedrooms: number | null;

  setSearch: (value: string) => void;
  setType: (value: PropertyType) => void;
  setMinPrice: (value: number | null) => void;
  setMaxPrice: (value: number | null) => void;
  setBedrooms: (value: number | null) => void;
  resetFilters: () => void;
}

export const useSearchStore = create<FilterState>((set) => ({
  search: "",
  type: null,
  maxPrice: null,
  minPrice: null,
  bedrooms: null,

  setBedrooms: (value) => set({ bedrooms: value }),
  setMaxPrice: (value) => set({ maxPrice: value }),
  setMinPrice: (value) => set({ minPrice: value }),
  setSearch: (value) => set({ search: value }),
  setType: (value) => set({ type: value }),

  resetFilters: () =>
    set({
      search: "",
      type: null,
      maxPrice: null,
      minPrice: null,
      bedrooms: null,
    }),
}));
