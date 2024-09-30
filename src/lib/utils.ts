import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function chunkArray<T>(array: T[], size: number): T[][] {
  return array.reduce((result: T[][], item: T, index: number) => {
    const chunkIndex = Math.floor(index / size);

    if (!result[chunkIndex]) {
      result[chunkIndex] = [];
    }

    result[chunkIndex].push(item);
    return result;
  }, []);
}
