import LayoutWrapper from './layouts';
import QueryClientProvider from './providers/QueryClientProvider';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import 'antd/dist/antd.variable.css';
import IntlProvider from './locales';
import jaJP from 'antd/lib/locale/ja_JP';
import './style.less';
import './libs/polyfill';

ReactDOM.render(
  <React.StrictMode>
    <div style={{ height: '100vh' }}>
      <QueryClientProvider>
        <BrowserRouter>
          <IntlProvider>
            <ConfigProvider locale={jaJP}>
              <LayoutWrapper />
            </ConfigProvider>
          </IntlProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  </React.StrictMode>,
  document.getElementById('root'),
);
