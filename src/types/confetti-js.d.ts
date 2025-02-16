declare module 'confetti-js' {
  interface ConfettiSettings {
    target: string | HTMLCanvasElement;
    max?: number;
    size?: number;
    animate?: boolean;
    respawn?: boolean;
    width?: number;
    height?: number;
    clock?: number;
    start_from_edge?: boolean;
    rotate?: boolean;
    props?: string[];
    colors?: number[][];
  }

  class ConfettiGenerator {
    constructor(settings: ConfettiSettings);
    render(): void;
    clear(): void;
  }

  export default ConfettiGenerator;
}
