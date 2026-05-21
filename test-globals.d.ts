declare function describe(name: string, fn: () => void): void;
declare function it(name: string, fn: () => void | Promise<void>): void;
declare function expect(actual: unknown): {
  toBeFalsy(): void;
  toBeTruthy(): void;
  toBeInTheDocument(): void;
  toHaveClass(className: string): void;
};
