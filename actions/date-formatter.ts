
import { differenceInDays } from "date-fns";

export function formatDaysLeft(expireDate: string | Date): string {
    const now = new Date();
    const endDate = new Date(expireDate);
    const diff = differenceInDays(endDate, now);
  
    if (diff > 0) {
      return `${diff} day${diff > 1 ? "s" : ""} left`;
    } else if (diff === 0) {
      return "Expires today";
    } else {
      return "Expired";
    }
  }

  export function formatStartDate(startDate: string | Date): string {
    const now = new Date();
    const start = new Date(startDate);
    const diff = differenceInDays(start, now);
  
    if (diff > 0) {
      return `Starts in ${diff} day${diff > 1 ? "s" : ""}`;
    } else if (diff === 0) {
      return "Starts today";
    } else {
      return `Started ${Math.abs(diff)} day${Math.abs(diff) > 1 ? "s" : ""} ago`;
    }
  }