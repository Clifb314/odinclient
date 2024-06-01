import './App.css';
import {Outlet} from 'react-router-dom'
import React, { createContext, useEffect, useState } from 'react';
import Header from './components/header';
import { checkUser, login, logout } from './utils/auth';
import { AuthProvider } from './utils/useAuth';
import { NotiProvider } from './utils/useToast';


function App() {

  const [user, setUser] = useState({_id: null})
  const [notis, setNotis] = useState([])


  useEffect(() => {
    const myUser = checkUser()
    setUser(myUser)

    return () => handleLogout()
  },[])

  function handleLogout() {
    logout()
    setNotis([])
    setUser({_id: null})
  }


  return (
    <div className="app">
      <AuthProvider user={user} setUser={setUser}>
        <NotiProvider notis={notis} setNotis={setNotis}>
          <Header />
          <div className='components'>
            <Outlet />
          </div>
        </NotiProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
