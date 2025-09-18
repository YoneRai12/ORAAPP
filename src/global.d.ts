export {};

declare global {
  interface Worker extends EventTarget {
    onmessage: ((this: Worker, ev: MessageEvent) => any) | null;
    onmessageerror: ((this: Worker, ev: MessageEvent) => any) | null;
    postMessage(message: any, transfer?: Transferable[]): void;
    terminate(): void;
  }

  var Worker: {
    prototype: Worker;
    new (stringUrl: string | URL, options?: WorkerOptions): Worker;
  };

  interface WorkerOptions {
    credentials?: RequestCredentials;
    name?: string;
    type?: 'classic' | 'module';
  }
}
