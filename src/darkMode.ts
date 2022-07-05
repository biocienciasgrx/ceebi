import { ref } from "vue";

export const isDarkMode = ref(false);

export const getDarkMode = () => isDarkMode.value;

export const setDarkMode = (val: boolean) => (isDarkMode.value = val);
