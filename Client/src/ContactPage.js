import React from 'react'

import "./styling_folder/generalSiteStyling.css";
import "./styling_folder/contactPage.css";

export default function ContactPage() {
  return (
    <div>
        <div className='pageName' style={{borderBottom: "double"}}>
            <h1>
              Contact Us
            </h1>
        </div>

        <div className='contactUsCnt'>
            <p>
            We value your input and feedback!
            <br></br>
            We are constantly working to improve our website to provide the best possible experience for our community of car enthusiasts.
            <br></br>
            If you have any comments, suggestions, or ideas for things we should add or improve on our website, we would love to hear from you.
            <br></br><br></br>
            We are also committed to fixing any bugs or technical issues that you may encounter while using our website.
            <br></br>
            Your satisfaction is our top priority, and we will do everything we can to ensure that your experience on our website is as smooth and enjoyable as possible.
            <br></br><br></br>
            So if you have anything you'd like to share with us, whether it's feedback, suggestions, or just a friendly hello, please don't hesitate to reach out.
            <br></br>
            You can contact us through Email, and we will get back to you as soon as possible.
            <br></br><br></br>
            Thank you for being a part of our community, and we look forward to hearing from you!
            </p>
            <div className='emailIconDiv'>
              <img className='emailIcon' src={require('./styling_folder/images/emailIcon.png')} alt="Race car"/>
            </div>
            <a className='emailLink' href='https://projectcars3d@gmail.com' target={"_blank"}>projectcars3d@gmail.com</a>
        </div>
    </div>
  )
}
