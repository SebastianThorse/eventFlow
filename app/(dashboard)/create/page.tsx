"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { EventForm } from "@/components/event-form";
import { EventPreview } from "@/components/event-preview";
import { Toaster } from "@/components/ui/toaster";
import { useEventStore } from "@/lib/event-store";

export default function CreateEventPage() {
  const router = useRouter();
  const { user } = useUser();
  const { formData, setFormData } = useEventStore();
  
  if (!user) {
    router.push("/sign-in");
    return null;
  }
  
  return (
    <div className="container">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Create Your Event</h1>
        </div>
        
        <Tabs defaultValue="edit" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="edit" className="mt-6">
            <EventForm templateId={formData.templateId} />
          </TabsContent>
          <TabsContent value="preview" className="mt-6">
            <EventPreview />
          </TabsContent>
        </Tabs>
        <Toaster />
      </div>
    </div>
  );
}
