declare module "bwip-js" {
  export type ToCanvasOptions = {
    bcid: string;
    text: string;
    scale?: number;
    height?: number;
    includetext?: boolean;
    textxalign?: string;
  };

  const bwipjs: {
    toCanvas(canvas: HTMLCanvasElement, options: ToCanvasOptions): void;
  };

  export default bwipjs;
}
