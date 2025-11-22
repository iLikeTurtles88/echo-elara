// Reference removed to resolve "Cannot find type definition file for 'vite/client'"
// /// <reference types="vite/client" />

interface ImportMetaEnv {
  // Add environment variables here if needed
  readonly [key: string]: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
