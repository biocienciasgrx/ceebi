export type MecenasLevel =
  | "bronce"
  | "colaborador"
  | "plata"
  | "oro"
  | "platino";
export interface Mecenas {
  colaborador: Mecena[];
  bronce: Mecena[];
  plata: Mecena[];
  oro: Mecena[];
  platino: Mecena[];
}
export interface Mecena {
  nombre: string;
  img: string;
  web: string;
  // finalImg: string;
}
