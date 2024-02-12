import './App.css';
import {createBrowserRouter, RouterProvider, Link, Outlet} from 'react-router-dom'
import React, { useState } from 'react';
import Header from './components/header';

function App() {



  return (
    <div className="App">
    <Header />

    <div className='Components'>
      <Outlet />
    </div>

    </div>
  );
}

export default App;
