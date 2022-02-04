export interface Event {
  name: string;
  shortDescription?: string;
  longDescription?: string;
  presenter?: string;
  location?: string;
  startTime: Date;
  endTime?: Date;
  type?: EventType;
}

export enum EventType {
  Opening,
  Closing,
  Conferencia,
  Microcharla,
  Taller,
  Microcurso,
  ConcursoPosters,
  ForoEmpresas,
  Break,
  ComidaEventual,
  RepartoCertificados,
  Social,
}
