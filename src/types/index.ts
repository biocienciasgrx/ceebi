export * from "./event";
export * from "./mecenas";
export * from "./notifications";
export interface ButtonSettings {
  id?: string;
  text: string;
  link: string;
  color?: Color;
  icon?: string;
  iconColor?: Color;
}

type Color =
  | "primary"
  | "secondary"
  | "tertiary"
  | "success"
  | "warning"
  | "danger"
  | "light"
  | "medium"
  | "dark";
