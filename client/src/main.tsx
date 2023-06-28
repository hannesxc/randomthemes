import ReactDOM from 'react-dom/client';
import App from './App.tsx';
if (import.meta.env.MODE === 'development') {
  // @ts-ignore
  import('../assets/session/index.js');
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <App />
);
