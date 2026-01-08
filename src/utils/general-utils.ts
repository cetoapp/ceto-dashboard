/**
 * Creates a greeting message based on time period
 */
export const getGreeting = (name: string) => {
  const hour = new Date().getHours();
  let greeting = "Good Evening";
  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";

  return `${greeting}, ${name}`;
};