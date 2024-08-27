import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import ShowProduct from './pages/ShowProduct';
import QueryResult from './pages/QueryResult';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/prices/:sku' element={<ShowProduct />} />
      <Route path='/search' element={<QueryResult />} />
    </Routes>
  );
}

export default App;