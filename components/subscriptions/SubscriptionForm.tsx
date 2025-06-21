"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"
import { SUBSCRIPTION_TITLES, EXPENSE_CATEGORIES, Subscription } from "@/lib/types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

const formSchema = z.object({
  title: z.string().min(2, { message: "Title is required" }),
  amount: z.string().refine((val) => {
    const num = parseFloat(val)
    return !isNaN(num) && num > 0
  }, { message: "Amount must be a positive number" }),
  category: z.string({ required_error: "Please select a category" }),
  date: z.coerce.number().min(1).max(31, { message: "Date must be between 1 and 31" }),
  isSubscribed: z.boolean().default(true),
})

interface SubscriptionFormProps {
  onSubmit: (data: Omit<Subscription, "_id">) => Promise<void>
}

export function SubscriptionForm({ onSubmit }: SubscriptionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [titlesList, setTitlesList] = useState(SUBSCRIPTION_TITLES)
  const [customTitle, setCustomTitle] = useState("")
  const [showCustomTitleInput, setShowCustomTitleInput] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      amount: "",
      category: "",
      date: 1,
      isSubscribed: true,
    },
  })

  const handleAddCustomTitle = () => {
    if (customTitle.trim() && !titlesList.includes(customTitle.trim())) {
      setTitlesList([...titlesList, customTitle.trim()])
      form.setValue("title", customTitle.trim())
      setCustomTitle("")
      setShowCustomTitleInput(false)
    }
  }

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    try {
      await onSubmit({
        title: values.title,
        amount: parseFloat(values.amount),
        category: values.category,
        date: values.date,
        isSubscribed: values.isSubscribed,
      })
      
      form.reset({
        title: "",
        amount: "",
        category: "",
        date: 1,
        isSubscribed: true,
      })
      
      toast({
        title: "Success",
        description: "Subscription has been added",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add subscription",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Title</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value || "Select a subscription"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search titles..." />
                    <CommandList>
                      <CommandEmpty>No title found.</CommandEmpty>
                      <CommandGroup>
                        {titlesList.map((title) => (
                          <CommandItem
                            key={title}
                            value={title}
                            onSelect={() => {
                              form.setValue("title", title)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                title === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {title}
                          </CommandItem>
                        ))}
                        <CommandItem
                          onSelect={() => setShowCustomTitleInput(true)}
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add custom title
                        </CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                  {showCustomTitleInput && (
                    <div className="p-2 border-t">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Custom title"
                          value={customTitle}
                          onChange={(e) => setCustomTitle(e.target.value)}
                        />
                        <Button 
                          type="button" 
                          size="sm"
                          onClick={handleAddCustomTitle}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input 
                  placeholder="0.00" 
                  {...field} 
                  type="number" 
                  step="0.01"
                  min="0"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Due Date</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Day of month" 
                  {...field} 
                  type="number" 
                  min="1"
                  max="31"
                />
              </FormControl>
              <FormDescription>
                Day of month when payment is due
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="isSubscribed"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active Subscription</FormLabel>
                <FormDescription>
                  Automatically add to expenses on the due date
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
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Subscription"}
        </Button>
      </form>
    </Form>
  )
}