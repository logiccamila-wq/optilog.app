export type CostParams = {
  // Fixos e financeiros
  depreciation_per_km: number; // R$/km
  capital_remuneration_per_month: number; // R$/mês
  insurance_per_km: number; // R$/km
  licenses_fixed_per_month: number; // R$/mês

  // Variáveis operacionais
  fuel_consumption_l_per_km: number; // L/km
  fuel_price_per_l: number; // R$/L
  lubricants_per_km: number; // R$/km
  tires_per_km: number; // R$/km
  maintenance_per_km: number; // R$/km
  tolls_per_km_default: number; // R$/km

  // Mão de obra e administrativos
  labor_per_km: number; // R$/km
  admin_per_km: number; // R$/km

  // Margem/markup
  margin_rate: number; // 0..1
};

export type TripInput = {
  distance_km: number;
  payload_ton: number;
  tolls_per_km?: number; // sobrepõe default
  months_equivalent?: number; // rateio de custos fixos por mês
};

export type TripBreakdown = {
  per_km: {
    fixed: number;
    variable: number;
    total: number;
  };
  components: {
    fuel: number; // total combustível
    lubricants: number;
    tires: number;
    maintenance: number;
    tolls: number;
    labor: number;
    admin: number;
    depreciation: number;
    insurance: number;
    capital_remuneration: number;
    licenses: number;
  };
  totals: {
    cost_trip: number;
    cost_per_km: number;
    cost_per_ton_km: number;
    freight_with_margin: number;
  };
};

export function calcPerKm(params: CostParams, tollsPerKm?: number) {
  const fuelPerKm = params.fuel_consumption_l_per_km * params.fuel_price_per_l;
  const variable =
    fuelPerKm +
    params.lubricants_per_km +
    params.tires_per_km +
    params.maintenance_per_km +
    (tollsPerKm ?? params.tolls_per_km_default) +
    params.labor_per_km +
    params.admin_per_km +
    params.insurance_per_km;

  const fixed = params.depreciation_per_km;
  const total = fixed + variable;
  return { fixed, variable, total };
}

export function calcTrip(params: CostParams, input: TripInput): TripBreakdown {
  const distance = Math.max(0, input.distance_km || 0);
  const payloadTon = Math.max(0, input.payload_ton || 0);
  const tollsPerKm = input.tolls_per_km ?? params.tolls_per_km_default;

  const perKm = calcPerKm(params, tollsPerKm);

  // Rateio mensal de custos fixos
  const monthsEq = input.months_equivalent ?? 0;
  const capitalRem = monthsEq * params.capital_remuneration_per_month;
  const licenses = monthsEq * params.licenses_fixed_per_month;

  const components = {
    fuel: distance * params.fuel_consumption_l_per_km * params.fuel_price_per_l,
    lubricants: distance * params.lubricants_per_km,
    tires: distance * params.tires_per_km,
    maintenance: distance * params.maintenance_per_km,
    tolls: distance * tollsPerKm,
    labor: distance * params.labor_per_km,
    admin: distance * params.admin_per_km,
    depreciation: distance * params.depreciation_per_km,
    insurance: distance * params.insurance_per_km,
    capital_remuneration: capitalRem,
    licenses: licenses,
  } as TripBreakdown['components'];

  const costTrip = Object.values(components).reduce((a, b) => a + b, 0);
  const costPerKm = distance > 0 ? costTrip / distance : 0;
  const costPerTonKm = distance > 0 && payloadTon > 0 ? costTrip / (distance * payloadTon) : 0;
  const freightWithMargin = costTrip * (1 + (params.margin_rate || 0));

  return {
    per_km: perKm,
    components,
    totals: {
      cost_trip: costTrip,
      cost_per_km: costPerKm,
      cost_per_ton_km: costPerTonKm,
      freight_with_margin: freightWithMargin,
    },
  };
}
