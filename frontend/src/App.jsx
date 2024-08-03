import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import ShowProduct from './pages/ShowProduct';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/prices/:sku' element={<ShowProduct />} />
    </Routes>
  );
}

export default App;