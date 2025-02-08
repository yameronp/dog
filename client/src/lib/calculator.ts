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

  if (category === 'adult') {
    if (weight >= 40) {
      isOverweight = true;
    } else if (weight >= 35) {
      promaxTablets = 6;
    } else if (weight >= 30) {
      promaxTablets = 5;
    } else if (weight >= 25) {
      promaxTablets = 4;
    } else if (weight >= 20) {
      promaxTablets = 3;
    } else if (weight >= 10) {
      promaxTablets = 2;
    } else {
      promaxTablets = 1;
    }
  } else if (category === 'puppy') {
    promaxJuniorTablets = 1;
  } else if (category === 'nursing') {
    promaxNursingTablets = Math.max(1, Math.floor(weight / 5));
    tapewormDrops = 1;
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
