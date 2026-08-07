import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const removeEmojis = (text: string) => {
  return text.replace(/[\p{Extended_Pictographic}\p{Emoji_Presentation}]/gu, "");
};