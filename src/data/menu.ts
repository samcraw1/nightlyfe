import { content } from "@/config/venue";
import type { MenuItem } from "@/types";

export const menuCategories = content.menuCategories;
export const menuItems = content.menuItems;

export function getMenuItem(id: string): MenuItem | undefined {
  return menuItems.find((m) => m.id === id);
}
