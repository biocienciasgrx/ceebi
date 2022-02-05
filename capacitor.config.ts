import { CapacitorConfig } from "@capacitor/cli";
import { SplashScreenPlugin } from "@capacitor/splash-screen";
import { PushNotificationsPlugin } from "@capacitor/push-notifications";

const config: CapacitorConfig = {
  appId: "es.biociencias.ceebi",
  appName: "CEEBI",
  webDir: "dist",
  bundledWebRuntime: false,
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_launcher_round",
      iconColor: "#34b6ed",
      // sound: "beep.wav",
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    SplashScreen: {
      launchAutoHide: false,
      androidScaleType: "FIT_CENTER",
      backgroundColor: "#ffffff",
      // splashFullscreen: true,
      // splashImmersive: false,
      androidSplashResourceName: "splash",
    },
  },
};

export default config;
