import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// We need to extend twMerge to add our custom class groups so that
// Tailwind merge knows how to merge them properly.
// The documentation isn't great, but the keys can be found here: https://github.com/dcastil/tailwind-merge/blob/v2.2.1/src/lib/default-config.ts
const twMerge = extendTailwindMerge({});

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
