import type { TFunction } from "i18next";

export const getGreeting = (name: string, t: TFunction) => {
  const hour = new Date().getHours();
  let greeting = t("home.greeting_evening");
  if (hour < 12) greeting = t("home.greeting_morning");
  else if (hour < 18) greeting = t("home.greeting_evening");

  return `${greeting}, ${name}`;
};
