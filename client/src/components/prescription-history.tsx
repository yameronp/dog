import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Prescription } from "@shared/schema";
import { format } from "date-fns";

export function PrescriptionHistory() {
  const { data: prescriptions, isLoading } = useQuery<Prescription[]>({
    queryKey: ["/api/prescriptions"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Prescriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading prescription history...</p>
        </CardContent>
      </Card>
    );
  }

  if (!prescriptions?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Prescriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No prescriptions found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Prescriptions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {prescriptions.map((prescription) => (
            <div
              key={prescription.id}
              className="flex flex-col space-y-2 p-4 border rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">
                    {prescription.weight}kg {prescription.category} dog
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(prescription.createdAt), "PPp")}
                  </p>
                </div>
                <p className="font-semibold">£{prescription.totalCost.toFixed(2)}</p>
              </div>
              <div className="text-sm space-y-1">
                {(prescription.promaxTablets ?? 0) > 0 && (
                  <p>Promax Tablets: {prescription.promaxTablets}</p>
                )}
                {(prescription.promaxJuniorTablets ?? 0) > 0 && (
                  <p>Promax Junior Tablets: {prescription.promaxJuniorTablets}</p>
                )}
                {(prescription.promaxNursingTablets ?? 0) > 0 && (
                  <p>Promax Nursing Tablets: {prescription.promaxNursingTablets}</p>
                )}
                {(prescription.tapewormDrops ?? 0) > 0 && (
                  <p>Tapeworm Drops: {prescription.tapewormDrops}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}