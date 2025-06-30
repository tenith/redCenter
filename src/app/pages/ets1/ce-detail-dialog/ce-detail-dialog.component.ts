import { Component, Input, OnInit } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "ngx-ce-detail-dialog",
  templateUrl: "./ce-detail-dialog.component.html",
  styleUrls: ["./ce-detail-dialog.component.scss"],
})
export class CeDetailDialogComponent implements OnInit {
  @Input() data: any;
  eventData = {
    eventPhase: "",
    eventName: "",
    flightPhase: "",
    detail: "",
    tags: [] as { text: string; status: string }[],
  };

  eventPhases = [
    { value: "CES", description: "CES" },
    { value: "CEF 1", description: "CEF YEAR 1" },
    { value: "CEF 2", description: "CEF YEAR 2" },
    { value: "CEF 3", description: "CEF YEAR 3" },
    { value: "CEF 4", description: "CEF YEAR 4" },
  ];

  // eventPhases = [
  //   { value: "CES 1", description: "CES" },
  //   { value: "CES 2", description: "CES" },
  //   { value: "CES 3", description: "CES" },
  //   { value: "CES 4", description: "CES" },
  //   { value: "CEF 1", description: "CEF YEAR 1" },
  //   { value: "CEF 2", description: "CEF YEAR 2" },
  //   { value: "CEF 3", description: "CEF YEAR 3" },
  //   { value: "CEF 4", description: "CEF YEAR 4" },
  // ];

  flightPhases = [
    { value: "Preflight", description: "Before engine start" },
    { value: "Taxi", description: "Ground movement to runway" },
    { value: "Takeoff", description: "Runway to initial climb" },

    { value: "Climb&Cruise", description: "Initial climb to cruise" },
    { value: "Descent", description: "Descent to airport" },
    { value: "Approach", description: "Final approach to landing" },

    { value: "Go-Around", description: "Aborted landing" },
    { value: "Landing", description: "Touchdown to taxi" },
    { value: "Taxi to Gate", description: "Runway to parking" },

    { value: "Parkgin&Shutdown", description: "Parking and shutdown" },
    { value: "Flight management", description: "Flight management" },
    { value: "Special operations", description: "Special operations" },
  ];

