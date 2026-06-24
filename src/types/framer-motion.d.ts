/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'framer-motion' {
  export const motion: any;
  export const AnimatePresence: any;
  export function useMotionValue(initial?: number | any): any;
  export function useTransform(source: any, input: any, output: any): any;
  export function useSpring(value: any, opts?: any): any;
}

