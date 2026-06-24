/* eslint-disable */
declare module '@react-three/fiber' {
  import * as React from 'react';
  import { Clock } from 'three';

  interface FrameState {
    clock: Clock;
    // Add other properties of the state object if known
  }

  export const Canvas: any;
  export function useFrame(cb: (state: FrameState, delta: number) => void): void;
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