  predefinedTags = {
    danger: [
      { text: "Unstable approach", status: "danger" },
      { text: "Checklist missed", status: "danger" },
      { text: "Altitude deviation", status: "danger" },
      { text: "Runway incursion", status: "danger" },
      { text: "Failure to comply with ATC", status: "danger" },
      { text: "Loss of situational awareness", status: "danger" },
      { text: "Inappropriate automation use", status: "danger" },
      { text: "Poor CRM", status: "danger" },
      { text: "Unsafe landing configuration", status: "danger" },
      { text: "Ignoring SOPs", status: "danger" },
      { text: "Incorrect ECAM handling", status: "danger" },
      { text: "Failure to monitor instruments", status: "danger" },
      { text: "Improper emergency procedure execution", status: "danger" },
      { text: "Disregarding instructor guidance", status: "danger" },
      { text: "Incorrect thrust management", status: "danger" },
      // Additional danger behaviors
      { text: "Disengages from team communication", status: "danger" },
      { text: "Fails to take control when necessary", status: "danger" },
      { text: "Mismanages high workload situations", status: "danger" },
      { text: "Demonstrates tunnel vision", status: "danger" },
      {
        text: "Fails to recognize deteriorating flight path",
        status: "danger",
      },
      {
        text: "Continues approach below minimums without visual",
        status: "danger",
      },
      { text: "Skips required checklists under pressure", status: "danger" },
      {
        text: "Initiates takeoff/landing with unresolved failures",
        status: "danger",
      },
      { text: "Inappropriate assertiveness or command tone", status: "danger" },
      {
        text: "Fails to call out or act on safety-critical deviation",
        status: "danger",
      },
    ],
    warning: [
      { text: "Late callout", status: "warning" },
      { text: "Delayed flap extension", status: "warning" },
      { text: "Speed trend exceedance", status: "warning" },
      { text: "Poor handoff coordination", status: "warning" },
      { text: "Incomplete briefing", status: "warning" },
      { text: "Reactive decision making", status: "warning" },
      { text: "Over-controlling during manual flight", status: "warning" },
      { text: "Incorrect radio phraseology", status: "warning" },
      { text: "Improper checklist flow", status: "warning" },
      { text: "Briefing not interactive", status: "warning" },
      { text: "Delayed response to ECAM alerts", status: "warning" },
      { text: "Inconsistent cross-checking", status: "warning" },
      { text: "Poor task prioritization", status: "warning" },
      { text: "Hesitant automation management", status: "warning" },
      { text: "Missed procedural step", status: "warning" },
      // Additional warning behaviors
      { text: "Over-reliance on automation", status: "warning" },
      { text: "Lack of assertiveness", status: "warning" },
      { text: "Delayed response in critical moments", status: "warning" },
      { text: "Incomplete threat and error management", status: "warning" },
      { text: "Failure to maintain effective lookout", status: "warning" },
      { text: "Misinterpretation of ATC instructions", status: "warning" },
      { text: "Inadequate monitoring of other pilot", status: "warning" },
      { text: "Limited contingency planning", status: "warning" },
      { text: "Hesitation during abnormal procedures", status: "warning" },
      { text: "Weak coordination during high workload", status: "warning" },
    ],
    success: [
      { text: "Excellent situational awareness", status: "success" },
      { text: "Effective CRM", status: "success" },
      { text: "Clear and timely communication", status: "success" },
      { text: "Proactive decision making", status: "success" },
      { text: "Smooth manual handling", status: "success" },
      { text: "Thorough briefing", status: "success" },
      { text: "Excellent workload management", status: "success" },
      { text: "Correct use of automation", status: "success" },
      { text: "Well-managed go-around", status: "success" },
      { text: "Good leadership under pressure", status: "success" },
      { text: "Precise ECAM procedure execution", status: "success" },
      { text: "Strong instrument monitoring", status: "success" },
      { text: "Confident emergency handling", status: "success" },
      { text: "Effective instructor feedback integration", status: "success" },
      { text: "Accurate thrust management", status: "success" },
      // Additional success behaviors
      { text: "Maintains calm under pressure", status: "success" },
      { text: "Adheres strictly to SOPs", status: "success" },
      {
        text: "Demonstrates leadership in abnormal situations",
        status: "success",
      },
      {
        text: "Displays initiative during unexpected events",
        status: "success",
      },
      { text: "Excellent aircraft energy management", status: "success" },
      { text: "Proficient multi-tasking", status: "success" },
      { text: "Assertive yet cooperative communication", status: "success" },
      { text: "Accurate weather assessment and planning", status: "success" },
      {
        text: "Good anticipation of traffic and ATC actions",
        status: "success",
      },
      {
        text: "Consistently applies threat and error management (TEM)",
        status: "success",
      },
    ],
  };

