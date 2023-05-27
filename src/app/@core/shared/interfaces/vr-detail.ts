import { CrewDetail } from "./crew-detail";
import { FlightDetail } from "./flight-detail";

export interface VrDetail {
    uuid: string;
    date: string;
    endorsement: string;
    ferry: string;
    training: string;
    testFlt: string;
    revenue: string;
    charter: string;
    crewsId: string[];
    crews: CrewDetail[];
    flights: FlightDetail[];
    comment: string;
    extendedTime: string;
    extendedSignature: string;
    vrSignature: string;
}

export const defaultVR: VrDetail = {
    uuid: "",
    date: "",
    endorsement: "false",
    ferry: "false",
    training: "false",
    testFlt: "false",
    revenue: "true",
    charter: "false",
    crewsId: [],
    crews: [],
    flights: [],
    comment: "",
    extendedTime: "",
    extendedSignature: "",
    vrSignature: ""
}
