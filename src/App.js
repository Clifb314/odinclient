import './App.css';
import * as ReactDom from 'react-dom/client'
import {createBrowserRouter, RouterProvider, Link, Outlet} from 'react-router-dom'
import React, { useState } from 'react';
import PopupForm from './components/popupForm';
import InboxView from './components/inboxView';
import Header from './components/header';

function App() {


  
  const [openMsg, setOpenMsg] = useState(null)
  const [openForm, setOpenForm] = useState(false)
  const replyTemplate = {
    type: '',
    replying: null,
    postid: null,
    editing: null
  }
  const [formProps, setFormProps] = useState(replyTemplate)


  function toggleForm() {
    if (openForm) {
      setFormProps(replyTemplate)
      setOpenForm(false)
    } else {
      setOpenForm(true)
    }
    return
  }

  //pass setOpenMsg to userpage and openMsg to inboxview

  //pass this to comment cards and feed, and userdetalil
  function populateReply(type, replying, postid, editing) {
    //replying should be _id || null
    setFormProps({type, replying, postid, editing})
    toggleForm()
  }

  const formBtn = openForm 
    ? <div>
      <button type='button' onClick={toggleForm}>X</button>
      <PopupForm type={formProps.type} replying={formProps.replying} toggleOpen={toggleForm} />
    </div>
    : <div className='floatingBtn' onClick={toggleForm}>!</div>




  return (
    <div className="App">
    <Header />

    <div className='Components'>
      <Outlet />
    </div>

    {formBtn}
    </div>
  );
}

export default App;