  filteredEvents: Observable<{ name: string }[]> = of([]);
  private events: { name: string; flightPhase: string }[] = [
    {
      flightPhase: "",
      name: "CEF 1 - FUEL, Describe the key components of our airline's fuel policy. How does it ensure safety and operational efficiency?",
    },
    {
      flightPhase: "",
      name: "CEF 1 - FUEL, Describe the process for selecting an alternate airport during flight planning. What factors are considered?",
    },
    {
      flightPhase: "",
      name: "CEF 1 - FUEL, How would you apply fuel policy when planning a flight with significant weather or air traffic delays at the destination?",
    },
    {
      flightPhase: "",
      name: "CEF 2 - FUEL, Explain how you would formulate a decision on whether to proceed to the alternate airport or hold, considering conflicting reports of improving weather at the destination.",
    },
    {
      flightPhase: "",
      name: "CEF 2 - FUEL, With deteriorating weather at destination, how would you analyze the impact on fuel consumption and alternate planning, and what decisions would you formulate in terms of holding fuel, approach strategy, or diversion?",
    },
    {
      flightPhase: "",
      name: "CEF 2 - FUEL, Formulate a fuel management strategy for a flight where an unexpected delay on the ground reduces the available fuel reserve. How would you ensure compliance with regulations and operational safety?",
    },
    {
      flightPhase: "",
      name: "CEF 2 - FUEL, If we find ourselves in a low-fuel situation and need to declare a fuel emergency, how would you analyze the factors involved and formulate a decision on whether to proceed to the destination or divert?",
    },
    {
      flightPhase: "",
      name: "CEF 3 - FUEL, Given a scenario with limited fuel remaining and an unexpected diversion, justify your choice of alternate airport based on fuel requirements.",
    },
    {
      flightPhase: "",
      name: "CEF 3 - FUEL, In a situation where the aircraft is overweight for landing, how would you justify a decision to burn fuel versus conducting an overweight landing?",
    },
    {
      flightPhase: "",
      name: "CEF 3 - FUEL, If fuel consumption during flight significantly exceeds planned usage, justify the actions you would take to manage remaining fuel effectively.",
    },
    {
      flightPhase: "",
      name: "CEF 3 - FUEL, How can you justify a decision to carry additional fuel beyond the regulatory minimum?",
    },
    {
      flightPhase: "",
      name: "CEF 4 - FUEL, Evaluate the effectiveness of the current airline fuel policy in ensuring safety and efficiency during various flight phases. How does this policy balance operational needs with fuel conservation?",
    },
    {
      flightPhase: "",
      name: "CEF 4 - FUEL, Evaluate how the airline’s fuel policy aligns with regulatory requirements and industry best practices. Are there any areas where the policy might be improved?",
    },
    {
      flightPhase: "",
      name: "CEF 4 - FUEL, Evaluate the role of contingency fuel within the policy. How effective is the contingency fuel provision in managing unforeseen circumstances during flight?",
    },
    {
      flightPhase: "",
      name: "CEF 4 - FUEL, Evaluate the influence of fuel tankering on cost efficiency and environmental impact under the airline fuel policy. How would you assess its appropriateness in various operational contexts?",
    },

    {
      flightPhase: "",
      name: "CEF 1 - MEL, Describe the purpose and scope of the Minimum Equipment List (MEL) in airline operations?",
    },
    {
      flightPhase: "",
      name: "CEF 1 - MEL, How would you describe the structure and components of an MEL?",
    },
    {
      flightPhase: "",
      name: "CEF 1 - MEL, How would you apply the guidelines and procedures outlined in the MEL during pre-flight planning and preparation?",
    },
    {
      flightPhase: "",
      name: "CEF 2 - MEL, How would you formulate a plan if an MEL item limits certain equipment functions, impacting your options for diversion or approach at the destination airport?",
    },
    {
      flightPhase: "",
      name: "CEF 2 - MEL, If a last-minute MEL item affects a piece of equipment required for flight, how would you balance the need for an on-time departure with the operational safety considerations?",
    },
    {
      flightPhase: "",
      name: "CEF 2 - MEL, How would you formulate an adaptive strategy for addressing MEL items that arise unexpectedly during flight, ensuring minimal disruption to planned operations?",
    },
    {
      flightPhase: "",
      name: "CEF 3 - MEL, An MEL item requires additional performance considerations during takeoff. Justify your decision to accept or reject the runway and departure plan based on MEL and operational requirements.",
    },
    {
      flightPhase: "",
      name: "CEF 3 - MEL, Justify the decision to dispatch an aircraft with an MEL deferred anti-ice system on a flight with potential icing conditions. How would you mitigate associated risks?",
    },
    {
      flightPhase: "",
      name: "CEF 3 - MEL, You are preparing to depart, and maintenance informs you of an inoperative system that is not listed in the aircraft's MEL. Justify how you would address this situation before departure.",
    },
    {
      flightPhase: "",
      name: "CEF 4 - MEL, How would you evaluate the risks associated with operating a flight with an MEL item, and what additional actions would you take to mitigate these risks?",
    },
    {
      flightPhase: "",
      name: "CEF 4 - MEL, Imagine a situation where an MEL item becomes operationally challenging due to unforeseen conditions. How would you evaluate your decision to continue with the current MEL or consider alternative solutions?",
    },
    {
      flightPhase: "",
      name: "CEF 4 - MEL, How would you evaluate the potential long-term effects of repeatedly operating with certain MEL items on aircraft performance and maintenance? How could this affect future decision-making?",
    },

    {
      flightPhase: "",
      name: "CEF 1 - QRH, Describe the components of the QRH",
    },
    {
      flightPhase: "",
      name: "CEF 1 - QRH, Describe the purpose of the QRH system reset.",
    },
    {
      flightPhase: "",
      name: "CEF 1 - QRH, Describe the conditions under which a system reset is required.",
    },
    {
      flightPhase: "",
      name: "CEF 1 - QRH, Describe the indications and symptoms that would prompt you to consult the QRH",
    },
    {
      flightPhase: "",
      name: "CEF 2 - QRH, Given a scenario where a specific system (e.g., L/G, FMGEC) malfunctions, how would you perform the system reset using the QRH?",
    },
    {
      flightPhase: "",
      name: "CEF 2 - QRH, What would be your next steps if performing the QRH system reset does not restore system functionality?",
    },
    {
      flightPhase: "",
      name: "CEF 2 - QRH, Formulate a response plan based on the QRH in the event of smoke detection in the avionics compartment. How would you use the QRH to manage the situation and minimize the risk to systems?",
    },
    {
      flightPhase: "",
      name: "CEF 2 - QRH, Formulate a decision-making process using the QRH for a dual hydraulic system failure. What key steps would you take, and how would you prioritize actions to maintain control of the aircraft?",
    },
    {
      flightPhase: "",
      name: "CEF 3 - TEM, Justify the integration of TEM principles into everyday flight operations to enhance overall safety and efficiency.",
    },
    {
      flightPhase: "",
      name: "CEF 3 - TEM, Justify the linkage between threats, errors, and undesired aircraft states in the TEM framework.",
    },
    {
      flightPhase: "",
      name: "CEF 3 - TEM, Justify the importance of balancing adherence to procedures with the need for flexibility during abnormal or emergency situations.",
    },
    {
      flightPhase: "",
      name: "CEF 3 - TEM, Justify the approach to balancing economic considerations with operational safety when faced with fuel-saving opportunities.",
    },
    {
      flightPhase: "",
      name: "CEF 4 - TEM, Evaluate the effectiveness of the current threat identification process in your flight operations. What improvements can be made to enhance the accuracy and timeliness of threat detection?",
    },
    {
      flightPhase: "",
      name: "CEF 4 - TEM, Evaluate the effectiveness of the current error management strategies in your flight operations. What alternative strategies could be implemented to reduce the occurrence of errors?",
    },
    {
      flightPhase: "",
      name: "CEF 4 - TEM, Evaluate the effectiveness of the current decision-making process used during abnormal or emergency situations in your flight operations. How could this process be improved to enhance crew coordination and outcome predictability?",
    },
    {
      flightPhase: "",
      name: "CEF 4 - TEM, Evaluate how well the automation is integrated into operational decision-making. What steps could be taken to ensure automation is used as a tool rather than an over-reliance?",
    },

    { flightPhase: "", name: "CEF 1 - FTL, Describe the LPC validity" },
    {
      flightPhase: "",
      name: "CEF 1 - FTL, Based on your license, when would be the earliest you can perform your LPC based on your expiry date?",
    },
    {
      flightPhase: "",
      name: "CEF 1 - FTL, Based on your license, what happens if you perform your LPC pass your expiry date?",
    },

    {
      flightPhase: "",
      name: "CEF 1 - LICENSE, Describe FDP limitation, acclimatized and non-acclimatized",
    },
    {
      flightPhase: "",
      name: "CEF 1 - LICENSE, Describe Limits on two flight crew long range operations requirements",
    },
    {
      flightPhase: "",
      name: "CEF 1 - LICENSE, Describe limitations and application of extension MAX FDP",
    },

    {
      flightPhase: "",
      name: "CEF 2 - LIDO, Analyze the implications of continuing your flight at the last assigned altitude versus proceeding according to your filed flight plan. What factors must be considered?",
    },
    {
      flightPhase: "",
      name: "CEF 2 - LIDO, Develop a contingency plan for a situation where you observe “GPS PRIMARY LOST” and “NAV ACCURACY LOW” while flying in oceanic airspace.",
    },
    {
      flightPhase: "",
      name: "CEF 2 - LIDO, Given a deteriorating weather condition at an airport with NALS, formulate a decision to continue or discontinue the approach based on operational constraints and safety considerations.",
    },
    { flightPhase: "TAXI", name: "EOTD - ENG 2 FIRE" },
    { flightPhase: "TAXI", name: "TCAS INOP" },
    { flightPhase: "TAXI", name: "PACK 1/2 INOP" },
    { flightPhase: "TAXI", name: "EOTD - ENG 2 STALL/FIRE" },
    { flightPhase: "TAXI", name: "WEATHER RADAR INOP" },
    { flightPhase: "TAXI", name: "EOTD - ENG 2 START FAULT" },
    { flightPhase: "TAXI", name: "APU AUTO SHUTDOWN" },

    { flightPhase: "Takeoff", name: "WINDSHEAR" },
    { flightPhase: "Takeoff", name: "PILOT INCAPACITATION" },
    { flightPhase: "Takeoff", name: "THR LVR 2 FAULT" },
    { flightPhase: "Takeoff", name: "LDG GEAR NOT UPLOCKED" },
    { flightPhase: "Takeoff", name: "ENG 1/2 FAIL" },
    { flightPhase: "Takeoff", name: "WINDSHEAR AHEAD" },
    { flightPhase: "Takeoff", name: "LAVOTARY SMOKE" },
    { flightPhase: "Takeoff", name: "T/O CONFIG WARNING" },

    { flightPhase: "Climb&Cruise", name: "TCAS" },
    { flightPhase: "Climb&Cruise", name: "UNRELIABLE AIRSPEED" },
    { flightPhase: "Climb&Cruise", name: "THR LVR 2 FAULT" },
    { flightPhase: "Climb&Cruise", name: "VHF EMITTING" },
    { flightPhase: "Climb&Cruise", name: "FLT CTRL STABILIZER JAM" },
    { flightPhase: "Climb&Cruise", name: "Y ENG2 PUMP LO PR PTU INOP" },
    { flightPhase: "Climb&Cruise", name: "ELEC EMER CONFIG" },
    { flightPhase: "Climb&Cruise", name: "ENG 2 HIGH VIBRATION" },
    { flightPhase: "Climb&Cruise", name: "CABIN OVER PRESSURE" },
    { flightPhase: "Climb&Cruise", name: "MULTIPLE UNDUE ECAM ALERTS" },
    { flightPhase: "Climb&Cruise", name: "REV UNLOCKED" },
    { flightPhase: "Climb&Cruise", name: "CARGO DOOR OPEN" },
    { flightPhase: "Climb&Cruise", name: "NAV HDG DISCREPANCY" },
    { flightPhase: "Climb&Cruise", name: "FAC 1+2 FAULT" },

    { flightPhase: "Cruise", name: "EMERGENCY DESCENT" },
    { flightPhase: "Cruise", name: "ENG 1 E.I.U FAULT" },
    { flightPhase: "Cruise", name: "THR LVR 2 FAULT" },
    { flightPhase: "Cruise", name: "ADR 1/2/3 FAULT" },
    { flightPhase: "Cruise", name: "FM GPS POS DISAGREE" },
    { flightPhase: "Cruise", name: "FUEL LEAK" },
    { flightPhase: "Cruise", name: "ENG FAILURE IN CRUISE" },
    { flightPhase: "Cruise", name: "VHF 1 AND 2 FAULT" },
    { flightPhase: "Cruise", name: "FUEL IMBALANCE" },
    { flightPhase: "Cruise", name: "RUDDER JAM" },
    { flightPhase: "Cruise", name: "FLT CONTROL ELAC 1 AND 2 FAULT" },
    { flightPhase: "Cruise", name: "BLEED 1 AND 2 OVERHEAT" },
    { flightPhase: "Cruise", name: "HYD B + Y LO PRESS" },
    { flightPhase: "Cruise", name: "CABIN PRESS SAFETY VALVE OPEN" },
    { flightPhase: "Cruise", name: "STABILIZER JAM" },

    { flightPhase: "Descend", name: "EGPWS TERRAIN" },
    { flightPhase: "Descend", name: "BOMB ON BOARD" },
    { flightPhase: "Descend", name: "THR LVR 2 FAULT" },
    { flightPhase: "Descend", name: "PILOT INCAP" },
    { flightPhase: "Descend", name: "LOSS OF FMS DATA" },
    { flightPhase: "Descend", name: "ENG 1 FADEC FAULT" },
    { flightPhase: "Descend", name: "HYD G+Y SYS LO PRESS" },
    { flightPhase: "Descend", name: "DISPLAY UNIT FAILURE EWD" },
    { flightPhase: "Descend", name: "PILOT INCAP" },
    { flightPhase: "Descend", name: "DUAL ENG FAIL WITH FUEL REMAINING" },
    { flightPhase: "Descend", name: "BRAKES SYS 1(2) FAULT" },
    { flightPhase: "Descend", name: "HYD G+B SYS LO PRESS" },
    { flightPhase: "Descend", name: "WINDSHIELD 1 CRACKED" },
    { flightPhase: "Descend", name: "CABIN PRESS SYS 1+2 FAULT" },
    { flightPhase: "Descend", name: "RUDDER JAM" },

    { flightPhase: "Approach", name: "STRONG TAILWIND 25KTS" },
    { flightPhase: "Approach", name: "LDG GEAR NOT DOWNLOCKED" },
    { flightPhase: "Approach", name: "THR LVR 2 FAULT" },
    { flightPhase: "Approach", name: "GS INTERCEPT FROM ABOVE" },
    { flightPhase: "Approach", name: "SLAT FLAP JAMMED" },
    { flightPhase: "Approach", name: "LDG WITH ABNORMAL LDG GEAR" },
    { flightPhase: "Approach", name: "STRONG X-WIND 25KTS" },
    { flightPhase: "Approach", name: "ENG 2 FIRE AT 2000FT" },
    { flightPhase: "Approach", name: "L/R SIDESTICK FAULT" },
    { flightPhase: "Approach", name: "ILS 1+2 FAULT" },
    { flightPhase: "Approach", name: "LDG GEAR NOT DNLOCKED" },

    { flightPhase: "Landing", name: "LOSS OF BRAKING" },
    { flightPhase: "Landing", name: "N/WS FAULT ON LDG" },
    { flightPhase: "Landing", name: "LDG / NOSE GEAR COLLAPSED" },
    { flightPhase: "Landing", name: "EMER EVAC" },
    // { flightPhase: "", name: "Engine Failure" },
    // { flightPhase: "", name: "Engine Fire" },
    // { flightPhase: "", name: "Engine Stall" },
    // { flightPhase: "", name: "Dual Engine Failure" },
    // { flightPhase: "", name: "Hydraulic Green System Low Pressure" },
    // { flightPhase: "", name: "Hydraulic Yellow System Low Pressure" },
    // { flightPhase: "", name: "Hydraulic Blue System Low Pressure" },
    // { flightPhase: "", name: "Hydraulic G+Y System Low Pressure" },
    // { flightPhase: "", name: "Hydraulic G+B System Low Pressure" },
    // { flightPhase: "", name: "Electrical Emergency Configuration" },
    // { flightPhase: "", name: "Generator 1 Fault" },
    // { flightPhase: "", name: "Generator 2 Fault" },
    // { flightPhase: "", name: "Battery Only Operation" },
    // { flightPhase: "", name: "Cabin Depressurization" },
    // { flightPhase: "", name: "Rapid Depressurization" },
    // { flightPhase: "", name: "Smoke or Fumes in Cabin" },
    // { flightPhase: "", name: "Avionics Smoke" },
    // { flightPhase: "", name: "Bird Strike" },
    // { flightPhase: "", name: "Landing Gear Failure to Extend" },
    // { flightPhase: "", name: "Landing Gear Failure to Retract" },
    // { flightPhase: "", name: "Flaps/Slats Failure" },
    // { flightPhase: "", name: "Flight Control Law Reversion" },
    // { flightPhase: "", name: "Autopilot Failure" },
    // { flightPhase: "", name: "Navigation System Failure" },
    // { flightPhase: "", name: "Fuel Leak" },
    // { flightPhase: "", name: "Fuel Imbalance" },
    // { flightPhase: "", name: "Low Fuel Emergency" },
    // { flightPhase: "", name: "Rejected Takeoff" },
    // { flightPhase: "", name: "Emergency Evacuation" },
    // { flightPhase: "", name: "Wind Shear Encounter" },
    // { flightPhase: "", name: "TCAS Resolution Advisory" },
    // { flightPhase: "", name: "GPWS Alert" },
  ];

