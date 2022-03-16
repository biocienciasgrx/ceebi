import { toastController } from "@ionic/vue";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

export const _toast = async (
  message: string,
  icon?: string,
  color?: string,
  duration = 2000
) =>
  await toastController.create({
    message,
    icon,
    color,
    duration,
  });

export const toast = async (
  msg: string,
  icon?: string,
  color?: string,
  duration = 2000
) => {
  await (await _toast(msg, icon, color, duration)).present();
  Haptics.impact({
    style: ImpactStyle.Light,
  });
};
