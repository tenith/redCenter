import { ETS1Data } from "../interfaces/e-ts1-data";

export let coft2023H2ETS1Data : ETS1Data =  
{
	//BACKEND AND HEADER
	uuid : "",date : "", ownerEmail: "", initDateTime : "", submitDateTime : "", submitByEmail : "" ,completedDateTime : "", completedByEmail : "",
	
	//SECTION A.....
	rank1 : "",name1 : "",staffNo1 : "",license1No : "",license1Expiry : "",
	rank2 : "",name2 : "",staffNo2 : "",
	
	//SECTION B.....
	classRoom : "",aircraftType : "A320",airport : "VMMC-VTSG",sectorsNo : "N/A",accSectorsNO : "N/A",
	instructor : "false",instructorDetail : "",gti : "false",sfi : "false",tri : "false",sfe : "false",tre : "false",
	
	//SECTION C.....
	linePilot : "true",ioe : "false",ccq : "false",cuc : "false",stc : "false",
	loft : "false",skillTest : "true",skillTestDetail : "OPC",fbs : "false",fbsDetail : "",ffs : "false",ffsDetail : "",lfus : "false",
	aq : "false",aqDetail : "",aqNarrative : "",rhs : "false",rhsDetail : "",
	zftt : "false",zfttDetail : "",ilc : "false",ilcDetail : "",observe : "false",
	specialOps : "true",specialDetail : "LVO, RNP APCH",

	others : "true",
	othersDetail1 : "COLD WEATHER OPERATION",
	othersDetail2 : "",
	othersDetail3 : "",
	progress : "false",progressDetail : "",

	//SECTION D.....
	preFlightPFScore : "",startPFScore : "",takeOffPFScore : "",climbPFScore : "",descendPFScore : "",approachPFScore : "",goAroundPFScore : "",landingPFScore : "",afterLandingPFScore : "",parkingPFScore : "",flightManagementPFScore : "",specialOpsPFScore : "",
	preFlightPMScore : "",startPMScore : "",takeOffPMScore : "",climbPMScore : "",descendPMScore : "",approachPMScore : "",goAroundPMScore : "",landingPMScore : "",afterLandingPMScore : "",parkingPMScore : "",flightManagementPMScore : "",specialOpsPMScore : "",

	//SECTION E.....
	system1Detail : "NON-PRECISION APCH",system1Score : "",system2Detail : "AREA DEPARTURE & ARRIVAL",system2Score : "",system3Detail : "LVO",system3Score : "",system4Detail : "HOLDING",system4Score : "",system5Detail : "EVACUATION",system5Score : "",system6Detail : "LOSS OF BRAKING",system6Score : "",
	abNormal1Detail : "REJECTED TAKEOFF",abNormal1Score : "",abNormal2Detail : "TAKEOFF ENG. FAIL BETWEEN V1 AND V2",abNormal2Score : "",abNormal3Detail : "INSTRUMENT APCH TO DECISION HEIGHT WITH 1EO",abNormal3Score : "",abNormal4Detail : "MISS APCH WITH 1EO FROM DECISION HEIGHT",abNormal4Score : "",abNormal5Detail : "LANDING WITH FD MALFUNCTION",abNormal5Score : "",abNormal6Detail : "LANDING WITH 1EO",abNormal6Score : "",

	//SECTION F.....
	knoScore : "",proScore : "",fpmScore : "",fpaScore : "",comScore : "",  wlmScore : "",psdScore : "",ltwScore : "",sawScore : "",
	iec1Score : "",iec2Score : "",iec3Score : "",iec4Score : "",iec5Score : "",

	//SECTION G.....
	deScores : ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""],
	pcScores : ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""],
	iecScores : ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""],
	noteDetails : ["","","","","","","","","","","","","","","","","","","","","","","","","","","","","","",""],
	
	//SECTION H.....
	cmdRecommended : "false",gtiRecommended : "false",triRecommended : "false",treRecommended : "false",othersRecommended : "false",othersRecommendedDetail : "",signatureRecommended : "",
	trainingCompleted : "",objectMet : "",clearCheck : "",overAllScore : "",attemptNumber : "N/A",
	name3 : "",license3No : "",signatureInstructor : "",signatureInstructorDate : "",signatureTrainee : "",

	//SECTION I.....
	formCompleted : "false",copyCAAT : "false",validityDate : "false",cmsUpdate : "false",signatureStaff1 : "",signatureStaff1Date : "",signatureStaff2 : "",signatureStaff2Date : "",signatureStaff3 : "",signatureStaff3Date : ""
};