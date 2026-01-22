
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // 현재 작업 디렉토리에서 환경 변수를 로드합니다.
  // Vercel은 빌드 시점에 환경 변수를 자동으로 주입하지만, 
  // loadEnv를 사용하면 로컬 개발 환경(.env)과 빌드 환경을 모두 안전하게 처리할 수 있습니다.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      // process.env 전체를 덮어쓰지 않고, 필요한 API_KEY만 문자열로 치환하여 주입합니다.
      // 이렇게 해야 React의 process.env.NODE_ENV 체크(프로덕션 최적화)가 정상 작동합니다.
      'process.env.API_KEY': JSON.stringify(env.API_KEY || process.env.API_KEY),
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', '@google/genai'],
            utils: ['jspdf', 'html2canvas']
          }
        }
      }
    }
  };
});
