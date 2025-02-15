import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PrescriptionForm } from "@/components/prescription-form";
import { PrescriptionResult } from "@/components/prescription-result";
import { PrescriptionHistory } from "@/components/prescription-history";
import { calculatePrescription, type PrescriptionResult as PrescriptionResultType } from "@/lib/calculator";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

export default function Home() {
  const [result, setResult] = useState<PrescriptionResultType | null>(null);
  const [dogDetails, setDogDetails] = useState<{ weight: number; category: string } | null>(null);
  const { toast } = useToast();

  const handleCalculate = async (data: { weight: number; category: 'adult' | 'puppy' | 'nursing' }) => {
    const prescription = calculatePrescription(data.weight, data.category);
    setResult(prescription);
    setDogDetails(data);

    if (!prescription.isOverweight) {
      try {
        await apiRequest('POST', '/api/prescriptions', {
          ...prescription,
          weight: data.weight,
          category: data.category,
          totalCost: prescription.breakdown.total
        });
        // Invalidate prescriptions query to refresh the list
        queryClient.invalidateQueries({ queryKey: ["/api/prescriptions"] });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to save prescription. Please try again."
        });
      }
    }
  };

  const handleReset = () => {
    setResult(null);
    setDogDetails(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              Dog Worming Calculator
            </h1>
            <p className="text-muted-foreground">
              Calculate the correct dosage and cost for your dog's worming treatment
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Enter Dog Details</CardTitle>
              <CardDescription>
                Please provide your dog's weight and select the appropriate category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PrescriptionForm onCalculate={handleCalculate} onReset={handleReset} />
            </CardContent>
          </Card>

          {result && dogDetails && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <PrescriptionResult result={result} dogDetails={dogDetails} />
            </div>
          )}

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PrescriptionHistory />
          </div>
        </div>
      </div>
    </div>
  );
}