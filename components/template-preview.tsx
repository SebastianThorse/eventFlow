import { useEffect, useState } from "react";
import { Template } from "@/lib/templates";
import { EventFormData } from "@/lib/event-store";
import { format } from "date-fns";

interface TemplatePreviewProps {
  template: Template;
  formData: EventFormData;
}

export function TemplatePreview({ template, formData }: TemplatePreviewProps) {
  const [previewStyle, setPreviewStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    // Set different styles based on template
    switch (template.id) {
      case 'minimalist-modern':
        setPreviewStyle({
          backgroundColor: '#ffffff',
          color: '#1a1a1a',
          fontFamily: 'system-ui',
        });
        break;
      case 'elegant-classic':
        setPreviewStyle({
          backgroundColor: '#f8f5f0',
          color: '#2c1810',
          fontFamily: 'serif',
        });
        break;
      case 'vibrant-festival':
        setPreviewStyle({
          backgroundColor: '#fef6e4',
          color: '#001858',
          fontFamily: 'sans-serif',
        });
        break;
      default:
        setPreviewStyle({});
    }
  }, [template.id]);

  return (
    <div className="rounded-lg border shadow-sm" style={previewStyle}>
      {/* Cover Image */}
      {formData.cover_image_url && (
        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
          <img
            src={formData.cover_image_url}
            alt={formData.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className={template.id === 'elegant-classic' ? 'text-center' : ''}>
          <h1 className={`text-2xl font-bold ${
            template.id === 'vibrant-festival' ? 'text-4xl uppercase' : ''
          }`}>
            {formData.title || 'Event Title'}
          </h1>
          {formData.ingress && (
            <p className="mt-2 text-muted-foreground">
              {formData.ingress}
            </p>
          )}
        </div>

        {/* Event Details */}
        <div className={`grid gap-4 ${
          template.id === 'elegant-classic' ? 'text-center' : 'md:grid-cols-2'
        }`}>
          {/* Date & Time */}
          <div>
            <h3 className="font-semibold">Date & Time</h3>
            <p>
              {formData.from_date && format(new Date(formData.from_date), 'PPP')}
              {formData.has_time_slot && formData.time_slot_start && (
                <span> at {formData.time_slot_start}</span>
              )}
            </p>
            {formData.to_date && new Date(formData.to_date).toDateString() !== new Date(formData.from_date || '').toDateString() && (
              <p>
                To: {format(new Date(formData.to_date), 'PPP')}
                {formData.has_time_slot && formData.time_slot_end && (
                  <span> at {formData.time_slot_end}</span>
                )}
              </p>
            )}
          </div>

          {/* Location */}
          {formData.location && (
            <div>
              <h3 className="font-semibold">Location</h3>
              <p>{formData.location}</p>
            </div>
          )}
        </div>

        {/* Description */}
        {formData.body && (
          <div className={template.id === 'elegant-classic' ? 'text-center' : ''}>
            <h3 className="font-semibold">About the Event</h3>
            <p className="mt-2 whitespace-pre-wrap">{formData.body}</p>
          </div>
        )}

        {/* Ticket Types */}
        {formData.ticket_types && formData.ticket_types.length > 0 && (
          <div>
            <h3 className="font-semibold">Tickets</h3>
            <div className={`mt-2 grid gap-4 ${
              template.id === 'minimalist-modern' ? 'md:grid-cols-2' :
              template.id === 'elegant-classic' ? 'divide-y' :
              'md:grid-cols-3'
            }`}>
              {formData.ticket_types.map((ticket, index) => (
                <div
                  key={index}
                  className={`${
                    template.id === 'elegant-classic' ? 'py-4' : 'rounded-lg border p-4'
                  }`}
                >
                  <div className="flex justify-between">
                    <h4 className="font-medium">{ticket.name}</h4>
                    <p className="font-semibold">${ticket.price}</p>
                  </div>
                  {ticket.description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {ticket.description}
                    </p>
                  )}
                  {ticket.quantity && (
                    <p className="mt-1 text-sm">
                      {ticket.quantity} tickets available
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Information */}
        <div className={`grid gap-6 ${
          template.id === 'minimalist-modern' ? 'md:grid-cols-3' :
          template.id === 'elegant-classic' ? '' :
          'md:grid-cols-2'
        }`}>
          {/* Entrance Info */}
          {formData.entrance && formData.entrance.length > 0 && (
            <div>
              <h3 className="font-semibold">Entrance Information</h3>
              <ul className="mt-2 list-inside list-disc space-y-1">
                {formData.entrance.map((info, index) => (
                  <li key={index}>{info}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Parking Info */}
          {formData.parking && formData.parking.length > 0 && (
            <div>
              <h3 className="font-semibold">Parking Information</h3>
              <ul className="mt-2 list-inside list-disc space-y-1">
                {formData.parking.map((info, index) => (
                  <li key={index}>{info}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Camping Info */}
          {formData.camping && formData.camping.length > 0 && (
            <div>
              <h3 className="font-semibold">Camping Information</h3>
              <ul className="mt-2 list-inside list-disc space-y-1">
                {formData.camping.map((info, index) => (
                  <li key={index}>{info}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
