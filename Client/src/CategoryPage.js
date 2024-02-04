import React, {useEffect, useState} from "react";
import { Link } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { useHistory } from 'react-router-dom';


import "./styling_folder/generalSiteStyling.css"
import "./styling_folder/categoryPage.css"


function addAndRemoveCategoryEnds(){
    let scrollPosotion = document.getElementById("scroller").scrollLeft;
    let categoryEndLeft = document.getElementById("categoryEndLeft");
    let categoryEndRight = document.getElementById("categoryEndRight");
    if(scrollPosotion < 15){
        categoryEndLeft.style.display = "none"
    }

    else{
        categoryEndLeft.style.display = "block"
    }

    if(scrollPosotion > 1605){
        categoryEndRight.style.display = "none"
    }

    else{
        categoryEndRight.style.display = "block"
    }
}


export default function CategoryPage() {
  
  const location = useLocation();
  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, [location.pathname]);

  const [selectedCategoryButton, setSelectedCategoryButton] = useState('All')
  const [searchResults, setSearchResults] = useState([])
  const [currentUrl, setCurrentUrl] = useState(location.pathname);

  const urlSegments = currentUrl.split("/").slice(4);
  let productSearch = {type: urlSegments[0], text: urlSegments[1], category: urlSegments[2], brand:"", model:"", fromYear: 0};
  if (productSearch.text && productSearch.text.includes('%20')) {
    productSearch.text = productSearch.text.replace(/%20/g, ' ');
  }
  if (urlSegments[0] === "carModel"){
    productSearch = {text: "", type: urlSegments[0], brand:urlSegments[1], model:urlSegments[2], fromYear: urlSegments[3], category: urlSegments[4]};
  };


  useEffect(() => {
    fetch("/productsRouters/get_products", {
      method: "Post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productSearch),
    })
      .then((response) => response.json())
      .then((data) => {
        setSearchResults(data);
        if (data.length === 0 || data.length === undefined) {
          document.getElementById("noFilesMsg").style.display = "none";
        }     
      });
  }, [currentUrl]);
  
  
  const history = useHistory()
  async function filterByCategory(selectedCategory){
    // Get the current pathname
    const currentPathname = window.location.pathname;

    // Split the pathname into segments
    const pathSegments = currentPathname.split('/');

    // Replace the last segment with the new selectedCategory
    pathSegments[pathSegments.length - 1] = selectedCategory;

    // Join the modified segments back into a pathname
    const newPathname = pathSegments.join('/');

    // Push the updated pathname to the history
    history.push(newPathname);
    setSelectedCategoryButton(selectedCategory);
  }

  function checkPartNum() {
    const currentPathname = window.location.pathname;

    // Split the pathname into segments
    const pathSegments = currentPathname.split('/');

    // Check if "partNum" exists in the URL
    const hasPartNum = pathSegments.includes('partNum');
    var elements = document.getElementsByClassName("asideBtns");
    if (hasPartNum === true) {
      // Loop through the collection and set the "disabled" property to true for each element
      for (var i = 0; i < elements.length; i++) {
        elements[i].disabled = true;
      }
    }
    else {
      for (var i = 0; i < elements.length; i++) {
        elements[i].disabled = false;
      }    }
  }
  checkPartNum()

  return (
    <> 
    <div className='pageName'>
        <h1>
          Results For {selectedCategoryButton} Categorie
        </h1>
    </div>
    <div id='mainContainer'>
    <aside id='scroller' onScroll={addAndRemoveCategoryEnds}>
    <div id='categoryEndLeft'>
    </div>
    <div id='categoryEndRight'>
    </div>

    <button onClick={() => filterByCategory('All')} className='allButtons asideBtns'>All</button>
    <button onClick={() => filterByCategory('Engine')} className='allButtons asideBtns' value={'Engine'}>Engine</button>
    <button onClick={() => filterByCategory('Braking')} className='allButtons asideBtns'>Braking</button>
    <button onClick={() => filterByCategory('AC')} className='allButtons asideBtns'>A/C</button>
    <button onClick={() => filterByCategory('Drivetrain')} className='allButtons asideBtns'>Drivetrain</button>
    <button onClick={() => filterByCategory('Exhaust')} className='allButtons asideBtns'>Exhaust</button>
    <button onClick={() => filterByCategory('Interior')} className='allButtons asideBtns'>Interior</button>
    <button onClick={() => filterByCategory('Exterior')} className='allButtons asideBtns'>Exterior</button>
    <button onClick={() => filterByCategory('Suspension')} className='allButtons asideBtns'>Suspension</button>
    <button onClick={() => filterByCategory('Steering')} className='allButtons asideBtns'>Steering</button>
    <button onClick={() => filterByCategory('Accessories')} className='allButtons asideBtns'>Accessories</button>
    <button onClick={() => filterByCategory('Tools')} className='allButtons asideBtns'>Tools</button>

    </aside>
    <main>
      <div className='cardsCategoryContainer'>
      <div id="noFilesMsg" style={{ display: "none" }}>No Results For This Category</div>
        {(typeof searchResults === undefined || searchResults === null || searchResults == [] || searchResults.length === 0 || searchResults === "Not a valid search type") ? (
              <h1>No files found..</h1>
            ) : (
              searchResults.map((searchResults, i) => {
                function calculateSumOfRates(productCommentsArr) {
                  let sumOfRates = 0
                  searchResults.productCommentsArr.forEach((element, index, array) => {
                    sumOfRates = sumOfRates + element.userRate
                  })
                  if (searchResults.productCommentsArr.length === 0) {
                    return 0;
                  }
                  return Math.round(sumOfRates / searchResults.productCommentsArr.length);
                }
              return <div className='productCard' key={i} data-value={searchResults.productCategory}>
              <div className='productCardTitle'>
                {searchResults.productName}
              </div>
              <div className="cardImgCnt">
                <Link to={"/product/" + searchResults._id}>
                <img src={`http://${process.env.REACT_APP_LOCALHOST_IP_ADDRESS}/` + searchResults.productPictures[0]} alt='Product' className='productCardImg'/>
                </Link>
              </div>

              <div>
              <div className='cardDawnloadDiv'>
                <img className='cardDawnloadImg' src={require('./styling_folder/images/downloadIcon.png')} alt='Download Icon'/> &nbsp;
                {searchResults.productDownloads} Downloads
              </div>
              <div className='cardStarDiv'>
                <img src={require('./styling_folder/images/Star.png')} alt='Star Icon'/> &nbsp;
                {`${calculateSumOfRates()} Stars (${searchResults.productCommentsArr.length} Rates)`}
              </div>
              </div>
              
            </div>
              })
            )}
      </div>
    </main>
    <aside id="asideMargin"></aside>
    </div> 
    </>
  )
}
