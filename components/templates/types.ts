import { TicketType } from '@/lib/event-store';

export interface TemplateProps {
  title: string;
  ingress?: string;
  body?: string;
  fromDate?: Date;
  toDate?: Date;
  hasTimeSlot: boolean;
  timeSlotStart?: string;
  timeSlotEnd?: string;
  location?: string;
  coverImageUrl?: string;
  images: string[];
  ticketTypes: TicketType[];
  entrance: string[];
  parking: string[];
  camping: string[];
}
