"use client";

import { LineChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { useEffect, useRef } from "react";

import type { DashboardSeriesPoint } from "~/types/admin";

echarts.use([
  LineChart,
  GridComponent,
  TooltipComponent,
  CanvasRenderer,
]);

interface TrendChartProps {
  series: DashboardSeriesPoint[];
}

export function TrendChart({ series }: TrendChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    chart.setOption({
      animationDuration: 500,
      color: ["#0E5B3B"],
      tooltip: { trigger: "axis" },
      grid: { left: 8, right: 8, top: 16, bottom: 12, containLabel: true },
      xAxis: {
        type: "category",
        boundaryGap: true,
        data: series.map((point) =>
          new Date(point.date).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "short",
          }),
        ),
        axisLine: { lineStyle: { color: "#E5EAF0" } },
        axisTick: { show: false },
        axisLabel: { color: "#64748B" },
      },
      yAxis: {
        type: "value",
        minInterval: 1,
        axisLabel: { color: "#64748B" },
        splitLine: { lineStyle: { color: "#EEF2F7" } },
      },
      series: [
        {
          name: "Enrôlements",
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 7,
          data: series.map((point) => point.enrollments),
        },
      ],
    });

    const resizeObserver = new ResizeObserver(() => chart.resize());
    resizeObserver.observe(chartRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.dispose();
    };
  }, [series]);

  return <div ref={chartRef} className="h-[280px] w-full" />;
}
