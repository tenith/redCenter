import { CrewDetail } from "../shared/interfaces/crew-detail";
import { DelayDetail } from "../shared/interfaces/delay-detail";
import { FlightDetail } from "../shared/interfaces/flight-detail";
import { FuelDetail } from "../shared/interfaces/fuel-detail";
import { VrDetail } from "../shared/interfaces/vr-detail";

export const crewsMockup: CrewDetail[] = [
    { id: "1002048", position: "CP*", name: "WUTTHICHAI1 R", report: "06:20" },
    { id: "1002049", position: "CP", name: "WUTTHICHAI2 R", report: "06:20" },
    { id: "1002050", position: "CP", name: "WUTTHICHAI3 R", report: "06:20" },
];

export const fuelDetail: FuelDetail = {
    uplift: "1000",
    burn: "20"
};

export const departureDelay: DelayDetail[] = [{
    delayTime: "02:10",
    code: "88"
}];

export const arrivalDelay: DelayDetail[] = [{
    delayTime: "02:20",
    code: "89"
}];

export const flightsMockup: FlightDetail[] = [
    { fltNO: "3108", registration: "HS-ABA", from: "DMK", to: "HDY", std: "01:20", sta: "02:40", blk: "01:20", offChk: "01:20", takeOff: "01:30", landing: "02:35", onChk: "02:40", actBlk: "01:20", PFId: "1002048",  uplift: '', burn: '', departureDelayTime1: '', departureDelayCode1: '', departureDelayTime2: '', departureDelayCode2: '', departureDelayTime3: '', departureDelayCode3: '', arrivalDelayTime1: '', arrivalDelayCode1: '' },
    { fltNO: "3109", registration: "HS-ABB", from: "HDY", to: "DMK", std: "01:20", sta: "02:40", blk: "01:20", offChk: "01:20", takeOff: "01:30", landing: "02:35", onChk: "02:40", actBlk: "01:20", PFId: "1002048",  uplift: '', burn: '', departureDelayTime1: '', departureDelayCode1: '', departureDelayTime2: '', departureDelayCode2: '', departureDelayTime3: '', departureDelayCode3: '', arrivalDelayTime1: '', arrivalDelayCode1: '' },
];