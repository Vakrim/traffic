export interface Actor {
  update?(dt: number): void;
  render: (ctx: CanvasRenderingContext2D) => void;
}
