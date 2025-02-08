import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { PrescriptionResult } from "@/lib/calculator";

interface PrescriptionResultProps {
  result: PrescriptionResult;
}

export function PrescriptionResult({ result }: PrescriptionResultProps) {
  if (result.isOverweight) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          The dog may be overweight. No prescription will be issued. Please consult a veterinarian.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prescription Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold">Prescribed Medications</h3>
          {result.breakdown.medications.map((med, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span>{med.name} × {med.quantity}</span>
              <span>£{med.cost.toFixed(2)}</span>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>Prescription Charge</span>
            <span>£{result.breakdown.prescriptionCharge.toFixed(2)}</span>
          </div>

          <div className="flex justify-between font-semibold">
            <span>Total Cost</span>
            <span>£{result.breakdown.total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
