export interface ETS1Data {
    /**************************
    ETS1 REV. :06/08 JAN 22
    CREATED ON [12 SEP 2022] BY WUTTHICHAIR@AIRASIA.COM

    THIS INTERFACE REPRESENT TO ETS1 FORM'S INFORMATION
    THERE IS 11 SECTIONS
    
    BACKEND     07 FIELDS
    HEADER      01 FIELDS
    SECTION A   08 FIELDS
    SECTION B   05 FIELDS
    SECTION C   37 FIELDS
    SECTION D   24 FIELDS
    SECTION E   24 FIELDS
    SECTION F   13 FIELDS
    SECTION G   04 FIELDS
    SECTION H   17 FIELDS
    SECTION I   10 FIELDS

    TOTAL      150 FIELDS
    **************************/

    /**************************
        BACKEND FOR MANAGEMENT PURPOSE
        uuid : Primary Key of this ETS1
        ownerEmail : Email of owner who has init the form.
        initDateTime : Date Time of the form when instructor has initiated the form.
        submitDateTime : Date Time of the form when instructor has submitted the form to the system.
        submitByEmail : Email of the person who submit this form to Trainging Department.
        completedDateTime : Dateim Time of the form when admin has finalized the form and export eTS1 as PDF.
        completedByEmail : Email of the person who finalized the form.
        Total 6 Fields
    **************************/
    uuid : any;

    ownerEmail: any;
    initDateTime : any;

    submitDateTime : any;
    submitByEmail : any;

    completedDateTime : any;
    completedByEmail : any;

    /**************************
        HEADER
        Total 1 Fields
    **************************/
    date : any;

    /**************************
        SECTION A CANDIDATE'S DETAILS
        Total 8 Fields
    **************************/
    rank1 : any;
    name1 : any;
    staffNo1 : any;

    license1No : any;
    license1Expiry : any;

    rank2 : any;
    name2 : any;
    staffNo2 : any;

    /**************************
        SECTION B GROUND/SIMULATOR/FILGHT'S DETAIL
        Total 5 Fields
    **************************/
    classRoom : any;
    aircraftType : any;
    airport : any;
    sectorsNo : any;
    accSectorsNO : any;

    /**************************
        SECTION C SESSION DETAILS
        Total 37 Fields
    **************************/
    //COLUMN 1 
    //7 Fields
    instructor : any;
    instructorDetail : any;
    gti : any;
    sfi : any;
    tri : any;
    sfe : any;
    tre : any;
    
    //COLUMN 2
    //5 Fields
    linePilot : any;
    ioe : any;
    ccq : any;
    cuc : any;
    stc : any;

    //COLUMN 3
    //8 Fields
    loft : any;
    skillTest : any;
    skillTestDetail : any;

    fbs : any;
    fbsDetail : any;
    
    ffs : any;
    ffsDetail : any;
    lfus : any;

    //COLUMN 4
    //9 Fields
    aq : any;
    aqDetail : any;
    aqNarrative : any;
    
    rhs : any;
    rhsDetail : any;

    zftt : any;
    zfttDetail : any;

    ilc : any;
    ilcDetail : any;

    observe : any;

    //COLUMN 5
    //8 Fields
    specialOps : any;
    specialDetail : any;

    others : any;
    othersDetail1 : any;
    othersDetail2 : any;
    othersDetail3 : any;
    
    progress : any;
    progressDetail : any;
    
    /**************************
        SECTION D
        Total 24 Fields
    **************************/
    //PF Section
    //12 Fields
    preFlightPFScore : any;
    startPFScore : any;
    takeOffPFScore : any;
    climbPFScore : any;
    descendPFScore : any;
    approachPFScore : any;
    goAroundPFScore : any;
    landingPFScore : any;
    afterLandingPFScore : any;
    parkingPFScore : any;
    flightManagementPFScore : any;
    specialOpsPFScore : any;

    //PM Section
    //12 Fields
    preFlightPMScore : any;
    startPMScore : any;
    takeOffPMScore : any;
    climbPMScore : any;
    descendPMScore : any;
    approachPMScore : any;
    goAroundPMScore : any;
    landingPMScore : any;
    afterLandingPMScore : any;
    parkingPMScore : any;
    flightManagementPMScore : any;
    specialOpsPMScore : any;

    /************************** 
        SECTION E
        Total 24 Fields
    **************************/
    system1Detail : any;
    system1Score : any;

    system2Detail : any;
    system2Score : any;

    system3Detail : any;
    system3Score : any;

    system4Detail : any;
    system4Score : any;

    system5Detail : any;
    system5Score : any;

    system6Detail : any;
    system6Score : any;

    abNormal1Detail : any;
    abNormal1Score : any;

    abNormal2Detail : any;
    abNormal2Score : any;

    abNormal3Detail : any;
    abNormal3Score : any;

    abNormal4Detail : any;
    abNormal4Score : any;

    abNormal5Detail : any;
    abNormal5Score : any;

    abNormal6Detail : any;
    abNormal6Score : any;

    /**************************
        SECTION F
        Total 13 Fields
    **************************/
    knoScore : any;
    proScore : any;
    fpmScore : any;
    fpaScore : any;
    comScore : any;
    wlmScore : any;
    psdScore : any;
    ltwScore : any;
    sawScore : any;

    iec1Score : any;
    iec2Score : any;
    iec3Score : any;
    iec4Score : any;
    iec5Score : any;

    /**************************
        SECTION G
        deScores : string[];
        pcScores : string[];
        iecScores : string[];
        noteDetails : string[];
        Total 4 Fields
    **************************/
    
    deScores : any;
    pcScores : any;
    iecScores : any;
    noteDetails : any;
    
    /**************************
        SECTION H
        Total 17 Fields
    **************************/
    cmdRecommended : any;
    gtiRecommended : any;
    triRecommended : any;
    treRecommended : any;
    othersRecommended : any;
    othersRecommendedDetail : any;

    signatureRecommended : any;

    trainingCompleted : any;
    objectMet : any;
    clearCheck : any;
    overAllScore : any;
    
    attemptNumber : any;
    
    name3 : any;
    license3No : any;
    signatureInstructor : any;
    signatureInstructorDate : any;

    signatureTrainee : any;

    /**************************
        SECTION I
        Total 10 Fields
    **************************/
    formCompleted : any;
    copyCAAT : any;

    validityDate : any;
    cmsUpdate : any;

    signatureStaff1 : any;
    signatureStaff1Date : any;

    signatureStaff2 : any;
    signatureStaff2Date : any;

    signatureStaff3 : any;
    signatureStaff3Date : any;
}