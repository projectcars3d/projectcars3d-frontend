import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import { userContext } from './GlobalVars';
import { productsContext } from './GlobalVars';
import "./styling_folder/generalSiteStyling.css"

let productSearch = {text: "", type: "new"}; 

export default function MainPage() {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/productsRouters/get_products", {
      method: 'Post',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(productSearch)
    }).then( response => response.json() )
    .then( data => setProducts(data))
  }, [])

  const rawCreationDate = new Date(products.creationDate);
  const creationDate = rawCreationDate.getDate() + "/" + (rawCreationDate.getMonth() + 1) + "/" + rawCreationDate.getFullYear();

  


  return (
    <main>
      <div>
        <h1> 
          Newst Uploads
        </h1>
      </div>

      <div className='cardsContainer'>
      {products ? ( 
              products.map((product, i) => {
                const rawCreationDate = new Date(product.creationDate);
                const creationDate = rawCreationDate.toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'});
                
                return <div className='productCard' key={i}>
                <div className='productCardTitle'> 
                  {product.productName}
                </div>
                  <div id="productCardImgPCnt">
                    <div className="cardImgCnt">
                      <Link to={`/product/${product._id}`}>
                      <img src={`http://${process.env.REACT_APP_LOCALHOST_IP_ADDRESS}/${product.productPictures[0]}`} alt='Product' className='productCardImg'/>
                      </Link>
                    </div>
                    <div>
                      <p>Uploaded {creationDate}</p>
                      {(() => {
                          if(product.fitCars[0].selectedFromYear === null && product.fitCars[0].selectedToYear === 0){
                              return <p>Fit: {'All Years '+ product.fitCars[0].selectedBrand +' '+ product.fitCars[0].selectedModel}</p>
                          }

                          if(product.fitCars[0].selectedToYear === 0 && product.fitCars[0].selectedFromYear > 0 || product.fitCars[0].selectedToYear === product.fitCars[0].selectedFromYear){
                              return <p>Fit: {product.fitCars[0].selectedFromYear +' '+ product.fitCars[0].selectedBrand +' '+ product.fitCars[0].selectedModel}</p>
                          }

                          if(product.fitCars[0].selectedToYear > 0 && product.fitCars[0].selectedFromYear > 0){
                              return <p>Fit: {product.fitCars[0].selectedFromYear +' - '+ product.fitCars[0].selectedToYear +' '+ product.fitCars[0].selectedBrand +' '+ product.fitCars[0].selectedModel}</p>
                          }
                      })()}

                      {(() => {
                          if(product.fitCars.length > 1){
                              return <p style={{ fontSize: `0.8em` }}>&#183; More models detailed inside &#183;</p>
                          }
                      })()}
                    </div>
                  </div>
              </div>
              })

            ) : (
              <h1>Loading...</h1>  
            )}
      </div>
    </main>
  )
}
