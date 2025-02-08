import { AlertCircle, FileDown } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { pdf } from "@react-pdf/renderer";
import type { PrescriptionResult } from "@/lib/calculator";
import { PrescriptionPDF } from "./prescription-pdf";

interface PrescriptionResultProps {
  result: PrescriptionResult;
  dogDetails: {
    weight: number;
    category: string;
  };
}

export function PrescriptionResult({ result, dogDetails }: PrescriptionResultProps) {
  const handleDownloadPDF = async () => {
    const blob = await pdf(
      <PrescriptionPDF result={result} dogDetails={dogDetails} />
    ).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `prescription-${new Date().toISOString().split("T")[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
        <CardTitle className="flex justify-between items-center">
          <span>Prescription Details</span>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleDownloadPDF}
          >
            <FileDown className="h-4 w-4" />
            Download PDF
          </Button>
        </CardTitle>
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