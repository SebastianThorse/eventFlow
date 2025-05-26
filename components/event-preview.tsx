"use client";

import { useEventStore } from "@/lib/event-store";
import { MinimalistTemplate } from '@/components/templates/minimalist';
import { ElegantTemplate } from '@/components/templates/elegant';
import { BoldTemplate } from '@/components/templates/bold';

export function EventPreview() {
  const { formData } = useEventStore();
  
  const renderTemplate = () => {
    const commonProps = {
      title: formData.title || 'Event Title',
      ingress: formData.ingress,
      body: formData.body,
      fromDate: formData.from_date,
      toDate: formData.to_date,
      hasTimeSlot: formData.has_time_slot,
      timeSlotStart: formData.time_slot_start,
      timeSlotEnd: formData.time_slot_end,
      location: formData.location,
      coverImageUrl: formData.cover_image_url,
      images: formData.images,
      ticketTypes: formData.ticket_types,
      entrance: formData.entrance,
      parking: formData.parking,
      camping: formData.camping,
    };

    switch (formData.templateId) {
      case 'elegant':
        return <ElegantTemplate {...commonProps} />;
      case 'bold':
        return <BoldTemplate {...commonProps} />;
      case 'minimalist':
      default:
        return <MinimalistTemplate {...commonProps} />;
    }
  };
  
  return (
    <div className="overflow-hidden rounded-lg border">
      {renderTemplate()}
    </div>
  );
}
