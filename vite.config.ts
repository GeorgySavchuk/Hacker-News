import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy';
// https://vitejs.dev/config/

function handleModuleDirectivesPlugin() {
  return {
    name: 'handle-module-directives-plugin',
    // @ts-ignore
    transform(code, id) {
      if (id.includes('@vkontakte/icons')) {
        code = code.replace(/"use-client";?/g, '');
      }
      return { code };
    },
  };
}
export default defineConfig({
  base: './',
  plugins: [
      react(),
      handleModuleDirectivesPlugin(),
      legacy({
        targets: ['defaults', 'not IE 11'],
      }),
  ],
  server: {
    port: 3000
  },
  resolve: {
    alias: [{ find: /^@vkontakte\/vkui$/, replacement: '@vkontakte/vkui/dist/cssm' }],
  },
  build: {
    outDir: 'build',
  },
})
