import React from 'react'

import "./styling_folder/generalSiteStyling.css";
import "./styling_folder/supportUsPage.css";

export default function supportUsPage() {
  return (
    <div>
        <div className='pageName' style={{borderBottom: "double"}}>
            <h1>
              Support Us
            </h1>
        </div>
        <div className='supportUsCnt'>
          <div>
              <h1>
                  Why Supporting Us?
              </h1>
              <p>
                At our website, we have created a platform dedicated to the automotive community where enthusiasts can freely upload and download 3D files for 3D printing automotive parts. This project has been a labor of love, built entirely during spare times. However, in order to maintain, upgrade, and evolve the website, we require financial support. By donating to our cause, you can contribute to the continued growth and improvement of the platform, ensuring that it remains a valuable resource for car enthusiasts worldwide.
              </p>
              <br></br> <br></br>
              <h1>
                  How To Support Us?
              </h1>
              <p>
                There are two simple ways to support us: By clicking on the PayPal donation button in this page or by clicking on the commercial banners placed on our website. Your generosity will go a long way in helping us sustain this initiative and provide an even better experience for the automotive community.
                <br></br>
                Thank you for considering supporting our project!
              </p>
          </div>

          <div className='donateImgCnt'>
            <img className='donateImg' src={require('./styling_folder/images/peugeot206Cup.JPG')} alt="Race car"/>
            <form action="https://www.paypal.com/donate" method="post" target="_top">
              <input type="hidden" name="business" value="M5K4A3VY5END8" className='exclude-style'/>
              <input type="hidden" name="no_recurring" value="0" className='exclude-style'/>
              <input type="hidden" name="item_name" value="Help our community to grow, share creations and ideas, and keep the passion for cars and 3D printing!" className='exclude-style'/>
              <input type="hidden" name="currency_code" value="USD" className='exclude-style'/>
              <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" className='exclude-style donateBtn'/>
              <img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" className='exclude-style'/>
          </form>
          <img src={require('./styling_folder/images/Donation_QR_Code.png')} alt="Donation QR Code"/>
          </div>
        </div>
    </div>
  )
}
