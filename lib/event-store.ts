'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Json } from '@/types/supabase';

export interface TicketType {
  name: string;
  price: number;
  description?: string;
  quantity?: number;
}

export interface EventFormData {
  title: string;
  ingress?: string;
  body?: string;
  from_date?: Date;
  to_date?: Date;
  has_time_slot: boolean;
  time_slot_start?: string;
  time_slot_end?: string;
  location?: string;
  templateId: string;
  cover_image_url?: string;
  images: string[];
  ticket_types: TicketType[];
  entrance: string[];
  parking: string[];
  camping: string[];
  customStyles?: Record<string, any>;
}

interface EventStore {
  formData: EventFormData;
  setFormData: (data: Partial<EventFormData>) => void;
  resetForm: () => void;
}

const initialState: EventFormData = {
  title: '',
  templateId: '',
  has_time_slot: false,
  images: [],
  ticket_types: [],
  entrance: [],
  parking: [],
  camping: [],
};

export const useEventStore = create<EventStore>()(
  persist(
    (set) => ({
      formData: initialState,
      setFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),
      resetForm: () => set({ formData: initialState }),
    }),
    {
      name: 'event-store',
    }
  )
);
