export type MLPredictInput = {
  distance_km: number;
  stops: number;
  weight_kg: number;
  lead_time_hours: number;
  weather_score: number; // 0..1
  driver_incidents_90d: number;
};

export type MLPredictOutput = {
  risk_probability: number;
  risk_label: 0 | 1;
  explanation?: string;
};

export async function mlPredictRisk(input: MLPredictInput): Promise<MLPredictOutput | null> {
  const base = process.env.NEXT_PUBLIC_ML_URL || "http://localhost:8000";
  try {
    const resp = await fetch(`${base}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!resp.ok) return null;
    return (await resp.json()) as MLPredictOutput;
  } catch (e) {
    return null;
  }
}