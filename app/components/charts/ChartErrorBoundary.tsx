"use client";

import { Component, type ReactNode } from "react";

interface ChartErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ChartErrorBoundaryState {
  hasError: boolean;
}

export class ChartErrorBoundary extends Component<
  ChartErrorBoundaryProps,
  ChartErrorBoundaryState
> {
  state: ChartErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ChartErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex h-[280px] items-center justify-center rounded-2xl bg-base-200/60 text-sm text-base-content/55">
            Le graphique n’a pas pu être affiché.
          </div>
        )
      );
    }

    return this.props.children;
  }
}
