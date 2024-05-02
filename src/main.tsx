import { createRoot } from 'react-dom/client';
import App from './app'
import './app/global.module.css'
import vkBridge from '@vkontakte/vk-bridge';

vkBridge.send('VKWebAppInit')

createRoot(document.getElementById('root')!).render(<App/>);
