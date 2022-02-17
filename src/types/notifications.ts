import { ButtonSettings } from ".";

export interface RawNotification {
  id: string;
  body: string;
  title: string;
  schedule: {
    year?: number;
    month?: number;
    day?: number;
    hour?: number;
    minutes?: number;
    seconds?: number;
  };
  icon?: string;
  buttons?: ButtonSettings[];
}

export interface Notification extends RawNotification {
  type: NotificationType;
  id: string;
  date: Date;
  ionIcon: string;
}

export enum NotificationType {
  PUSH,
  EVENT,
}
