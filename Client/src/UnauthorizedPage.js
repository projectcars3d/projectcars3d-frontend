import React from 'react'
import "./styling_folder/UnauthorizedPage.css"

export default function UnauthorizedPage() {
  return (
    <main id='unauthorizedMain'>
        <p id='unauthorizedP'>
          <span id='font401'>401</span>
          <br></br>
          Unauthorized Page
        </p>
        {/* <div id='stopSignOuter'>
          <div id='stopSignInner'></div>
        </div> */}
        <br></br>
        <div>
          <p>You might need to login for viewing this page</p>
        </div>
    </main>
  )
}
