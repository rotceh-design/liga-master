import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Eliminamos o comentamos la propiedad 'base' 
  // porque Vercel despliega directamente en la raíz (/)
  // base: "/liga-master/", 
})