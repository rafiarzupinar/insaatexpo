import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Material, Supplier, Equipment } from '../../types';

interface ResourcesState {
  materials: Material[];
  suppliers: Supplier[];
  equipment: Equipment[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ResourcesState = {
  materials: [],
  suppliers: [],
  equipment: [],
  isLoading: false,
  error: null,
};

const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    setMaterials: (state, action: PayloadAction<Material[]>) => {
      state.materials = action.payload;
      state.error = null;
    },
    addMaterial: (state, action: PayloadAction<Material>) => {
      state.materials.push(action.payload);
    },
    updateMaterial: (state, action: PayloadAction<Material>) => {
      const index = state.materials.findIndex(m => m.id === action.payload.id);
      if (index !== -1) {
        state.materials[index] = action.payload;
      }
    },
    deleteMaterial: (state, action: PayloadAction<string>) => {
      state.materials = state.materials.filter(m => m.id !== action.payload);
    },
    setSuppliers: (state, action: PayloadAction<Supplier[]>) => {
      state.suppliers = action.payload;
    },
    addSupplier: (state, action: PayloadAction<Supplier>) => {
      state.suppliers.push(action.payload);
    },
    updateSupplier: (state, action: PayloadAction<Supplier>) => {
      const index = state.suppliers.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.suppliers[index] = action.payload;
      }
    },
    deleteSupplier: (state, action: PayloadAction<string>) => {
      state.suppliers = state.suppliers.filter(s => s.id !== action.payload);
    },
    setEquipment: (state, action: PayloadAction<Equipment[]>) => {
      state.equipment = action.payload;
    },
    addEquipment: (state, action: PayloadAction<Equipment>) => {
      state.equipment.push(action.payload);
    },
    updateEquipment: (state, action: PayloadAction<Equipment>) => {
      const index = state.equipment.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.equipment[index] = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  setMaterials,
  addMaterial,
  updateMaterial,
  deleteMaterial,
  setSuppliers,
  addSupplier,
  updateSupplier,
  deleteSupplier,
  setEquipment,
  addEquipment,
  updateEquipment,
  setLoading,
  setError,
} = resourcesSlice.actions;
export default resourcesSlice.reducer;
