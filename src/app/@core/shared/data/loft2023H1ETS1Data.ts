import { ETS1Data } from "../interfaces/e-ts1-data";

export let loft2023H1ETS1Data : ETS1Data =  
{
	//BACKEND AND HEADER
	uuid : "",date : "", ownerEmail: "", initDateTime : "", submitDateTime : "", submitByEmail : "" ,completedDateTime : "", completedByEmail : "",
	
	//SECTION A.....
	rank1 : "",name1 : "",staffNo1 : "",license1No : "",license1Expiry : "",
	rank2 : "",name2 : "",staffNo2 : "",
	
	//SECTION B.....
	classRoom : "",aircraftType : "A320",airport : "ZUCK-VTBD",sectorsNo : "N/A",accSectorsNO : "N/A",
	instructor : "false",instructorDetail : "",gti : "false",sfi : "false",tri : "false",sfe : "false",tre : "false",
	
	//SECTION C.....
	linePilot : "true",ioe : "false",ccq : "false",cuc : "false",stc : "false",
	loft : "true",skillTest : "false",skillTestDetail : "",fbs : "false",fbsDetail : "",ffs : "false",ffsDetail : "",lfus : "false",
	aq : "false",aqDetail : "",aqNarrative : "",rhs : "false",rhsDetail : "",
	zftt : "false",zfttDetail : "",ilc : "false",ilcDetail : "",observe : "false",
	specialOps : "true",specialDetail : "RVSM, RNAV/RNP",

	others : "true",
	othersDetail1 : "JET UPSET, WIND SHEAR RECOVERY,",
	othersDetail2 : "R-UPRT, TCAS, TYPHOON PROCEDURE,",
	othersDetail3 : "PILOT INCAPACITATION",
	progress : "false",progressDetail : "",

	//SECTION D.....
	preFlightPFScore : "",startPFScore : "",takeOffPFScore : "",climbPFScore : "",descendPFScore : "",approachPFScore : "",goAroundPFScore : "",landingPFScore : "",afterLandingPFScore : "",parkingPFScore : "",flightManagementPFScore : "",specialOpsPFScore : "",
	preFlightPMScore : "",startPMScore : "",takeOffPMScore : "",climbPMScore : "",descendPMScore : "",approachPMScore : "",goAroundPMScore : "",landingPMScore : "",afterLandingPMScore : "",parkingPMScore : "",flightManagementPMScore : "",specialOpsPMScore : "",

	//SECTION E.....
	system1Detail : "R-UPRT",system1Score : "",system2Detail : "RVSM",system2Score : "",system3Detail : "RNAV/RNP",system3Score : "",system4Detail : "TYPHOON PROCEDURE",system4Score : "",system5Detail : "PILOT INCAPACITATION",system5Score : "",system6Detail : "FUEL L TK PUMP LO PR",system6Score : "",
	abNormal1Detail : "TCAS PROCEDURE",abNormal1Score : "",abNormal2Detail : "WIND SHEAR RECOVERY",abNormal2Score : "",abNormal3Detail : "VENT BLOWER FAULT",abNormal3Score : "",abNormal4Detail : "FUEL LEAK",abNormal4Score : "",abNormal5Detail : "DOOR/CARGO DOOR OPEN",abNormal5Score : "",abNormal6Detail : "AIR PACK2 OVERHEAT",abNormal6Score : "",

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