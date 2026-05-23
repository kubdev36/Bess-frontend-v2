import React, { useEffect, useState } from "react";
import Circle from "./Circle";
import EconomicBenefitCard from "./Economic";
import Flow from "./Flow";
import Infor from "./Infor";
import Infor2 from "./Infor2";
import PowerTrendChart from "./LineChart";
import WeatherWidget from "./Weather";
import "./Dashboard.scss";
import { callApi } from "../../Api/Api";
import { socket } from "../../../App";

export default function Dashboard() {
  const [data, setData] = useState({});
  const [step, setStep] = useState(0)
  // const Navi = useNavigate();

  useEffect(() => {


    (async () => {
        console.log("Step changed--");
      let data = await callApi("post", process.env.REACT_APP_API + "/data/readBess", {
        level: "pcslevel",
      });

      if (data.status === 'true') {
        console.log(data.data);
        setData(data.data);

        setStep(1);
      } else {
        console.log("Failed to get data");
      }

    })();

  }, []);

  useEffect(() => {
  

    if (!step) return;
    console.log('Connecting to Socket.IO server...');
    socket.value.emit("BESS_SUBSCRIBE", {
      level: "pcslevel",
    });

    // socket.value.emit("BESS_SUBSCRIBE_MANY", {
    //     levels: ["pcslevel"],
    // });

    socket.value.on("BESS_DATA", (payload) => {
      // console.log(payload.level, payload.data);

      Object.keys(payload.data).map((keyName, i) => {

        setData(data => ({ ...data, [keyName]: payload.data[keyName] }));
      });
    });


    return () => {
      socket.value.emit("BESS_UNSUBSCRIBE", {
        level: "pcslevel",
      });
      
      // socket.value.emit("BESS_UNSUBSCRIBE_MANY", {
      //     levels: ["pcslevel", "bmslevel"],
      // });
      socket.value.off("BESS_DATA");
    };


  }, [step]);



  return (
    <div className="DAT_Dashboard_Page">
      <section className="DAT_Dashboard_Page_Section">
        <div className="DAT_Dashboard_Page_Section_KpiGrid">
          <Infor data={data} />
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
