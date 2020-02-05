declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'staging' | 'production';
    HOST: string;
    PORT: number;
  }
}

declare module '*.R' {
  const content: any;
  export default content;
}
