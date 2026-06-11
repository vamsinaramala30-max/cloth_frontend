declare module '@react-three/fiber' {
  import * as React from 'react';
  export const Canvas: any;
  export function useFrame(cb: any): void;
  export const OrbitControls: any;
  export const extend: any;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [key: string]: any;
    }
  }
}
