import React, {useEffect, useContext} from 'react'
import { useHistory } from 'react-router-dom';
import { userContext } from './GlobalVars';

import "./styling_folder/loginPage.css";


let userInfo = null;


export default function LoginPage() {
  
  const history = useHistory()

  async function handleLogin(){
    let userEmail = document.getElementById("userEmail").value;
    let userPassword = document.getElementById("userPassword").value;
    const userContext = {userEmail, userPassword};
  
  
    await fetch("/usersRouters/loginInfo", {
      method: 'Post',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(userContext)
    }).then( response => response.json()
    ).then (data => {
      if(data.message !== undefined){
        alert(data.message);
        return;
    }
        localStorage.setItem('JWT', data.token);
        data.isUserLogged = true;
        userInfo = data.user;
        history.push('/');
      }
    )
  };


  const {user, setUser} = useContext(userContext);

  async function logUser(){
    await handleLogin()
    setUser(userInfo)
  }

  return (
    <div>
        <div className='pageName' style={{borderBottom: "double"}}>
            <h1>
                 Login
            </h1>
        </div>
        <div id='signInContainer'>
            <div className='signInInputsContainer'>
                <label>Email</label>
                <br></br>
                <input type={"email"} id='userEmail'></input>
                <br></br>
                <br></br>

                <label>Password</label>
                <br></br>
                <input type={"password"} id='userPassword'></input>
                <br></br>
                <br></br>
                <div id='loginCtn'>
                  <button id='loginBtn' className='allButtons' onClick={logUser}>Login</button>
                </div>
            </div>
        </div>
    </div>
  )
}
