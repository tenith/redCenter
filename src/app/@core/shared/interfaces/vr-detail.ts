import { CrewDetail } from "./crew-detail";
import { FlightDetail } from "./flight-detail";
import { CommentDetail } from "./comment";

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
    comments: CommentDetail[];
    comment: string;
    extendedTime: string;
    extendedSignature: string;
    vrSignature: string;
    submitTime: string;
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
    comments: [],
    comment: "",
    extendedTime: "",
    extendedSignature: "",
    vrSignature: "",
    submitTime: ""

}
