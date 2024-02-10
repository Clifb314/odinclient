import './App.css';
import React, { useState } from 'react';
import PopupForm from './components/popupForm';
import InboxView from './components/inboxView';

function App() {

  const [openForm, setOpenForm] = useState(false)
  const replyTemplate = {
    type: '',
    replying: null,
    postid: null,
    editing: null
  }
  const [formProps, setFormProps] = useState(replyTemplate)
  const [openMsg, setOpenMsg] = useState(null)


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


    {formBtn}
    </div>
  );
}

export default App;
