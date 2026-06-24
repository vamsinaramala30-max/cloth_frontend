declare module 'tailwind-merge' {
  type ClassValue =
    | string
    | number
    | boolean
    | null
    | undefined
    | ClassValue[]
    | { [key: string]: boolean | undefined };

  export function twMerge(...args: ClassValue[]): string;
}