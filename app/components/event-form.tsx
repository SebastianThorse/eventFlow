"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useEventStore } from "@/lib/event-store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

interface TicketType {
  name: string;
  price: number;
  description?: string;
}

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }).max(100),
  ingress: z.string().max(500, { message: "Ingress must be less than 500 characters." }).optional(),
  body: z.string().max(5000, { message: "Body must be less than 5000 characters." }).optional(),
  from_date: z.date(),
  to_date: z.date(),
  has_time_slot: z.boolean().default(false),
  time_slot_start: z.string().optional(),
  time_slot_end: z.string().optional(),
  location: z.string().max(100).optional(),
  cover_image_url: z.string()
    .refine((val) => val === '' || /^https?:\/\/.+/.test(val), {
      message: "Please enter a valid URL or leave it empty",
    })
    .optional(),
  images: z.array(z.string().url({ message: "Please enter valid URLs." })).default([]),
  ticket_types: z.array(z.object({
    name: z.string(),
    price: z.number(),
    description: z.string().optional(),
  })).default([]),
  entrance: z.array(z.string()).default([]),
  parking: z.array(z.string()).default([]),
  camping: z.array(z.string()).default([]),
});

type FormData = z.infer<typeof formSchema>;

interface EventFormProps {
  templateId: string;
  eventId?: string;
}

export function EventForm({ templateId, eventId }: EventFormProps) {
  const router = useRouter();
  const { user } = useUser();
  const { formData, setFormData } = useEventStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!eventId);

  // Initialize form with Zustand store values
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: formData.title || "",
      ingress: formData.ingress || "",
      body: formData.body || "",
      from_date: formData.from_date ? new Date(formData.from_date) : new Date(),
      to_date: formData.to_date ? new Date(formData.to_date) : new Date(),
      has_time_slot: formData.has_time_slot || false,
      time_slot_start: formData.time_slot_start || "",
      time_slot_end: formData.time_slot_end || "",
      location: formData.location || "",
      cover_image_url: formData.cover_image_url || "",
      images: formData.images || [],
      ticket_types: formData.ticket_types || [],
      entrance: formData.entrance || [],
      parking: formData.parking || [],
      camping: formData.camping || [],
    },
  });

  // Load existing event if we're editing
  useEffect(() => {
    if (eventId) {
      setIsLoading(true);
      // Fetch the event data
      fetch(`/api/events/${eventId}`)
        .then((res) => res.json())
        .then((data) => {
          // Update form values
          form.reset({
            title: data.title,
            ingress: data.ingress || "",
            body: data.body || "",
            from_date: data.from_date ? new Date(data.from_date) : new Date(),
            to_date: data.to_date ? new Date(data.to_date) : new Date(),
            has_time_slot: data.has_time_slot || false,
            time_slot_start: data.time_slot_start || "",
            time_slot_end: data.time_slot_end || "",
            location: data.location || "",
            cover_image_url: data.cover_image_url || "",
            images: data.images || [],
            ticket_types: data.ticket_types || [],
            entrance: data.entrance || [],
            parking: data.parking || [],
            camping: data.camping || [],
          });
          
          // Update store
          setFormData({
            ...data,
            from_date: data.from_date ? new Date(data.from_date) : new Date(),
            to_date: data.to_date ? new Date(data.to_date) : new Date(),
            templateId: data.template_id,
          });
        })
        .catch((error) => {
          console.error("Error loading event:", error);
          toast({
            title: "Error",
            description: "Could not load event data. Please try again.",
            variant: "destructive",
          });
        })
        .finally(() => setIsLoading(false));
    } else {
      // Set template ID in store for new events
      setFormData({ templateId });
    }
  }, [eventId, form, setFormData, templateId]);

  // Watch form values and update the store
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (value) {
        setFormData({
          ...value,
          templateId, // Preserve the template ID
          from_date: value.from_date ? new Date(value.from_date) : new Date(),
          to_date: value.to_date ? new Date(value.to_date) : new Date(),
          images: value.images?.filter(Boolean) as string[] || [],
          ticket_types: value.ticket_types?.filter((ticket): ticket is TicketType => 
            ticket !== undefined && 
            typeof ticket.name === 'string' && 
            typeof ticket.price === 'number'
          ) || [],
          entrance: value.entrance?.filter(Boolean) as string[] || [],
          parking: value.parking?.filter(Boolean) as string[] || [],
          camping: value.camping?.filter(Boolean) as string[] || [],
        });
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, setFormData, templateId]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      router.push("/sign-in");
      return;
    }
    
    setIsSubmitting(true);
    console.log('Starting event update/creation with values:', values);
    
    try {
      const apiEndpoint = eventId ? `/api/events/${eventId}` : "/api/events";
      const method = eventId ? "PUT" : "POST";
      
      // Ensure dates are properly formatted for the API and remove undefined values
      const formattedValues = {
        title: values.title,
        ingress: values.ingress || null,
        body: values.body || null,
        from_date: values.from_date.toISOString(),
        to_date: values.to_date.toISOString(),
        has_time_slot: values.has_time_slot,
        time_slot_start: values.time_slot_start || null,
        time_slot_end: values.time_slot_end || null,
        location: values.location || null,
        cover_image_url: values.cover_image_url || null,
        images: values.images,
        ticket_types: values.ticket_types,
        entrance: values.entrance,
        parking: values.parking,
        camping: values.camping,
        template_id: templateId,
        custom_styles: formData.customStyles || null,
      };
      
      console.log('Sending request to:', apiEndpoint);
      console.log('Request payload:', formattedValues);
      
      const response = await fetch(apiEndpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedValues),
      });
      
      if (!response.ok) {
        const error = await response.json();
        console.error('Server response error:', error);
        throw new Error(error.message || "Failed to save event");
      }
      
      const data = await response.json();
      console.log('Server response success:', data);
      
      toast({
        title: "Success",
        description: eventId ? "Event updated successfully" : "Event created successfully"
      });
      
      router.push(`/event/${data.slug}`);
    } catch (error: any) {
      console.error("Error saving event:", error);
      toast({
        title: "Error",
        description: error.message || "There was a problem saving your event",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // ... rest of the code ...
}

// Rest of the file remains unchanged 
