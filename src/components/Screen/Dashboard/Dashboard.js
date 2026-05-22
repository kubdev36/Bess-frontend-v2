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
    <div className="DAT_Dashboard_Page">
      <section className="DAT_Dashboard_Page_Section">
        <div className="DAT_Dashboard_Page_Section_KpiGrid">
          <Infor />
          <Infor2 />
        </div>
      </section>

      <section className="DAT_Dashboard_Page_Section">
        <div className="DAT_Dashboard_Page_Section_VisualCard">
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

      <section className="DAT_Dashboard_Page_Section_Grid">
        <PowerTrendChart
          titleId="dashboard_chart_title"
        />
        <PowerTrendChart
          titleId="dashboard_chart_title"
        />
      </section>
    </div>
  );
}
