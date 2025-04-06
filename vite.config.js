import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Base public path when served in development
  base: './',
  
  // Configure the build
  build: {
    // Output directory (relative to project root)
    outDir: 'dist/build',
    
    // Do not minify the code for better debugging
    minify: false,
    
    // Configure rollup options
    rollupOptions: {
      input: {
        // Define entry points for different parts of the extension
        popup: resolve(__dirname, 'src/popup/popup.html'),
        options: resolve(__dirname, 'src/options/options.html'),
        background: resolve(__dirname, 'src/background/background.js'),
        content: resolve(__dirname, 'src/content/content.js'),
      },
    },
  },
  
  // Configure the dev server
  server: {
    port: 3000,
    open: '/src/options/options.html', // Open options page by default
  },
});