  constructor(protected dialogRef: NbDialogRef<CeDetailDialogComponent>) {}

  ngOnInit(): void {
    if (this.data != null) {
      this.eventData = {
        eventPhase: this.data.eventPhase || "",
        eventName: this.data.eventName || "",
        flightPhase: this.data.flightPhase || "",
        detail: this.data.detail || "",
        tags: Array.isArray(this.data.tags) ? [...this.data.tags] : [],
      };
    }
    this.filteredEvents = of(this.events);
  }

  onFlightPhaseChange(value: string): void {
    console.log("flight phase change: " + value);
    if (this.eventData.eventPhase.toLowerCase().startsWith("ces")) {
      this.filteredEvents = of(this.events).pipe(
        map((events) =>
          events.filter((event) =>
            event.flightPhase.toLowerCase().startsWith(value.toLowerCase())
          )
        )
      );
    }
  }

  onPhaseChange(value: string): void {
    if (value.toLowerCase().startsWith("cef")) {
      //Filter that start with CEF flight.....
      this.filteredEvents = of(this.events).pipe(
        map((events) =>
          events.filter((event) =>
            event.name.toLowerCase().startsWith(value.toLowerCase())
          )
        )
      );
    } else {
      this.onFlightPhaseChange(this.eventData.flightPhase);
      //Filter that
      // this.filteredEvents = of(this.events).pipe(
      //   map((events) =>
      //     events.filter(
      //       (event) => !event.name.toLowerCase().startsWith(value.toLowerCase())
      //     )
      //   )
      // );
    }
  }

