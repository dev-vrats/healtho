export const mockData = {
  user: { name: "Alex Rivera" },
  scores: {
    vitalityScore: { value: 70, max: 100, status: "On Track" },
    biologicalAge: { value: 25, chronologicalAge: 27.5, deltaLabel: "2.5 years younger" }
  },
  summary: { total: 106, optimal: 80, inRange: 21, outOfRange: 5 },
  trend: {
    label: "Health Improving",
    delta: "+3.2 (30d)",
    history: [
      { date: "2026-04-01", value: 66, status: "normal" },
      { date: "2026-05-01", value: 68, status: "optimal" },
      { date: "2026-06-01", value: 70, status: "optimal" }
    ]
  },
  categories: [
    { id: "longevity", label: "Longevity Markers", meta: "25 yrs" },
    { id: "heart", label: "Heart Health", meta: "72/100" },
    { id: "thyroid", label: "Thyroid Health" },
    { id: "immune", label: "Immune Regulation" },
    { id: "hormone", label: "Hormone Health", meta: "Balanced" },
    { id: "metabolic", label: "Metabolic Health", meta: "78/100" },
    { id: "nutrients", label: "Nutrients" },
    { id: "blood", label: "Blood", meta: "Normal" }
  ],
  biomarkers: [
    { label: "LDL Cholesterol", value: 103, unit: "mg/dl", category: "heart", status: "out-of-range" as const },
    { label: "Vitamin D", value: 43, unit: "ng/dL", category: "nutrients", status: "in-range" as const },
    { label: "Apolipoprotein B", value: 42, unit: "mg/dl", category: "heart", status: "in-range" as const }
  ],
  pendingResults: { etaDaysMin: 7, etaDaysMax: 10, note: "Until then your lab draw data is processed." },
  recommendations: [
    { name: "Ashwagandha Balance", price: 24.30, tag: "Best Seller" as const },
    { name: "L-Theanine Calm", price: 19.90, tag: "Best Seller" as const },
    { name: "Phosphatidylserine Complex", price: 45.00, tag: "Fair Price" as const }
  ]
};
