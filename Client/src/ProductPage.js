import React, { useState, useContext, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProductComments from './ProductComments';
import { ReactComponent as StarSvg } from './styling_folder/images/Empty_Rating_Star.svg';
import { userContext } from './GlobalVars';

import "./styling_folder/generalSiteStyling.css";
import "./styling_folder/productPage.css";
import "./styling_folder/enlargeImage.css";

import CarsList from './CarsList';


function scrollByArrowsLeft(){
    let smallImgScrollerContainer = document.getElementById("smallImgScrollerContainer");
    smallImgScrollerContainer.scrollBy(-85, 0);
};

function scrollByArrowsRight(){
    let smallImgScrollerContainer = document.getElementById("smallImgScrollerContainer");
    smallImgScrollerContainer.scrollBy(85, 0);
};



function ProductPage() {

    function setRatingStars(rate){
        let oneStar = document.getElementById("oneStar");
        let twoStar = document.getElementById("twoStar");
        let threeStar = document.getElementById("threeStar");
        let fourStar = document.getElementById("fourStar");
        let fiveStar = document.getElementById("fiveStar");
        let ratingTextbox = document.getElementById("ratingTextbox");

        if(rate === 1){
            oneStar.setAttribute('class', 'ratingStars ratedStar');
            twoStar.removeAttribute('class', 'ratedStar');
            threeStar.removeAttribute('class', 'ratedStar');
            fourStar.removeAttribute('class', 'ratedStar');
            fiveStar.removeAttribute('class', 'ratedStar');
        }

        if(rate === 2){
            oneStar.setAttribute('class', 'ratingStars ratedStar');
            twoStar.setAttribute('class', 'ratingStars ratedStar');
            threeStar.removeAttribute('class', 'ratedStar');
            fourStar.removeAttribute('class', 'ratedStar');
            fiveStar.removeAttribute('class', 'ratedStar');
        }

        if(rate === 3){
            oneStar.setAttribute('class', 'ratingStars ratedStar');
            twoStar.setAttribute('class', 'ratingStars ratedStar');
            threeStar.setAttribute('class', 'ratingStars ratedStar');
            fourStar.removeAttribute('class', 'ratedStar');
            fiveStar.removeAttribute('class', 'ratedStar');
        }

        if(rate === 4){
            oneStar.setAttribute('class', 'ratingStars ratedStar');
            twoStar.setAttribute('class', 'ratingStars ratedStar');
            threeStar.setAttribute('class', 'ratingStars ratedStar');
            fourStar.setAttribute('class', 'ratingStars ratedStar');
            fiveStar.removeAttribute('class', 'ratedStar');
        }

        if(rate === 5){
            oneStar.setAttribute('class', 'ratingStars ratedStar');
            twoStar.setAttribute('class', 'ratingStars ratedStar');
            threeStar.setAttribute('class', 'ratingStars ratedStar');
            fourStar.setAttribute('class', 'ratingStars ratedStar');
            fiveStar.setAttribute('class', 'ratingStars ratedStar');
        }

        ratingTextbox.value = rate;
    }


    function addImageToReview(){
        document.getElementById("addReviewImage").click();
    }


    async function addCommentDiv(){

    let commentText = document.getElementById("commentTextArea").value;
    let addImage = document.getElementById("addReviewImage").files[0];
    let userRaring = document.getElementById("ratingTextbox").value;

    const allowedFormats = ['.jpg', '.jpeg', '.png', '.gif'];
    const extension = addImage.name.substring(addImage.name.lastIndexOf('.')).toLowerCase();

    if (!allowedFormats.includes(extension)) {
        alert("Invalid File Type, Allowed Formats are .jpg, .jpeg, .png, .gif");
        return;
    }
        if(commentText !== ""){
            const h = {}; //headers
            let formData = new FormData();

            formData.append('productId', productIdUrl)
            formData.append('userId', user._id)
            formData.append('commentDate', new Date())
            formData.append('userRate', parseInt(userRaring))
            formData.append('commentText', commentText)
            formData.append('commentImage', addImage)

            await fetch("/productsRouters/product_comments", {
                method: 'Post',
                headers: {"Authorization": "Bearer " + localStorage.getItem("JWT")},
                body: formData
              }).then( response => response.json() )
              .then( data => {
                if(data._id === '')
                {
                    console.log(data.msg)
                }
                else
                {
                    document.getElementById("commentTextArea").value = '';
                    document.getElementById("addReviewImage").value = '';
                    document.getElementById("ratingTextbox").value = 0;
                    setBaseImage([]);

                    fetch("/productsRouters/get_products", {
                        method: 'Post',
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify(productSearch)
                      }).then( response => response.json() )
                      .then( data => {
                        let sumOfRates = 0
                        data.productCommentsArr.forEach((element, index, array) => {
                            sumOfRates = sumOfRates + element.userRate
                        })
                        setProductRate(Math.round(sumOfRates / data.productCommentsArr.length))
                        setProducts(data)
                      })
                }
            }
            )
        }
        else{
            alert("Fill the comment")
        }
    };

    const {user, setUser} = useContext(userContext);

    const params = useParams()
    const productIdUrl = params.productId

    let productSearch = {text: productIdUrl, type: "productId"}; 
    const [products, setProducts] = useState([]);
    const [productRate, setProductRate] = useState(0);
    
    useEffect(() => {
        fetch("/productsRouters/get_products", {
        method: 'Post',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(productSearch)
      }).then( response => response.json() )
      .then( data => {
        let sumOfRates = 0
        data.productCommentsArr.forEach((element, index, array) => {
            sumOfRates = sumOfRates + element.userRate
        })
        setProductRate(Math.round(sumOfRates / data.productCommentsArr.length))
        setProducts(data)
      })
    }, [])


    const productOwnerSearch = {text: products.productOwner}
    const [productOwner, setProductOwner] = useState("Loading..");

      useEffect(() => {
        fetch('/usersRouters/getProductOwner', {
            method: 'Post',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(productOwnerSearch)
          }).then( response => response.json()
          ).then (data => {
                setProductOwner(data.userSiteName);
            }
          )
        },[products, setProductOwner])
      


    const rawCreationDate = new Date(products.creationDate);
    const creationDate = rawCreationDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
      
    const rawUpdateDate = new Date(products.lastUpdateDate);
    const updateDate = rawUpdateDate.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });

    const [mainPicture, setMainPicture] = useState(0);
    
    async function mainImage(i){
        setMainPicture(i)
    }


    async function productWasDownloaded() {
        fetch("/productsRouters/product_was_downloaded", {
            method: 'Post',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(products)
          }).then( response => response.json() )
          .then( data => {
            setProducts(data)
          })
    }





 // Base64
 const [baseImage, setBaseImage] = useState([]);

 const uploadImage = async (e) => {
   let base64Array = []
   for(let i=0; i<e.target.files.length; i++){
     const base64 = await convertBase64(e.target.files[i]);
     base64Array.push(base64)
   }
   setBaseImage(base64Array);
 };

 const convertBase64 = (file) => {
   return new Promise((resolve, reject) => {
     const fileReader = new FileReader();
     fileReader.readAsDataURL(file);

     fileReader.onload = () => {
       resolve(fileReader.result);
     };

     fileReader.onerror = (error) => {
       reject(error);
     };
   });
 };

 useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const addReviewBtn = document.getElementById("addReview");
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState(null);

  
  const handleImageFileChange = (event) => {
    const file = event.target.files[0];
    const allowedFormats = ['.jpg', '.jpeg', '.png', '.gif'];
    const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
  
    if (file) {
      if (allowedFormats.includes(extension)) {
        setImageFile(file);
        setImageError(null);
        addReviewBtn.disabled = false;
      } else {
        setImageFile(null);
        setImageError('Invalid File Format');
        addReviewBtn.disabled = true;
      }
    }
  };
  const isSubmitDisabled = imageError !== null;


  return (
    
    <div>
        <div style={{borderBottom: "double"}}>
            {(products === undefined || products === null || products.productPictures === undefined || products.productPictures === null || products.productFiles === undefined || products.productFiles === null || productOwner === null) ? ( 
              <h1>Loading...</h1>  
            ) : (
            <div style={{display: "flex", justifyContent: "center"}}>
                <div className='productDescriptionComponent'>
                    <div className='productImgsContainer'>
                        <div id='mainImageContainer'>
                                <img id='mainImage' src={`http://${process.env.REACT_APP_LOCALHOST_IP_ADDRESS}/${products.productPictures[mainPicture]}`} onClick={() => handleImageClick(`http://${process.env.REACT_APP_LOCALHOST_IP_ADDRESS}/${products.productPictures[mainPicture]}`)} alt="Main product"/>
                        </div>
                        <div className='smallImageContainer'>
                            <div>
                                <img onClick={scrollByArrowsLeft} id='arrowLeftScroll' className='scrollerArrows' src={require('./styling_folder/images/arrowLeft.png')} alt="Arrow left"/>
                            </div>
                            <div id='smallImgScrollerContainer'>
                            {(() => {
                                let picturesArr = [];
                                for (let i=0; i < products.productPictures.length; i++) {
                                picturesArr.push(<div key={i}><img key={i} className='scrollImg' src={`http://${process.env.REACT_APP_LOCALHOST_IP_ADDRESS}/${products.productPictures[i]}`} alt="Scroll" onClick={() => mainImage(i)}/></div>);
                                }
                                return picturesArr;
                            })()}
                            </div>
                            <div>
                                <img onClick={scrollByArrowsRight} id='arrowRightScroll' className='scrollerArrows' src={require('./styling_folder/images/arrowRight.png')} alt="Arrow left"/>
                            </div>
    
                        </div>
                    </div>
                    <div className='productInfoContainer'>
                        <div className='productDescriptionMainContainer'>
                            <div className='productDescriptionContainer'>
                                <h2>{products.productName}</h2>
                                <p>
                                    Product Description - {products.productDescription}
                                </p>
                            </div>
                            <div className='productBtnsContainer'>
                                <a href={`http://${process.env.REACT_APP_LOCALHOST_IP_ADDRESS}/${products.productFiles[0]}`}>
                                    <button className='allButtons'  onClick={productWasDownloaded}>Download</button>
                                </a>
                                <Link to={"/contact_us"}>
                                <button className='allButtons'>Questions?</button>
                                </Link>
                            </div>
                        </div>
                            <div className='productRecommendation'>
                            <div className='productRecommendationDivs'>
                                <img src={require('./styling_folder/images/printSettingsIcon.png')} alt="Print Settings Icon"/>
                                <h3>Printing Recommendation</h3>
                                {(products.filamentDropDown === undefined || products.filamentDropDown === null) ? ( 
                                    <p>Print Material: Not Specified</p>
                                ) : (
                                    <p>Print Material: {products.filamentDropDown}</p>
                                )}
                                {/* <p>Infill: 40%</p>
                                <p>Infill Stracture: Triangles</p> */}
                                {(products.productNozzleTemp === undefined || products.productNozzleTemp === null) ? ( 
                                    <p>Nozzle Temp: Not Specified</p>
                                ) : (
                                    <p>Nozzle Temp: {products.productNozzleTemp}°C</p>
                                )}
                                {(products.productBedTemp === undefined || products.productBedTemp === null) ? ( 
                                    <p>Bed Temp: Not Specified</p>
                                ) : (
                                    <p>Bed Temp: {products.productBedTemp}°C</p>
                                )}
                            </div>
                            <div className='productRecommendationDivs'>
                                <img src={require('./styling_folder/images/informationIcon.png')} alt="Information Icon"/>
                                <h3>Information</h3>
                                {(products.productPartNumber === undefined || products.productPartNumber === null || products.productPartNumber === "") ? ( 
                                    <p>Part Number: Not Specified</p>
                                ) : (
                                    <p>Part Number: {products.productPartNumber}</p>
                                    )}
                                {/* <p>Uploaded By: {(productOwner === undefined || productOwner === null) ? ( 'Loading...') : ({productOwner})}</p> */}
                                <p>Uploaded By: {productOwner}</p>
                                <p>Uploaded: {creationDate}</p>
                                {(products.lastUpdateDate === undefined || products.lastUpdateDate === null) ? ( 
                                    <p>Last Update: None</p>  
                                ) : (
                                    <p>Last Update: {updateDate}</p>
                                )}
                            </div>
                            <div className='productRecommendationDivs'>
                                <img src={require('./styling_folder/images/downloadIcon.png')} alt="Download Icon"/>
                                <h3>Downloads</h3>
                                <p>{products.productDownloads}</p>
                            </div>
                            <div className='productRecommendationDivs'>
                            {(() => {
                                let drewStars = [];
                                if(products.productCommentsArr[0] === undefined){
                                    return <>
                                    <img src={require('./styling_folder/images/empty-star.png')} alt="star Icon"/>
                                    <p>No Rates</p>
                                    </>
                                }
                                else{
                                    for (let i=0; i < productRate; i++) {
                                        drewStars.push(<img key={i} src={require('./styling_folder/images/Star.png')} alt="star Icon"/>);
                                    }
                                    return <>
                                        {drewStars}
                                        <h3>{productRate} Stars</h3>
                                        <p>From {products.productCommentsArr.length} Rates</p>
                                    </>
                                }
                            })()}
                            </div>
                            <div className='productRecommendationDivs'>
                                <CarsList fitCars={products.fitCars}/>
                            </div>
                    </div>
                    </div>
                </div>
            </div>
            )}
        </div>
        <div className='pageName'>
            <h1>
                Reviews
            </h1>
        </div>
            <div className='productReviewComponent'>
                {user ? (
                <div id='addReviewContainer'>
                    <textarea placeholder="Write Your Review Here.." id='commentTextArea'></textarea>
                    <input id='addReviewImage' type="file" accept=".png, .jpeg, .jpg, .gif" multiple onChange={(e) => { uploadImage(e); handleImageFileChange(e); }}></input>
                    {imageError && <p style={{ color: 'red' }}>{imageError}</p>}

                    {(() => {
                    let base64ArrayDraw = [];
                    if (baseImage.length > 0) {
                        for (let i=0; i < baseImage.length; i++) {
                            base64ArrayDraw.push(<img key={i} src={`${baseImage[i]}`} alt="Add" className='addImage' onClick={addImageToReview}></img>);
                        }
                        return base64ArrayDraw;
                    }

                    else {
                        return <img src={require('./styling_folder/images/addPhoto.png')} alt="Add" className='addImage' onClick={addImageToReview}/>
                    }
                })()}
                    <div id='addReviewBtnContainer'>
                        <button disabled={isSubmitDisabled} id='addReview' className='allButtons'onClick={addCommentDiv}>Add Review</button>
                        <div id='starRatingContainer'>
                            <StarSvg id="oneStar" onClick={() => setRatingStars(1)}/>
                            <StarSvg id="twoStar" onClick={() => setRatingStars(2)}/>
                            <StarSvg id="threeStar" onClick={() => setRatingStars(3)}/>
                            <StarSvg id="fourStar" onClick={() => setRatingStars(4)}/>
                            <StarSvg id="fiveStar" onClick={() => setRatingStars(5)}/>
                        </div>
                        <input type={"number"} id="ratingTextbox" style={{display:"none"}}></input>
                    </div>
                </div>



                ) : (
                    <div className='noCommentForYouCnt'>
                        <div id='addReviewContainer'>
                            <textarea placeholder="Write Your Review Here.." id='commentTextArea'></textarea>
                            <input id='addReviewImage' type={"file"}></input>
                            <img src={require('./styling_folder/images/addPhoto.png')} alt="Add" className='addImage' onClick={addImageToReview}/>
                            <div id='addReviewBtnContainer'>
                                <button className='allButtons'>Add Review</button>
                                <div id='starRatingContainer'>
                                    <StarSvg id="oneStar" onMouseOver={() => setRatingStars(1)}/>
                                    <StarSvg id="twoStar" onMouseOver={() => setRatingStars(2)}/>
                                    <StarSvg id="threeStar" onMouseOver={() => setRatingStars(3)}/>
                                    <StarSvg id="fourStar" onMouseOver={() => setRatingStars(4)}/>
                                    <StarSvg id="fiveStar" onMouseOver={() => setRatingStars(5)}/>
                                </div>
                                <input type={"number"} id="ratingTextbox" style={{display:"none"}}></input>
                            </div>
                        </div>
                        <div className='noCommentForYou'>
                            <h2>
                                Please login in-order to add a comment
                            </h2>
                        </div>
                    </div>
                )}
            </div>
            <ProductComments productComments={products}></ProductComments>

            <div>
                {selectedImage !== null && (
                <div className="imageModal" onClick={handleCloseModal}>
                    <img src={selectedImage} alt="Selected Image" className="enlargedImage"/>
                </div>
                )}
            </div>

    </div>
  )
}

export default ProductPage;