import { CodegenConfig } from '@graphql-codegen/cli';
import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.GRAPHQL_API_URL || 'http://localhost:4000/graphql',
  documents: './src/configs/graphql/operations/**/*.graphql',
  generates: {
    './src/configs/graphql/generated.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-graphql-request']
    }
  }
};

export default config;
