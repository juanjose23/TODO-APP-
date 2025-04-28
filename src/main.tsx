import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Todo } from './Todo';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { store } from '@/lib/store/store';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Provider store={store}>
    <Todo />
    </Provider>

    </BrowserRouter>
  </StrictMode>,
)
