export interface SubPC {
  number: number; //subpc code
  detail: string; //subpc description

  observed: string;
  totalEvents: number;
  observableEvents: number;
  note: string;

  instructorObserved: string;
  instructorTotalEvents: number;
  instructorObservableEvents: number;
}
