import { ChakraProvider, ColorModeScript, theme } from '@chakra-ui/react';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { App } from './App';
import * as serviceWorker from './serviceWorker';
import { ProviderWeb3Modal } from './providers/ProviderWeb3Modal';
import { ProviderChakraUi } from './providers/ProviderChakraUi';
import { RouterProvider } from 'react-router-dom';
import { NavigationRoutes } from './navigation/NavigationRoutes';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <ColorModeScript />
    <ProviderChakraUi>
      <ProviderWeb3Modal>
        <RouterProvider router={NavigationRoutes}></RouterProvider>
      </ProviderWeb3Modal>
    </ProviderChakraUi>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();
