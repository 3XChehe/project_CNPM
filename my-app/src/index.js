import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Nhankhau from './components/Nhankhau/Nhankhau';
import Hokhau from './components/Hokhau/Hokhau';
import HomePage from './components/Home/HomePage';
import Phananh from './components/Phananh/Phananh';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} >
          <Route index element={<HomePage />} />
          <Route path='hokhau' element={<Hokhau />} />
          <Route path='nhankhau' element={<Nhankhau />} />
          <Route path='phananh' element={<Phananh />} />
        </Route>
      </Routes>

      {/* <App /> */}
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
