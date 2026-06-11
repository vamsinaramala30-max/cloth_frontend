declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_URL?: string;
    NEXT_PUBLIC_NODE_ENV?: 'development' | 'production' | 'test';
  }
}

export {};

declare var process: {
  env: {
    NEXT_PUBLIC_API_URL?: string;
    NEXT_PUBLIC_NODE_ENV?: 'development' | 'production' | 'test';
    [key: string]: string | undefined;
  };
};
