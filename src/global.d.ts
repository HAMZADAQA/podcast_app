declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// Define and extend the `globalThis` object
declare global {
  interface ImportMeta {
    env: {
      VITE_API_BASE_URL: string;
    };
  }

  // Augment globalThis for Jest and testing
  namespace NodeJS {
    interface Global {
      importMeta: ImportMeta;
    }
  }
}

declare module 'crypto-js' {
  const content: any;
  export default content;
}
