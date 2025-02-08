import { Document, Page, Text, View, StyleSheet, PDFViewer } from "@react-pdf/renderer";
import type { PrescriptionResult } from "@/lib/calculator";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    margin: 10,
    padding: 10,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  total: {
    fontSize: 14,
    marginTop: 10,
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 10,
    color: "grey",
  },
});

interface PrescriptionPDFProps {
  result: PrescriptionResult;
  dogDetails: {
    weight: number;
    category: string;
  };
}

export function PrescriptionPDF({ result, dogDetails }: PrescriptionPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text>Prescription Details</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Dog Information</Text>
          <Text style={styles.text}>Weight: {dogDetails.weight}kg</Text>
          <Text style={styles.text}>Category: {dogDetails.category}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>Prescribed Medications</Text>
          {result.breakdown.medications.map((med, idx) => (
            <View key={idx} style={styles.row}>
              <Text style={styles.text}>{med.name} × {med.quantity}</Text>
              <Text style={styles.text}>£{med.cost.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.text}>Prescription Charge</Text>
            <Text style={styles.text}>£{result.breakdown.prescriptionCharge.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.total}>Total Cost</Text>
            <Text style={styles.total}>£{result.breakdown.total.toFixed(2)}</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
        </Text>
      </Page>
    </Document>
  );
}