  onEventNameChange(value: string): void {
    this.filteredEvents = of(this.events).pipe(
      map((events) =>
        events.filter((event) =>
          event.name.toLowerCase().includes(value.toLowerCase())
        )
      )
    );
  }

  selectEvent(event: any): void {
    this.eventData.eventName = event;
  }

  addTag(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();
    if (value && !this.eventData.tags.some((t) => t.text === value)) {
      this.eventData.tags.push({ text: value, status: "basic" });
      input.value = "";
    }
  }

  removeTag(tag: { text: string; status: string }): void {
    this.eventData.tags = this.eventData.tags.filter(
      (t) => t.text !== tag.text
    );
  }

  addPredefinedTag(tag: { text: string; status: string }): void {
    if (!this.eventData.tags.some((t) => t.text === tag.text)) {
      this.eventData.tags.push({ ...tag });
    }
  }

  submitForm(): void {
    if (this.eventData.eventName && this.eventData.flightPhase) {
      this.dialogRef.close(this.getEventDataAsText());
    }
  }

  // Convert eventData to human-readable text
  getEventDataAsText(): string {
    const tagsText =
      this.eventData.tags
        .map((tag) => `${tag.text} (${tag.status})`)
        .join(", ") || "None";
    return [
      `Event Phase: ${this.eventData.eventPhase || "Not specified"}; `,
      `Event Name: ${this.eventData.eventName || "Not specified"}; `,
      `Flight Phase: ${this.eventData.flightPhase || "Not specified"}; `,
      `Detail: ${this.eventData.detail || "Not specified"}; `,
      `Tags: ${tagsText}`,
    ].join("\n");
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
