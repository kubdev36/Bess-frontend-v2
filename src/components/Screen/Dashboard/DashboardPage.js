import React from "react";
import Circle from "./Circle";
import EconomicBenefitCard from "./Economic";
import Flow from "./Flow";
import Infor from "./Infor";
import Infor2 from "./Infor2";
import PowerTrendChart from "./LineChart";
import WeatherWidget from "./Weather";
import "./Dashboard.scss";

export default function DashboardPage() {
  return (
    <div className="dashboard animate-fadeIn">
      <section className="dashboard-section">
        <div className="kpi-grid">
          <Infor />
          <Infor2 />
        </div>
      </section>

      <section className="dashboard-section mt-base">
        <div className="card dashboard-visual-card">
          <div className="visual-layout">
            <div className="visual-layout-main">
              <div className="visual-scene">
                <Flow />
              </div>
            </div>

            <div className="visual-layout-side">
              <WeatherWidget />
              <Circle />
              <EconomicBenefitCard />
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-grid mt-base">
        <PowerTrendChart
          titleId="dashboard_chart_title"
          subtitleId="dashboard_chart_main_subtitle"
          defaultMode="day"
        />
        <PowerTrendChart
          titleId="dashboard_chart_title"
          subtitleId="dashboard_chart_secondary_subtitle"
          defaultMode="month"
        />
      </section>
    </div>
  );
}
