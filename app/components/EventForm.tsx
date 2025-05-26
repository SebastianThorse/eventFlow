"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useEventStore } from "@/lib/stores/event-store";

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }).max(100),
  description: z.string().max(500, { message: "Description must be less than 500 characters." }).optional(),
  date: z.date().optional(),
  location: z.string().max(100).optional(),
  coverImageUrl: z.string().url({ message: "Please enter a valid URL." }).optional(),
});

interface EventFormProps {
  templateId: string;
  eventId?: string;
}

export function EventForm({ templateId, eventId }: EventFormProps) {
  const router = useRouter();
  const { user } = useUser();
  const { toast } = useToast();
  const { event, setEvent, resetEvent } = useEventStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!eventId);

  // Initialize form with Zustand store values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: event.title || "",
      description: event.description || "",
      date: event.date || undefined,
      location: event.location || "",
      coverImageUrl: event.coverImageUrl || "",
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
            description: data.description || "",
            date: data.date ? new Date(data.date) : undefined,
            location: data.location || "",
            coverImageUrl: data.cover_image_url || "",
          });
          
          // Update store
          setEvent({
            title: data.title,
            description: data.description || "",
            date: data.date ? new Date(data.date) : undefined,
            location: data.location || "",
            templateId: data.template_id,
            coverImageUrl: data.cover_image_url || "",
            customStyles: data.custom_styles || {},
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
      setEvent({ templateId });
    }
  }, [eventId, form, setEvent, toast, templateId]);

  // Watch form values and update the store
  useEffect(() => {
    const subscription = form.watch((value) => {
      setEvent({
        title: value.title || "",
        description: value.description || "",
        date: value.date,
        location: value.location || "",
        coverImageUrl: value.coverImageUrl || "",
      });
    });
    
    return () => subscription.unsubscribe();
  }, [form, setEvent]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      router.push("/sign-in");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const apiEndpoint = eventId ? `/api/events/${eventId}` : "/api/events";
      const method = eventId ? "PUT" : "POST";
      
      const response = await fetch(apiEndpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: values.title,
          description: values.description,
          date: values.date,
          location: values.location,
          template_id: templateId,
          cover_image_url: values.coverImageUrl,
          custom_styles: event.customStyles,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save event");
      }
      
      const data = await response.json();
      
      toast({
        title: "Success",
        description: eventId ? "Event updated successfully" : "Event created successfully",
      });
      
      // Reset the store
      resetEvent();
      
      router.push(`/event/${data.slug}`);
    } catch (error: any) {
      console.error("Error saving event:", error);
      toast({
        title: "Error",
        description: error.message || "There was a problem saving your event",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-lg">Loading event data...</div>
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input placeholder="My Awesome Event" {...field} />
              </FormControl>
              <FormDescription>
                The name of your event
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell people about your event..."
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide details about your event
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value || undefined}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  When will your event take place
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Event location" {...field} />
                </FormControl>
                <FormDescription>
                  Where will your event be held
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="coverImageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormDescription>
                Provide a URL to your event cover image
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
              {eventId ? "Updating Event..." : "Creating Event..."}
            </>
          ) : (
            eventId ? "Update Event" : "Publish Event"
          )}
        </Button>
      </form>
    </Form>
  );
} 
