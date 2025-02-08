export type DogCategory = 'adult' | 'puppy' | 'nursing';

export interface PrescriptionResult {
  promaxTablets: number;
  promaxJuniorTablets: number;
  promaxNursingTablets: number;
  tapewormDrops: number;
  isOverweight: boolean;
  breakdown: {
    medications: { name: string; quantity: number; cost: number }[];
    prescriptionCharge: number;
    total: number;
  };
}

const PRICES = {
  promaxTablet: 1.25,
  promaxJuniorTablet: 1.25,
  promaxNursingTablet: 3.00,
  tapewormDrop: 3.00,
  prescriptionCharge: 4.00
};

export function calculatePrescription(weight: number, category: DogCategory): PrescriptionResult {
  let promaxTablets = 0;
  let promaxJuniorTablets = 0;
  let promaxNursingTablets = 0;
  let tapewormDrops = 0;
  let isOverweight = false;

  // Check for overweight condition for all categories
  if (weight >= 40) {
    isOverweight = true;
    return {
      promaxTablets: 0,
      promaxJuniorTablets: 0,
      promaxNursingTablets: 0,
      tapewormDrops: 0,
      isOverweight: true,
      breakdown: {
        medications: [],
        prescriptionCharge: 0,
        total: 0
      }
    };
  }

  if (category === 'adult') {
    if (weight < 10) {
      promaxTablets = 1;
    } else if (weight < 20) {
      promaxTablets = 2;
    } else if (weight < 25) {
      promaxTablets = 3;
    } else if (weight < 30) {
      promaxTablets = 4;
    } else if (weight < 35) {
      promaxTablets = 5;
    } else if (weight < 40) {
      promaxTablets = 6;
    }
  } else if (category === 'puppy') {
    promaxJuniorTablets = 1;
  } else if (category === 'nursing') {
    // Calculate nursing tablets (1 per 5kg, minimum 1)
    promaxNursingTablets = Math.max(1, Math.floor(weight / 5));
    tapewormDrops = 1; // Always include 1 tapeworm drop for nursing
  }

  const medications = [
    { name: 'Promax Tablets', quantity: promaxTablets, cost: promaxTablets * PRICES.promaxTablet },
    { name: 'Promax Junior Tablets', quantity: promaxJuniorTablets, cost: promaxJuniorTablets * PRICES.promaxJuniorTablet },
    { name: 'Promax Nursing Tablets', quantity: promaxNursingTablets, cost: promaxNursingTablets * PRICES.promaxNursingTablet },
    { name: 'Tapeworm Drops', quantity: tapewormDrops, cost: tapewormDrops * PRICES.tapewormDrop }
  ].filter(med => med.quantity > 0);

  const medicationTotal = medications.reduce((sum, med) => sum + med.cost, 0);

  return {
    promaxTablets,
    promaxJuniorTablets,
    promaxNursingTablets,
    tapewormDrops,
    isOverweight,
    breakdown: {
      medications,
      prescriptionCharge: PRICES.prescriptionCharge,
      total: medicationTotal + PRICES.prescriptionCharge
    }
  };
}