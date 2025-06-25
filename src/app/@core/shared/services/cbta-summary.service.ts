import { Injectable } from "@angular/core";
import { ETS1Data } from "../interfaces/e-ts1-data";
import { PcSummary } from "../interfaces/pcSummary";

@Injectable({ providedIn: "root" })
export class CbtaSummaryService {
  summarizeFromETS1(data: ETS1Data): PcSummary[] {
    const allSummaries: PcSummary[] = [];
    const pcAggregate: Map<
      number,
      { observed: number; total: number; howMany: number; totalMany: number }
    > = new Map();

    const systemSources = [
      { name: data.system1Detail, pcs: data.system1PCList },
      { name: data.system2Detail, pcs: data.system2PCList },
      { name: data.system3Detail, pcs: data.system3PCList },
      { name: data.system4Detail, pcs: data.system4PCList },
      { name: data.system5Detail, pcs: data.system5PCList },
      { name: data.system6Detail, pcs: data.system6PCList },
      { name: data.abNormal1Detail, pcs: data.abNormal1PCList },
      { name: data.abNormal2Detail, pcs: data.abNormal2PCList },
      { name: data.abNormal3Detail, pcs: data.abNormal3PCList },
      { name: data.abNormal4Detail, pcs: data.abNormal4PCList },
      { name: data.abNormal5Detail, pcs: data.abNormal5PCList },
      { name: data.abNormal6Detail, pcs: data.abNormal6PCList },
    ];

    for (const system of systemSources) {
      if (!system.pcs || !system.name) continue;

      for (const pc of system.pcs) {
        let observedSum = 0;
        let totalSum = 0;
        let howMany = 0;
        let totalMany = 0;

        for (const ob of pc.obList || []) {
          if (ob.observed > 0) howMany++;
          if (ob.total > 0) totalMany++; // totalMany means "max > 0" from your description
          observedSum += ob.observed;
          totalSum += ob.total;
        }

        const howOften =
          totalSum === 0 ? 0 : +((observedSum / totalSum) * 100).toFixed(2);

        allSummaries.push({
          pcID: pc.id,
          howMany,
          totalMany,
          howOften,
          eventName: system.name,
        });

        if (!pcAggregate.has(pc.id)) {
          pcAggregate.set(pc.id, {
            observed: 0,
            total: 0,
            howMany: 0,
            totalMany: 0,
          });
        }
        const agg = pcAggregate.get(pc.id)!;
        agg.observed += observedSum;
        agg.total += totalSum;
        agg.howMany += howMany;
        agg.totalMany += totalMany;
      }
    }

    // Total summaries for each PC
    let totalObserved = 0;
    let totalAll = 0;
    let totalHowMany = 0;
    let totalTotalMany = 0;

    for (const [
      pcID,
      { observed, total, howMany, totalMany },
    ] of pcAggregate.entries()) {
      const howOften = total === 0 ? 0 : +((observed / total) * 100).toFixed(2);
      allSummaries.push({ pcID, howMany, totalMany, howOften });

      totalObserved += observed;
      totalAll += total;
      totalHowMany += howMany;
      totalTotalMany += totalMany;
    }

    // Final summary for all 9 PCs (pcID = 0)
    const overallHowOften =
      totalAll === 0 ? 0 : +((totalObserved / totalAll) * 100).toFixed(2);
    allSummaries.push({
      pcID: 0,
      howMany: totalHowMany,
      totalMany: totalTotalMany,
      howOften: overallHowOften,
    });

    console.log(JSON.stringify(allSummaries));
    return allSummaries;
  }
}
