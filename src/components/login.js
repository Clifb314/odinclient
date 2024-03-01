import React, { useState } from "react";
import { login } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { useAuth, useAuthContext } from "../utils/useAuth";

export default function Login() {
  const template = {
    username: "",
    password: "",
  };
  const [creds, setCreds] = useState(template);
  const [errorMsg, setErrorMsg] = useState(null)

  const navi = useNavigate()
  //const {saveLogin, auth} = useAuth()
  const {updateUser} = useAuthContext()

  function handleChange(e) {
    const { name, value } = e.target;
    setCreds({
      ...creds,
      [name]: value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const fetchUser = await login({
      username: creds.username,
      password: creds.password,
    });
    if (!fetchUser.user || fetchUser.err)
      setErrorMsg(fetchUser); //error handling
    else {
      updateUser(fetchUser.user)
      //saveLogin(fetchUser.user)
      //context.setUser(fetchUser.user)
      //console.log(user)
      //console.log(auth)
      navi('/feed/recent'); //set user higher up
    }
  }

  return (
    <form id="loginForm" onSubmit={handleSubmit}>
      <label htmlFor="username">Username: </label>
      <input
        name="username"
        id="username"
        value={creds.username}
        onChange={handleChange}
      />
      <label htmlFor="password">Password: </label>
      <input
        name="password"
        type="password"
        id="password"
        value={creds.password}
        onChange={handleChange}
        autoComplete="new-password"
      />
      <button className="submit" type="submit" form="loginForm">Sign In</button>
      <p className="errorMsg">{errorMsg ? errorMsg : ''}</p>
    </form>
  );
}
