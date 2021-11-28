import { get, set } from "idb-keyval";
import { writable, Writable } from "svelte/store";

const IDB_FONT_WEIGHT = "font-weight";
export const fontWeight: Writable<number> = writable(100);

export async function fontWeightInit(): Promise<void> {
  const weight = (await get(IDB_FONT_WEIGHT)) as number;

  if (!weight) return;
  // TODO throttle save to IndexedDB
  fontWeight.set(weight);
}

if ((process as any).browser) {
  get(IDB_FONT_WEIGHT).then((weight: number | undefined) => {
    if (weight) fontWeight.set(weight);
    fontWeight.subscribe((weight: number) => {
      if (!(process as any).browser) return;

      const content = document.body as HTMLElement;
      if (!content) return;

      content.style.setProperty("--readPageFontWeight", (weight / 100).toString());

      // TODO debounce font weight save
      set(IDB_FONT_WEIGHT, weight);
    });
  });
}
