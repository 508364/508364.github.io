declare global {
  interface Window {
    Live2DModel: {
      from(modelPath: string): Promise<any>;
    };
  }
}

export {};