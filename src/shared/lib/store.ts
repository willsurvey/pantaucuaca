import { create } from "zustand";

interface AppState {
  selectedCity: string | null;
  comparisonCities: string[];
  setSelectedCity: (city: string | null) => void;
  addComparisonCity: (city: string) => void;
  removeComparisonCity: (city: string) => void;
  clearComparison: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedCity: null,
  comparisonCities: [],
  setSelectedCity: (city) => set({ selectedCity: city }),
  addComparisonCity: (city) =>
    set((state) => {
      if (state.comparisonCities.length >= 3) return state;
      if (state.comparisonCities.includes(city)) return state;
      return { comparisonCities: [...state.comparisonCities, city] };
    }),
  removeComparisonCity: (city) =>
    set((state) => ({
      comparisonCities: state.comparisonCities.filter((c) => c !== city),
    })),
  clearComparison: () => set({ comparisonCities: [] }),
}));
