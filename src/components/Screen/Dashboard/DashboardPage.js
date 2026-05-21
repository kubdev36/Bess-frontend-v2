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
    <div className="DAT_Dashboard_Page animate-fadeIn">
      <section className="DAT_Dashboard_Page_Section">
        <div className="DAT_Dashboard_Page_Section_KpiGrid">
          <Infor />
          <Infor2 />
        </div>
      </section>

      <section className="DAT_Dashboard_Page_Section mt-base">
        <div className="DAT_Dashboard_Page_Section_VisualCard card">
          <div className="DAT_Dashboard_Page_Section_VisualCard_Layout">
            <div className="DAT_Dashboard_Page_Section_VisualCard_Layout_Main">
              <div className="DAT_Dashboard_Page_Section_VisualCard_Layout_Main_Scene">
                <Flow />
              </div>
            </div>

            <div className="DAT_Dashboard_Page_Section_VisualCard_Layout_Side">
              <WeatherWidget />
              <Circle />
              <EconomicBenefitCard />
            </div>
          </div>
        </div>
      </section>

      <section className="DAT_Dashboard_Page_Section DAT_Dashboard_Page_Section_Grid mt-base">
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
