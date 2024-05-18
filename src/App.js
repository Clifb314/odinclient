import './App.css';
import {Outlet} from 'react-router-dom'
import React, { createContext, useEffect, useState } from 'react';
import Header from './components/header';
import { checkUser, login, logout } from './utils/auth';
import { AuthProvider } from './utils/useAuth';


function App() {

  const [user, setUser] = useState({_id: null})


  useEffect(() => {
    const myUser = checkUser()
    setUser(myUser)

    return () => setUser({_id: null})
  },[])

  function handleLogout() {
    logout()
    setUser({_id: null})
  }


  return (
    <div className="app">
    <AuthProvider user={user} setUser={setUser}>
      <Header />
      <div className='components'>
        <Outlet />
      </div>
      </AuthProvider>


    </div>
  );
}

export default App;
