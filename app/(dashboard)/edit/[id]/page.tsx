"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { EventForm } from "@/components/event-form";
import { EventPreview } from "@/components/event-preview";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

interface EditEventPageProps {
  params: {
    id: string;
  };
}

export default function EditEventPage({ params }: EditEventPageProps) {
  const router = useRouter();
  const { user } = useUser();
  const { toast } = useToast();
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!user) {
      router.push("/sign-in");
      return;
    }
    
    // Fetch event to get the template ID
    fetch(`/api/events/${params.id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load event");
        }
        return res.json();
      })
      .then((data) => {
        setTemplateId(data.template_id);
      })
      .catch((error) => {
        console.error("Error loading event:", error);
        toast({
          title: "Error",
          description: "Could not load event data. Please try again.",
          variant: "destructive",
        });
        router.push("/events");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [params.id, router, toast, user]);
  
  if (isLoading || !templateId) {
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
    <div className="container">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={() => router.push("/events")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to events
            </Button>
            <h1 className="ml-4 text-3xl font-bold tracking-tight">Edit Event</h1>
          </div>
        </div>
        
        <Tabs defaultValue="edit" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="edit" className="mt-6">
            <EventForm templateId={templateId} eventId={params.id} />
          </TabsContent>
          <TabsContent value="preview" className="mt-6">
            <EventPreview />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
