import React, { useEffect } from 'react';

import "./styling_folder/infoPopup.css";


function InfoPopup(props) {

  // useEffect(() => {
  //   const infoIcon = document.querySelector('.info-icon');
  //   const infoPopup = document.querySelector('.info-popup');

  //   infoIcon.addEventListener('mouseover', () => {
  //     const iconRect = infoIcon.getBoundingClientRect();
  //     const popupRect = infoPopup.getBoundingClientRect();
  //     const screenWidth = window.innerWidth;
  //     const left = iconRect.left - popupRect.width / 2 + iconRect.width / 2;
  //     const right = left + popupRect.width;

  //     if (left < 0) {
  //       infoPopup.style.left = '0px';
  //     } else if (right > screenWidth) {
  //       infoPopup.style.left = screenWidth - popupRect.width + 'px';
  //     } else {
  //       infoPopup.style.left = left + 'px';
  //     }
  //   });
  // }, []);

  return (
    <div className='informationCircule'>
      <p>
        <span className="info-icon">i
          <span className="info-popup">{props.text}</span>
        </span>
      </p>
    </div>
  );
}

export default InfoPopup;