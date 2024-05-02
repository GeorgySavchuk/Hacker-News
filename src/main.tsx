import { createRoot } from 'react-dom/client';
import App from './app'
import './app/global.module.css'
import bridge from '@vkontakte/vk-bridge'

bridge.send('VKWebAppInit')

createRoot(document.getElementById('root')!).render(<App/>);
