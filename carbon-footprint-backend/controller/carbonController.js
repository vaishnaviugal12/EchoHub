import DailyFootprint from '../models/DailyFootprint.js';

// --- Hardcoded emission factors (India averages) ---
const HARDCODED_FACTORS = {
  ELECTRICITY_PER_KWH: 0.82,
  SHOPPING: { electronics: 0.01, clothing: 0.008, processedFood: 0.006, default: 0.004 },
  DIET: { meatHeavy: 0.005, vegetarian: 0.003, default: 0.004 },
  TRANSPORT: { petrolCar: 0.192, dieselCar: 0.171, motorbike: 0.073, bus: 0.04, train: 0.03, flight: 0.255, bike: 0, walk: 0 },
  LPG_PER_CYLINDER: 42,
  WATER_PER_LITRE: 0.0003,
  WASTE_PER_KG: 1.8
};

// --- Helper function ---
const calculateEmission = (category, input) => {
  let factor = 0, factorName = 'N/A', result = 0;

  switch(category) {
    case 'electricity':
      factor = HARDCODED_FACTORS.ELECTRICITY_PER_KWH;
      factorName = `Electricity (${factor} kg/kWh)`;
      result = input; // input already in kWh
      break;

    case 'shopping':
      factor = HARDCODED_FACTORS.SHOPPING[input.type] || HARDCODED_FACTORS.SHOPPING.default;
      factorName = `Shopping (${input.type || 'default'}) (${factor} kg/INR)`;
      result = input.amount * factor;
      break;

    case 'diet':
      factor = HARDCODED_FACTORS.DIET[input.type] || HARDCODED_FACTORS.DIET.default;
      factorName = `Diet (${input.type || 'default'}) (${factor} kg/INR)`;
      result = input.amount * factor;
      break;

    case 'transport':
      if(input.mode === 'car') {
        factor = input.vehicleType === 'diesel' ? HARDCODED_FACTORS.TRANSPORT.dieselCar : HARDCODED_FACTORS.TRANSPORT.petrolCar;
        factorName = `Car (${input.vehicleType}) (${factor} kg/km)`;
      } else {
        factor = HARDCODED_FACTORS.TRANSPORT[input.mode] || 0;
        factorName = `${input.mode} (${factor} kg/km)`;
      }
      result = input.distance * factor;
      break;

    case 'cooking':
      factor = HARDCODED_FACTORS.LPG_PER_CYLINDER;
      factorName = `LPG (${factor} kg/cylinder)`;
      result = input * factor;
      break;

    case 'water':
      factor = HARDCODED_FACTORS.WATER_PER_LITRE;
      factorName = `Water (${factor} kg/litre)`;
      result = input * factor;
      break;

    case 'waste':
      factor = HARDCODED_FACTORS.WASTE_PER_KG;
      factorName = `Waste (${factor} kg/kg)`;
      result = input * factor;
      break;
  }

  return { co2e: parseFloat(result.toFixed(3)), factor: factorName };
};

// --- Controllers ---

// Calculate daily footprint
export const calculateDailyFootprint = async (req, res) => {
  const userId = req.user?.id;
  if(!userId) return res.status(401).json({ message: "User not authenticated." });

  const { electricity, shopping, diet, transport, cooking, water, waste } = req.body;
  let totalEmissions = 0;
  const details = {};
  const today = new Date().toISOString().split('T')[0];

  try {
    if(electricity?.billAmount > 0) {
      const kWh = electricity.billAmount / 7; // Convert INR to kWh
      const { co2e, factor } = calculateEmission('electricity', kWh);
      totalEmissions += co2e;
      details.electricity = { co2e, unit: 'kgCO2e', factor };
    }

    if(shopping?.amount > 0) {
      const { co2e, factor } = calculateEmission('shopping', { amount: shopping.amount, type: shopping.type });
      totalEmissions += co2e;
      details.shopping = { co2e, unit: 'kgCO2e', factor };
    }

    if(diet?.amount > 0) {
      const { co2e, factor } = calculateEmission('diet', { amount: diet.amount, type: diet.type });
      totalEmissions += co2e;
      details.diet = { co2e, unit: 'kgCO2e', factor };
    }

    if(transport?.distance > 0 && transport?.mode) {
      const { co2e, factor } = calculateEmission('transport', transport);
      totalEmissions += co2e;
      details.transport = { co2e, unit: 'kgCO2e', factor };
    }

    if(cooking?.cylindersUsed > 0) {
      const { co2e, factor } = calculateEmission('cooking', cooking.cylindersUsed);
      totalEmissions += co2e;
      details.cooking = { co2e, unit: 'kgCO2e', factor };
    }

    if(water?.litres > 0) {
      const { co2e, factor } = calculateEmission('water', water.litres);
      totalEmissions += co2e;
      details.water = { co2e, unit: 'kgCO2e', factor };
    }

    if(waste?.kg > 0) {
      const { co2e, factor } = calculateEmission('waste', waste.kg);
      totalEmissions += co2e;
      details.waste = { co2e, unit: 'kgCO2e', factor };
    }

    const updatedFootprint = await DailyFootprint.findOneAndUpdate(
      { user: userId, date: today },
      { totalEmissions: parseFloat(totalEmissions.toFixed(2)), details },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: "Carbon footprint recorded successfully",
      totalEmissions: updatedFootprint.totalEmissions,
      details: updatedFootprint.details,
      recordId: updatedFootprint._id
    });

  } catch(error) {
    console.error("Carbon footprint calculation error:", error.message);
    res.status(500).json({ error: "Failed to calculate carbon footprint", details: error.message });
  }
};

// Get user’s historical footprint
export const getFootprintHistory = async (req, res) => {
  const userId = req.user?.id;
  if(!userId) return res.status(401).json({ message: "User not authenticated." });

  try {
    const history = await DailyFootprint.find({ user: userId })
      .sort({ date: 1 })
      .select('-__v');

    res.status(200).json(history);
  } catch(error) {
    console.error("Error fetching history:", error.message);
    res.status(500).json({ error: "Failed to fetch history", details: error.message });
  }
};

// Get today’s footprint
export const getTodayFootprint = async (req, res) => {
  const userId = req.user?.id;
  if(!userId) return res.status(401).json({ message: "User not authenticated." });

  const today = new Date().toISOString().split('T')[0];

  try {
    const todayRecord = await DailyFootprint.findOne({ user: userId, date: today });
    if(!todayRecord) return res.status(404).json({ message: "No record found for today." });

    res.status(200).json(todayRecord);
  } catch(error) {
    console.error("Error fetching today's footprint:", error.message);
    res.status(500).json({ error: "Failed to fetch today's footprint", details: error.message });
  }
};
