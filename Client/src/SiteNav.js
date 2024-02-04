//RFC Creates a new component

import React, {useEffect, useState} from 'react'
import { useHistory } from 'react-router-dom'
import { useContext } from 'react'
import { userContext } from './GlobalVars'
import { Link } from 'react-router-dom'

//CSS Import
import "./styling_folder/generalSiteStyling.css"
import "./styling_folder/siteNav.css"
import './styling_folder/images/svg_logo/Group.svg'


export default function SiteNav() {
  useEffect(() => {
    const jwt = localStorage.getItem('JWT');
    if (jwt) {
      fetch('/usersRouters/getUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`,
        },
      })
        .then(response => response.json())
        .then(data => setUser(data.user));
    }
  }, []);
  

  const {user, setUser} = useContext(userContext);
  const history = useHistory();

  function logOut(){
    setUser(null);
    localStorage.removeItem("JWT");
    history.push("/");
  };

  return (
    <>
    <nav>
      <div className="logoContainer">
        <Link to={"/"}>
          <img id='logo' src={require('./styling_folder/images/svg_logo/Group.png')} alt="Logo"/>
        </Link>
      </div>
      <div className="navButtonsContainer">
        <Link to={"/about_us"}>
          <button className='navButtons clickableTextBlue' id='firstNavBtn'>
            About
          </button>
        </Link>
        <Link to={"/contact_us"}>
          <button className='navButtons clickableTextBlue'>
            Contact
          </button>
        </Link>
        <Link to={"/support_us"}>
          <button className='navButtons clickableTextBlue'>
            Support Us
          </button>
        </Link>
      <Link to={"/add_a_product"}>
        <button className='navButtons clickableTextBlue'>
          New Upload
        </button>
      </Link>
      </div>
    {user ? (
      <div id="userButtonContainer">
        <img id='hamburger' src={require('./styling_folder/images/hamburger.png')} alt="Logo"/>
        <div id='userInfo'>
          <img src={require('./styling_folder/images/Polygon 5.png')} alt="User Profile" id='userDropDownArrow'/>
          <div id='userName'>
            {user.userSiteName}
          </div>
          {/* <div id='userProfilePic' style={{ backgroundImage: `url(http://localhost:5000/${user.userAvatar})`}}></div> */}
          {user.userAvatar ? (
            <img src={`http://${process.env.REACT_APP_LOCALHOST_IP_ADDRESS}/${user.userAvatar}`} alt="User Profile" id='userProfilePic'/>
          ):(
            <img src={require('./styling_folder/images/path0.png')} alt="User Profile" id='userProfilePic'/>
          )}
        </div>


        <div id='userDropDown'>
          <div className='userDropDownBtn' id='userHamburger'>
          <div id='userName'>
            {user.userSiteName}
          </div>
          {user.userAvatar ? (
            <Link to={"/edit_profile"}>
              <img src={`http://${process.env.REACT_APP_LOCALHOST_IP_ADDRESS}/${user.userAvatar}`} alt="User Profile" id='userProfilePic'/>
            </Link>
          ):(
            <Link to={"/edit_profile"}>
              <img src={require('./styling_folder/images/path0.png')} alt="User Profile" id='userProfilePic'/>
            </Link>
          )}
          </div>


        <Link to={"/about_us"}>
          <div className='userDropDownBtn clickableTextBlue'>
            About
          </div>
        </Link>
        <Link to={"/contact_us"}>
          <div className='userDropDownBtn clickableTextBlue'>
            Contact
          </div>
        </Link>
        <Link to={"/support_us"}>
          <div className='userDropDownBtn clickableTextBlue'>
            Support Us
          </div>
        </Link>
        <Link to={"/add_a_product"}>
        <div className='userDropDownBtn clickableTextBlue'>
          New Upload
        </div>
        </Link>
        <Link to={"/my_uploads"}>
        <div className='userDropDownBtn clickableTextBlue'>
          Manage Uploads
        </div>
        </Link>
        <Link to={"/edit_profile"}>
        <div className='userDropDownBtn clickableTextBlue'>
          Edit Profile
        </div>
        </Link>
        <div className='userDropDownBtn clickableTextBlue' onClick={logOut}>
          Log Out
        </div>
        </div>
      </div>
      ) : (
        <>
          <div id='logAndSignInCnt'>
        <Link to={"/login"}>
          <button className="signButton" id='signInDivaider'>
            Login
          </button>
        </Link>

        <Link to={"/sign_in"}>
          <button className="signButton">
            Sign In
          </button>
        </Link>
          </div>


        <div id="userButtonContainer" className='userButtonContainer_phone'>
        <img id='hamburger' src={require('./styling_folder/images/hamburger.png')} alt="Logo"/>
          <div id='userDropDown'>
        <Link to={"/about_us"}>
          <div className='userDropDownBtn clickableTextBlue'>
            About
          </div>
        </Link>
        <Link to={"/contact_us"}>
          <div className='userDropDownBtn clickableTextBlue'>
            Contact
          </div>
        </Link>
        <Link to={"/support_us"}>
          <div className='userDropDownBtn clickableTextBlue'>
            Support Us
          </div>
        </Link>
        <Link to={"/sign_in"}>
        <div className='userDropDownBtn clickableTextBlue'>
          Sign In
        </div>
        </Link>
        <Link to={"/login"}>
        <div className='userDropDownBtn clickableTextBlue'>
          Login
        </div>
        </Link>
        </div>
        </div>
</>
      )}
    </nav>
    </>
  )
}