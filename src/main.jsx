import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/animation.css';
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {
    console.log("🔄 Có bản mới, đang cập nhật...");
    updateSW(true); // ✅ Gọi để skipWaiting và reload
  },
  onOfflineReady() {
    console.log("✅ Đã sẵn sàng để dùng offline!");
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
