import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface EventFormData {
  title: string;
  description?: string;
  date?: Date;
  location?: string;
  coverImageUrl?: string;
  templateId: string;
}

interface EventStore {
  event: EventFormData;
  setEvent: (data: Partial<EventFormData>) => void;
  resetEvent: () => void;
}

const initialState: EventFormData = {
  title: 'Event Title',
  description: '',
  date: undefined,
  location: '',
  coverImageUrl: '',
  templateId: 'minimalist',
};

export const useEventStore = create<EventStore>()(
  persist(
    (set) => ({
      event: initialState,
      setEvent: (data) =>
        set((state) => ({
          event: { ...state.event, ...data },
        })),
      resetEvent: () => set({ event: initialState }),
    }),
    {
      name: 'event-store',
    }
  )
);
