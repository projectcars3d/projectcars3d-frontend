import React, { useState } from "react";
import "./styling_folder/generalSiteStyling.css";
import "./styling_folder/productComments.css";
import "./styling_folder/enlargeImage.css";


const ProductComments = ({ productComments }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };


  return (
    <div id="usersReviewsContainer">
      {productComments === undefined || productComments.length === 0 ? (
        <h1>Loading...</h1>
      ) : (
        productComments.productCommentsArr.map((productComment, i) => (
          <div className="reviewContainer" key={i}>
            <div className="usersReviewDetails">
              <div className="userAvatarDiv">
              {productComment.userProfile === 'null' ? (
                <img src={require('./styling_folder/images/path0.png')} alt="User Profile" id="userProfilePic"/>
                ) : (
                <img src={`http://${process.env.REACT_APP_LOCALHOST_IP_ADDRESS}/${productComment.userProfile}`} alt="User Profile" id="userProfilePic"/>
               )}
              </div>
              <div>
                <div>{productComment.userName}</div>
                <div>
                  {new Date(productComment.commentDate).toLocaleString(
                    "en-US",
                    { month: 'long', day: 'numeric', year: 'numeric' }
                  )}
                </div>
                <div>
                  <img src={require("./styling_folder/images/Star.png")} alt="Star Icon"/> &nbsp;
                  {productComment.userRate}
                </div>
              </div>
            </div>
            <div className="commentDiv">{productComment.commentText}</div>
            <div className="usersPrintImage">
            {productComment.commentImage === "" ? (
                null
            ) : (
                <img src={`http://${process.env.REACT_APP_LOCALHOST_IP_ADDRESS}/${productComment.commentImage}`} alt="Upload Image" className="commentImage" onClick={() => handleImageClick(`http://${process.env.REACT_APP_LOCALHOST_IP_ADDRESS}/${productComment.commentImage}`)}/>
            )}              
            </div>
          </div>
        ))
      )}

      {selectedImage !== null && (
        <div className="imageModal" onClick={handleCloseModal}>
          <img src={selectedImage} alt="Selected Image" className="enlargedImage"/>
        </div>
      )}
    </div>
  );
};

export default ProductComments;

