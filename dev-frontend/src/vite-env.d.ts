/// <reference types="vite/client" />

declare global {
  interface Window {
    ym?: (counterId: number, action: string, goal?: string, options?: any) => void;
  }
}

export {};
