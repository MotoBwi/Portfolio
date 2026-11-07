import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' lets the built site work from any sub-path or a plain static host.
export default defineConfig({
  plugins: [react()],
  base: './',
});
