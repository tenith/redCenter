import { ETS1Data } from "../interfaces/e-ts1-data";

export let cleanETS1Data : ETS1Data =  
{
	//BACKEND AND HEADER
	uuid : "",date : "", ownerEmail: "", initDateTime : "", submitDateTime : "", submitByEmail : "" ,completedDateTime : "", completedByEmail : "",
	
	//SECTION A.....
	rank1 : "",name1 : "",staffNo1 : "",license1No : "",license1Expiry : "",
	rank2 : "",name2 : "",staffNo2 : "",
	
	//SECTION B.....
	classRoom : "",aircraftType : "A320",airport : "",sectorsNo : "",accSectorsNO : "",
	instructor : "false",instructorDetail : "",gti : "false",sfi : "false",tri : "false",sfe : "false",tre : "false",
	
	//SECTION C.....
	linePilot : "false",ioe : "false",ccq : "false",cuc : "false",stc : "false",
	loft : "false",skillTest : "false",skillTestDetail : "",fbs : "false",fbsDetail : "",ffs : "false",ffsDetail : "",lfus : "false",
	aq : "false",aqDetail : "",aqNarrative : "",rhs : "false",rhsDetail : "",
	zftt : "false",zfttDetail : "",ilc : "false",ilcDetail : "",observe : "false",
	specialOps : "false",specialDetail : "",

	others : "false",
	othersDetail1 : "",
	othersDetail2 : "",
	othersDetail3 : "",
	progress : "false",progressDetail : "",

	//SECTION D.....
	preFlightPFScore : "",startPFScore : "",takeOffPFScore : "",climbPFScore : "",descendPFScore : "",approachPFScore : "",goAroundPFScore : "",landingPFScore : "",afterLandingPFScore : "",parkingPFScore : "",flightManagementPFScore : "",specialOpsPFScore : "",
	preFlightPMScore : "",startPMScore : "",takeOffPMScore : "",climbPMScore : "",descendPMScore : "",approachPMScore : "",goAroundPMScore : "",landingPMScore : "",afterLandingPMScore : "",parkingPMScore : "",flightManagementPMScore : "",specialOpsPMScore : "",

	//SECTION E.....
	system1Detail : "",system1Score : "",system2Detail : "",system2Score : "",system3Detail : "",system3Score : "",system4Detail : "",system4Score : "",system5Detail : "",system5Score : "",system6Detail : "",system6Score : "",
	abNormal1Detail : "",abNormal1Score : "",abNormal2Detail : "",abNormal2Score : "",abNormal3Detail : "",abNormal3Score : "",abNormal4Detail : "",abNormal4Score : "",abNormal5Detail : "",abNormal5Score : "",abNormal6Detail : "",abNormal6Score : "",

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