"use client";

import { LineChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
} from "echarts/components";
import type { ECharts } from "echarts/core";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { useEffect, useMemo, useRef } from "react";

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

function buildChartOption(series: DashboardSeriesPoint[]) {
  return {
    animationDuration: 500,
    color: ["#0E5B3B"],
    tooltip: { trigger: "axis" as const },
    grid: { left: 8, right: 8, top: 16, bottom: 12, containLabel: true },
    xAxis: {
      type: "category" as const,
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
      type: "value" as const,
      minInterval: 1,
      axisLabel: { color: "#64748B" },
      splitLine: { lineStyle: { color: "#EEF2F7" } },
    },
    series: [
      {
        name: "Vérifications",
        type: "line" as const,
        smooth: true,
        symbol: "circle",
        symbolSize: 7,
        data: series.map((point) => point.verifications),
      },
    ],
  };
}

export function TrendChart({ series }: TrendChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<ECharts | null>(null);

  const validSeries = useMemo(
    () =>
      series.filter((point) => {
        const timestamp = new Date(point.date).getTime();
        return Number.isFinite(timestamp);
      }),
    [series],
  );

  useEffect(() => {
    const element = chartRef.current;
    if (!element) return;

    const chart = echarts.init(element);
    chartInstanceRef.current = chart;

    const resizeObserver = new ResizeObserver(() => {
      chartInstanceRef.current?.resize();
    });
    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
      chart.dispose();
      chartInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const chart = chartInstanceRef.current;
    if (!chart || validSeries.length === 0) return;
    chart.setOption(buildChartOption(validSeries), true);
  }, [validSeries]);

  if (validSeries.length === 0) {
    return (
      <div className="flex h-[280px] items-center justify-center rounded-2xl bg-base-200/60 text-sm text-base-content/55">
        Aucune donnée de tendance disponible.
      </div>
    );
  }

  return <div ref={chartRef} className="h-[280px] w-full" />;
}
