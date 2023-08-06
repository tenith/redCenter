export interface FlightDetail {
  fltNO: string;
  registration: string;
  from: string;
  to: string;
  std: string;
  sta: string;
  blk: string;
  offChk: string;
  takeOff: string;
  landing: string;
  onChk: string;
  actBlk: string;
  PFId: string;
  uplift: string;
  burn: string;
  departureDelayTime1: string;
  departureDelayCode1: string;
  departureDelayTime2: string;
  departureDelayCode2: string;
  departureDelayTime3: string;
  departureDelayCode3: string;

  arrivalDelayTime1: string;
  arrivalDelayCode1: string;
  // fuelDetail: FuelDetail;
  // departureDelay: DelayDetail[];
  // arrivalDelay: DelayDetail[];
}
