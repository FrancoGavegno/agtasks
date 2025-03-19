// components/CreateCustomerTest.tsx (or wherever you place this component)
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { JiraCustomerData, JiraResponse } from "@/lib/interfaces";
import { createCustomer } from "@/lib/jira";


// Updated form schema to match JiraCustomerData interface
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  displayName: z.string().min(1, { message: "Display name is required" }), // Added to match JiraCustomerData
});


export function CreateCustomerTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<JiraResponse | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      displayName: "", // Added default value for displayName
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);

    // Prepare the customer data matching JiraCustomerData interface
    const customerData: JiraCustomerData = {
      email: values.email,
      displayName: values.displayName,
    };

    try {
      const response = await createCustomer(customerData); // Pass the full object
      setResult(response);

      if (response.success) {
        toast({
          title: "Customer created",
          description: `Customer ${values.displayName} with email ${values.email} has been created in Jira.`,
        });
        form.reset();
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to create customer. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormDescription>Enter the customer's display name for Jira.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="customer@example.com" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the customer's email address to create a new customer in Jira.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Customer"}
          </Button>
        </form>
      </Form>
      {/* result && (
        <div
          className={`p-4 rounded-md ${result.success ? "bg-green-100" : "bg-red-100"}`}
        >
          <p className="font-semibold">
            {result.success ? "Customer created successfully" : "Failed to create customer"}
          </p>
          {result.success && (
            <>
              <p>Display Name: {form.getValues("displayName")}</p>
              <p>Email: {form.getValues("email")}</p>
            </>
          )}
          {!result.success && result.error && <p>Error: {result.error}</p>}
        </div>
      )*/}
    </div>
  );
}