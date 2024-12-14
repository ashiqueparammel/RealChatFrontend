import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  publicDir: 'public', // Ensure the 'public' directory is properly mapped
  server: {
    cors: true, // Enable CORS in case Firebase or your backend requires it
    host: true, // Allow access from local network for debugging
    port: 5173, // Specify your desired port
  },
});
