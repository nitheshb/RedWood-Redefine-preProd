import "./ReportBars.css";
import { reportData } from "./data";

const ReportBars = () => {
  return (
    <div className="flex flex-col">

        <div className=" mt-3">
            <div className="flex flex-row ">
                <div className="chart-vert-value text-[#828d9e] ">
                    <span>20</span>
                    <span>15</span>
                    <span>10</span>
                    <span>05</span>
                    <span>00</span>
                </div>
                <div className="flex flex-row justify-between w-full ml-2">
                {
                    reportData.map((report) => (
                        <div className="grid-chart-bar" key={report.id}>
                            <div className="bar-wrapper">
                                <div className="bar-item1" style={{ height: `${report.value1 !== null ? "40%" : ""}` }}></div>
                                <div className="bar-item2" style={{ height: `${report.value2 !== null ? "60%" : ""}` }}></div>
                            </div>
                            <span className="grid-hortz-value text-[#828d9e] text-xs">{report?.month}</span>
                        </div>
                    ))
                }
                </div>

            </div>
        </div>
    </div>
  )
}

export default ReportBars
