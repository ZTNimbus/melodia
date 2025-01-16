import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);

  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatGreeting(date: string) {
  const time = +date.slice(0, 2);

  if (time >= 5 && time <= 12) return "Good Morning";
  if (time >= 12 && time <= 17) return "Good Afternoon";
  if (time >= 17 && time <= 20) return "Good Evening";
  if (time >= 20 && time <= 5) return "Good Night";
}

export { cn, formatDuration, formatTime, formatDate, formatGreeting };
