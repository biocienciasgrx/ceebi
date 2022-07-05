import { ToastButton, toastController } from "@ionic/vue";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

const _toast = async (
  message: string,
  icon?: string,
  color?: string,
  duration = 2000,
  buttons?: ToastButton[]
) =>
  await toastController.create({
    message,
    icon,
    color,
    duration,
    buttons,
    cssClass: "toast",
  });

export const toast = async (
  msg: string,
  icon?: string,
  color?: string,
  duration = 2000,
  buttons?: ToastButton[]
) => {
  await (await _toast(msg, icon, color, duration, buttons)).present();
  Haptics.impact({
    style: ImpactStyle.Light,
  });
};

export function toggleDarkMode(shouldAdd: boolean) {
  document.body.classList.toggle("dark", shouldAdd);
}
