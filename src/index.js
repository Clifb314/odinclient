import React, { useState } from 'react';
import * as ReactDom from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import './index.css';



import App from './App';
import ErrorPage from './components/errorPage'
import {UserPage, Register, Feed, Inbox, Account, Login} from './utils/exporter'
import { checkUser } from './utils/auth';
//const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

const [toggle, setToggle] = useState(null)

//  router stuff
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    loader: checkUser(),
    children: [
      {
        index: true,
        element: null //a homepage
      },
      {
        path: 'users/:userid',
        element: <UserPage />
      },
      {
        path: '/register',
        element: <Register />
      },
      {
        path: '/feed/:sorting',
        element: <Feed />
      },
      {
        path: '/inbox/:id',
        element: <Inbox />
      },
      {
        path: '/account',
        element: <Account />
      },
      {
        path: '/login',
        element: <Login />
      }
    ]
  },
])

ReactDom.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
