"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { toast } from "sonner";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useEventStore, TicketType } from "@/lib/event-store";
import { templates } from "@/lib/templates";
import { TemplatePreview } from "@/components/template-preview";

const ticketTypeSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  price: z.number().min(0, { message: "Price must be 0 or greater" }),
  description: z.string().optional(),
  quantity: z.number().int().min(0).optional(),
});

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }).max(100),
  slug: z.string().optional(), // Will be generated on the server
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
  ticket_types: z.array(ticketTypeSchema).default([]),
  entrance: z.array(z.string()).default([]),
  parking: z.array(z.string()).default([]),
  camping: z.array(z.string()).default([]),
  custom_styles: z.any().optional(), // Using any since it's a jsonb type
});

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
  const form = useForm<z.infer<typeof formSchema>>({
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
          // Ensure dates are properly converted to Date objects
          const fromDate = data.from_date ? new Date(data.from_date) : new Date();
          const toDate = data.to_date ? new Date(data.to_date) : new Date();

          // Update form values
          form.reset({
            title: data.title,
            ingress: data.ingress || "",
            body: data.body || "",
            from_date: fromDate,
            to_date: toDate,
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
            from_date: fromDate,
            to_date: toDate,
            templateId: data.template_id,
          });
        })
        .catch((error) => {
          console.error("Error loading event:", error);
          toast.error("Could not load event data. Please try again.");
        })
        .finally(() => setIsLoading(false));
    } else {
      // Set template ID in store for new events
      setFormData({ 
        templateId,
        from_date: new Date(),
        to_date: new Date(),
      });
    }
  }, [eventId, form, setFormData, templateId]);

  // Watch form values and update the store
  useEffect(() => {
    const subscription = form.watch((value) => {
      setFormData({
        ...value,
        templateId: formData.templateId, // Preserve the template ID
        from_date: value.from_date ? new Date(value.from_date) : new Date(),
        to_date: value.to_date ? new Date(value.to_date) : new Date(),
        images: value.images?.filter((url): url is string => typeof url === 'string') || [],
        ticket_types: (value.ticket_types?.filter((ticket): ticket is TicketType => 
          ticket !== undefined && 
          typeof ticket.name === 'string' && 
          typeof ticket.price === 'number'
        ) || []) as TicketType[],
        entrance: value.entrance?.filter((item): item is string => typeof item === 'string') || [],
        parking: value.parking?.filter((item): item is string => typeof item === 'string') || [],
        camping: value.camping?.filter((item): item is string => typeof item === 'string') || [],
      });
    });
    
    return () => subscription.unsubscribe();
  }, [form, setFormData, formData.templateId]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      router.push("/sign-in");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const apiEndpoint = eventId ? `/api/events/${eventId}` : "/api/events";
      const method = eventId ? "PUT" : "POST";
      
      // Ensure dates are properly formatted for the API
      const formattedValues = {
        ...values,
        from_date: values.from_date.toISOString(),
        to_date: values.to_date.toISOString(),
        template_id: templateId,
        custom_styles: formData.customStyles,
      };
      
      const response = await fetch(apiEndpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedValues),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save event");
      }
      
      const data = await response.json();
      
      toast.success(eventId ? "Event updated successfully" : "Event created successfully");
      
      router.push(`/event/${data.slug}`);
    } catch (error: any) {
      console.error("Error saving event:", error);
      toast.error(error.message || "There was a problem saving your event");
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
        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Template Selection</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={cn(
                    "relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md",
                    template.id === formData.templateId
                      ? "border-primary ring-2 ring-primary ring-offset-2"
                      : "border-muted"
                  )}
                  onClick={() => {
                    setFormData({ 
                      ...formData,
                      templateId: template.id 
                    });
                  }}
                >
                  <div className="aspect-video w-full overflow-hidden rounded-md bg-muted">
                    <img
                      src={template.thumbnailUrl}
                      alt={template.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="mt-4">
                    <h3 className="font-medium">{template.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {template.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Title *</FormLabel>
                <FormControl>
                  <Input placeholder="My Awesome Event" {...field} />
                </FormControl>
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
                  <Input placeholder="Event Location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="ingress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="A brief introduction to your event" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                This will be displayed as a summary of your event.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Details</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Full description of your event" 
                  className="min-h-[200px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <FormField
            control={form.control}
            name="from_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date *</FormLabel>
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
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="to_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date *</FormLabel>
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
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < form.getValues("from_date")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="has_time_slot"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Time Slots</FormLabel>
                <FormDescription>
                  Enable if your event runs during specific hours
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {form.watch("has_time_slot") && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <FormField
              control={form.control}
              name="time_slot_start"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time_slot_end"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="cover_image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image URL</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://example.com/image.jpg" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                The main image that will be displayed for your event
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Images</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  {field.value.map((url, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input 
                        value={url}
                        onChange={(e) => {
                          const newUrls = [...field.value];
                          newUrls[index] = e.target.value;
                          field.onChange(newUrls);
                        }}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          const newUrls = field.value.filter((_, i) => i !== index);
                          field.onChange(newUrls);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => field.onChange([...field.value, ""])}
                  >
                    Add Image URL
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ticket_types"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ticket Types</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  {field.value.map((ticket, index) => (
                    <div key={index} className="space-y-2 rounded-lg border p-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <Input
                          placeholder="Ticket Name"
                          value={ticket.name}
                          onChange={(e) => {
                            const newTickets = [...field.value];
                            newTickets[index] = { ...ticket, name: e.target.value };
                            field.onChange(newTickets);
                          }}
                        />
                        <Input
                          type="number"
                          placeholder="Price"
                          value={ticket.price}
                          onChange={(e) => {
                            const newTickets = [...field.value];
                            newTickets[index] = { ...ticket, price: parseFloat(e.target.value) };
                            field.onChange(newTickets);
                          }}
                        />
                        <Input
                          placeholder="Description (optional)"
                          value={ticket.description || ""}
                          onChange={(e) => {
                            const newTickets = [...field.value];
                            newTickets[index] = { ...ticket, description: e.target.value };
                            field.onChange(newTickets);
                          }}
                        />
                        <Input
                          type="number"
                          placeholder="Quantity (optional)"
                          value={ticket.quantity || ""}
                          onChange={(e) => {
                            const newTickets = [...field.value];
                            newTickets[index] = { ...ticket, quantity: parseInt(e.target.value) };
                            field.onChange(newTickets);
                          }}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          const newTickets = field.value.filter((_, i) => i !== index);
                          field.onChange(newTickets);
                        }}
                      >
                        Remove Ticket Type
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => field.onChange([...field.value, { name: "", price: 0 }])}
                  >
                    Add Ticket Type
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <FormField
            control={form.control}
            name="entrance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entrance Information</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    {field.value.map((info, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input 
                          value={info}
                          onChange={(e) => {
                            const newInfo = [...field.value];
                            newInfo[index] = e.target.value;
                            field.onChange(newInfo);
                          }}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const newInfo = field.value.filter((_, i) => i !== index);
                            field.onChange(newInfo);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => field.onChange([...field.value, ""])}
                    >
                      Add Entrance Info
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="parking"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parking Information</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    {field.value.map((info, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input 
                          value={info}
                          onChange={(e) => {
                            const newInfo = [...field.value];
                            newInfo[index] = e.target.value;
                            field.onChange(newInfo);
                          }}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const newInfo = field.value.filter((_, i) => i !== index);
                            field.onChange(newInfo);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => field.onChange([...field.value, ""])}
                    >
                      Add Parking Info
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="camping"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Camping Information</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    {field.value.map((info, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input 
                          value={info}
                          onChange={(e) => {
                            const newInfo = [...field.value];
                            newInfo[index] = e.target.value;
                            field.onChange(newInfo);
                          }}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const newInfo = field.value.filter((_, i) => i !== index);
                            field.onChange(newInfo);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => field.onChange([...field.value, ""])}
                    >
                      Add Camping Info
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                {eventId ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>{eventId ? "Update Event" : "Create Event"}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
