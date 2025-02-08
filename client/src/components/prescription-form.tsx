import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type DogCategory } from "@/lib/calculator";

const formSchema = z.object({
  weight: z.coerce
    .number()
    .positive("Weight must be greater than 0")
    .max(100, "Weight seems unusually high"),
  category: z.enum(["adult", "puppy", "nursing"] as const)
});

type FormData = z.infer<typeof formSchema>;

interface PrescriptionFormProps {
  onCalculate: (data: FormData) => void;
}

export function PrescriptionForm({ onCalculate }: PrescriptionFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weight: undefined,
      category: "adult"
    }
  });

  return (
    <TooltipProvider>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onCalculate)} className="space-y-6">
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>Dog's Weight (kg)</FormLabel>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enter your dog's weight in kilograms. This helps determine the correct dosage.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.1"
                    placeholder="Enter weight in kilograms"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Dogs over 40kg may be overweight and require a check-up
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>Category</FormLabel>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Select your dog's category for appropriate medication</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-2"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="adult" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Adult Dog (Over 12 weeks)
                      </FormLabel>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>For dogs older than 12 weeks. Dosage varies by weight.</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="puppy" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Puppy (under 12 weeks)
                      </FormLabel>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>For puppies under 12 weeks. Always receives 1 Promax Junior Tablet.</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="nursing" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Nursing Bitch
                      </FormLabel>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>For nursing dogs. Includes Promax Nursing Tablets and a tapeworm drop.</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex space-x-4">
            <Button type="submit" className="flex-1">
              Calculate
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
          </div>
        </form>
      </Form>
    </TooltipProvider>
  );
}