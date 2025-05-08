import { useState } from "react";
import { ArrowLeft, ArrowRight, BarChart2 } from "lucide-react";

const days = Array.from({ length: 31 }, (_, i) => i + 1);

// ---------------- MOCK DATA (same shape) -----------------------------
const mockData = {
  Venituri: {
    Salarii: { 1: 1_000, 5: 2_500 },
    Dividende: { 7: 800 },
  },
  Cheltuieli: {
    Utilitati: { 1: -200, 8: -400, 31: -1_200 },
    Alimente: { 2: -50, 3: -100, 5: -300, 6: -75, 31: -200 },
  },
  Economii: {
    Rezerva: { 4: -500 },
  },
};
// ---------------------------------------------------------------------

// Helpers
const format = (val?: number) =>
  val?.toLocaleString("ro-RO", { minimumFractionDigits: 0 }) ?? "—";

const cellColor = (v?: number) => {
  if (v === undefined) return "";
  if (v < 0) return v < -500 ? "bg-red-300" : "bg-yellow-300";
  return "bg-green-300";
};

export default function MonthlyGridPreview() {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [month, setMonth] = useState("Mai 2025");
  const [collapseAll, setCollapseAll] = useState(false);

  const toggle = (cat: string) =>
    setExpanded((s) => ({ ...s, [cat]: !s[cat] }));

  // total pe zi
  const dailyTotals: Record<number, number> = {};
  Object.values(mockData).forEach((subs: any) => {
    Object.values(subs).forEach((vals: any) => {
      Object.entries(vals).forEach(([d, v]) => {
        const day = Number(d);
        dailyTotals[day] = (dailyTotals[day] || 0) + (v as number);
      });
    });
  });

  // total pe categorie (pentru rând collapsed)
  const collapsedSum = (subs: any) => {
    const sum: Record<number, number> = {};
    Object.values(subs).forEach((grp: any) => {
      Object.entries(grp).forEach(([k, v]) => {
        const day = Number(k);
        sum[day] = (sum[day] || 0) + (v as number);
      });
    });
    return sum;
  };

  return (
    <div className="w-full overflow-x-auto rounded-lg border shadow">
      {/* ===== Header / summary bar ===== */}
      <div className="flex items-center justify-between bg-gray-100 px-4 py-3">
        <h1 className="text-lg font-semibold">Planificare · {month}</h1>
        <div className="flex items-center gap-2">
          <button className="btn-icon" aria-label="Prev">
            <ArrowLeft size={18} />
          </button>
          <button className="btn-icon" aria-label="Next">
            <ArrowRight size={18} />
          </button>
          <button
            className="btn-icon"
            title="Toggle centralizare / detaliu"
            onClick={() => setCollapseAll((v) => !v)}
          >
            <BarChart2 size={18} />
          </button>
        </div>
      </div>

      {/* KPI bar */}
      <div className="grid grid-cols-2 gap-4 bg-teal-600 px-4 py-2 text-sm text-white">
        <div className="font-semibold">TOTAL SURPLUS</div>
        <div className="font-semibold">
          LICHIDITĂȚI RĂMASE (VENITURI‑ECONOMII‑CHELTUIELI)
        </div>
        <div>RON 4 321,04</div>
        <div>RON 15 058,18</div>
      </div>

      {/* ===== Grid table ===== */}
      <div className="overflow-auto">
        <table className="min-w-full border-collapse text-xs">
          <thead className="sticky top-0 z-20 bg-teal-700 font-semibold uppercase text-white">
            <tr>
              <th className="sticky left-0 z-20 border-r bg-teal-700 px-3 py-1 text-left">
                Categorie
              </th>
              {days.map((d) => (
                <th key={d} className="w-24 border px-2 py-1 text-center">
                  {d}
                </th>
              ))}
              <th className="w-28 border px-2 py-1 text-center">Total</th>
            </tr>
          </thead>
          <tbody>
            {/* Rând total zi (centralizat) */}
            <tr className="bg-gray-100 font-semibold">
              <th className="sticky left-0 z-10 border-r px-3 py-1 text-left">
                Total Zilnic
              </th>
              {days.map((d) => (
                <td key={d} className={"w-24 border px-3 text-right " + cellColor(dailyTotals[d])}>
                  {format(dailyTotals[d])}
                </td>
              ))}
              <td className="w-28 border px-3 text-right">—</td>
            </tr>

            {Object.entries(mockData).map(([cat, subs]) => {
              const collapsedRow = collapsedSum(subs);
              const totalCat = (Object.values(collapsedRow) as number[]).reduce((a, b) => a + b, 0);
              const isCollapsed = collapseAll ? true : !expanded[cat];

              return (
                <>
                  <tr
                    key={cat}
                    className="cursor-pointer bg-teal-200 hover:bg-teal-300"
                    onClick={() => toggle(cat)}
                  >
                    <th className="sticky left-0 z-10 border-r px-3 py-1 text-left">
                      {isCollapsed ? "📁" : "📂"} {cat}
                    </th>
                    {days.map((d) => (
                      <td
                        key={d}
                        className={`w-24 border px-3 text-right font-semibold ${cellColor(collapsedRow[d])}`}
                      >
                        {format(collapsedRow[d])}
                      </td>
                    ))}
                    <td className="w-28 border px-3 text-right font-semibold">
                      {format(totalCat)}
                    </td>
                  </tr>

                  {!isCollapsed &&
                    Object.entries(subs as any).map(([sub, vals]: any) => {
                      const totalSub = (Object.values(vals) as number[]).reduce(
                        (a, b) => a + b,
                        0,
                      );
                      return (
                        <tr
                          key={sub}
                          className="bg-white hover:bg-gray-50 border-t border-dotted border-gray-300"
                        >
                          <th className="sticky left-0 z-10 border-r bg-white px-3 py-1 pl-8 text-left">
                            {sub}
                          </th>
                          {days.map((d) => (
                            <td
                              key={d}
                              className={`w-24 border px-3 text-right ${cellColor(vals[d])}`}
                            >
                              {format(vals[d] as number)}
                            </td>
                          ))}
                          <td className="w-28 border px-3 text-right">{format(totalSub)}</td>
                        </tr>
                      );
                    })}
                </>
              );
            })}

            {/* SOLD row placeholder */}
            <tr className="bg-gray-800 text-white">
              <th className="sticky left-0 z-10 border-r px-3 py-1 text-left">SOLD</th>
              {days.map((d) => (
                <td key={d} className="w-24 border px-3 text-right font-semibold">
                  —
                </td>
              ))}
              <td className="w-28 border px-3 text-right">—</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* Tailwind helper (add in global CSS):
.btn-icon {
  @apply rounded bg-gray-200 p-1 hover:bg-gray-300 active:scale-95 transition;
}
*/
