import React, {useContext, useState, useEffect} from 'react'
import { Link } from 'react-router-dom';
import { productsContext } from './GlobalVars';
import { useHistory } from 'react-router-dom';

import "./styling_folder/generalSiteStyling.css"
import "./styling_folder/searchBar.css"


function changeSearchBar(searchBy){  
  const searchByCar = document.getElementById("searchByCar");
  const searchByPN = document.getElementById("searchByPN");
  const searchByFreeText = document.getElementById("searchByFreeText");

    if (searchBy === 'car'){
        searchByCar.style.display = "block";
        searchByPN.style.display = "none";
        searchByFreeText.style.display = "none";
    }

    if (searchBy === 'pn'){
        searchByCar.style.display = "none";
        searchByPN.style.display = "block";
        searchByFreeText.style.display = "none";
    }

    if (searchBy === 'freeText'){
        searchByCar.style.display = "none";
        searchByPN.style.display = "none";
        searchByFreeText.style.display = "block";
    }
}



export default function SearchBar() {

  const {searchResulst, setSearchResults} = useContext(productsContext)


  const [brandArrState, setBrandArrState] = useState([]);

let brandArr = [];
let BrandsToFilter = [
    "AAS",
    "AC PROPULSION",
    "ALLARD MOTOR WORKS",
    "AM GENERAL",
    "AMERICAN MOTORS",
    "AMERITECH CORPORATION",
    "ARMBRUSTER STAGEWAY",
    "ASUNA",
    "AUTOCAR LTD",
    "AUTODELTA USA INC",
    "AUTOMOBILI PININFARINA",
    "AVANTI",
    "AVERA MOTORS",
    "BAKKURA MOBILITY",
    "BBC",
    "BLACKWATER",
    "BLUECAR",
    "BUG MOTORS",
    "BXR",
    "C-R CHEETAH RACE CARS",
    "CALMOTORS",
    "CARBODIES",
    "CLASSIC ROADSTERS",
    "CLASSIC SPORTS CARS",
    "CLENET",
    "COBRA CARS",
    "CODA",
    "CONSULIER GTP",
    "CONTEMPORARY CLASSIC CARS (CCC)",
    "COSTIN SPORTS CAR",
    "CREATIVE COACHWORKS",
    "CREATIVE COACHWORKS INC.",
    "CRUISE",
    "CX AUTOMOTIVE",
    "DAYTONA COACH BUILDERS",
    "DONGFENG",
    "EAGLE",
    "ECOCAR",
    "ELECTRIC CAR COMPANY",
    "ELECTRIC MOBILE CARS",
    "EMA",
    "ENGINE CONNECTION",
    "EQUUS AUTOMOTIVE",
    "EV INNOVATIONS",
    "EXCALIBUR AUTOMOBILE CORPORATION",
    "FALCON",
    "FAW JIAXING HAPPY MESSENGER",
    "FORMULA 1 STREET COM",
    "FORTUNESPORT VES",
    "GLICKENHAUS",
    "GRUPPE B",
    "GULLWING INTERNATIONAL MOTORS, LTD.",
    "HERITAGE",
    "HUNTER DESIGN GROUP, LLC",
    "IVES MOTORS CORPORATION (IMC)",
    "JAC 427",
    "KANDI",
    "KARMA",
    "KARMA AUTOMOTIVE LLC",
    "KEPLER MOTORS",
    "LA EXOTICS",
    "LITE CAR",
    "LONDONCOACH INC",
    "LUCID MOTORS",
    "LUMEN",
    "MAKING YOU MOBILE",
    "MATRIX MOTOR COMPANY",
    "MERKUR",
    "MGS GRAND SPORT (MARDIKIAN)",
    "MOSLER",
    "MYCAR",
    "NJD AUTOMOTIVE LLC",
    "PANOZ",
    "PANTHER",
    "PAS",
    "PHOENIX MOTORCARS",
    "PHOENIX SPORTS CARS, INC.",
    "PININFARINA",
    "RALLY SPORT",
    "RENAISSANCE",
    "REVOLOGY",
    "ROCKET SLED MOTORS",
    "RS SPIDER",
    "SCUDERIA CAMERON GLICKENHAUS (SCG)",
    "SF MOTORS INC.",
    "SOLECTRIA",
    "STANFORD CUSTOMS",
    "STERLING MOTOR CAR",
    "TH!NK",
    "TOTAL ELECTRIC VEHICLES",
    "UCC",
    "UKEYCHEYMA",
    "VECTOR AEROMOTIVE CORPORATION",
    "VINTAGE AUTO",
    "VINTAGE CRUISER",
    "VINTAGE MICROBUS",
    "VINTAGE ROVER",
    "VISION INDUSTRIES",
    "WARHAWK PERFORMANCE",
    "WESTFALL MOTORS CORP.",
    "YESTER YEAR AUTO",
    "ZOOX"
];
useEffect(() => {
  fetch('https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json')
  .then((response) => response.json())
  .then( data => {
    if(brandArr.length !== data.Results.length){
      data.Results.forEach((element, index, array) => {
        brandArr.push(element.MakeName)
        let filteredArray = brandArr.filter(item => !BrandsToFilter.includes(item));
        setBrandArrState(filteredArray.sort()) 
  })
  }
  })
},[]);

const [modelArrState, setModelArrState] = useState([]);

let modelArr = [];
function findModel() {
  let selectedYear = document.getElementById("selectedYear").value
  let selectedBrand = document.getElementById("selectedBrand").value
  if(selectedBrand === "" || selectedYear === ""){
    return;
}
  else{
    fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformakeyear/make/${selectedBrand}/modelyear/${selectedYear}/vehicleType/car?format=json`)
    .then((response) => response.json())
    .then( data => {
    data.Results.forEach((element, index, array) => {
          modelArr.push(element.Model_Name)
          setModelArrState(modelArr.sort())
        })
    })
  };
};

  async function searchValues(){
    const searchByCar = document.getElementById("searchByCar");
    const searchByPN = document.getElementById("searchByPN");
    const searchByFreeText = document.getElementById("searchByFreeText");
    let freeText = document.getElementById("freeText").value;
    let partNum = document.getElementById("partNumber").value;
    let selectedYear = document.getElementById('selectedYear').value;
    let selectedBrand = document.getElementById('selectedBrand').value;
    let selectedModel = document.getElementById('selectedModel').value;
    let carYearBrandModel = `${selectedYear} ${selectedBrand} ${selectedModel}`;
  
    let productSearch = {text: "", type: "", brand:"", model:"", fromYear: 0, category:"All"};
  
    if(searchByFreeText.style.display === "block"){
      productSearch.type = "freeText";
      productSearch.text = freeText;
    }
  
    if(searchByPN.style.display === "block"){
      productSearch.type = "partNum";
      productSearch.text = partNum;
    }

    if(searchByCar.style.display === "block"){
      productSearch.type = "carModel";
      productSearch.text = "find by car";
      productSearch.brand = selectedBrand;
      productSearch.model = selectedModel;
      productSearch.fromYear = selectedYear;
    }

    if(productSearch.text === "" || productSearch.text === " " || productSearch.text === "  "){
      alert("Fill the text area")
      return;
    }
    
    if(productSearch.brand === "" && searchByCar.style.display === "block"){
      alert("Please select a car brand")
      return;
    }
    
    if(searchByCar.style.display === "none"){
      history.push("/search_results/" + productSearch.type + '/' + productSearch.text + '/' + productSearch.category);
    }

    if(searchByCar.style.display === "block"){
      history.push("/search_results/" + productSearch.type + '/' + productSearch.brand + '/' + productSearch.model + '/' + productSearch.fromYear + '/' + productSearch.category);
    }

  }

  // Enable to search using Enter (Did interfere with new line inside a textarea)
  // useEffect(() => {
  //   function activateWithEnter(event) {
  //     if (event.key === 'Enter') {
  //       searchValues();
  //     }
  //   }
    
  //   window.addEventListener('keypress', activateWithEnter);
    
  //   return () => {
  //     window.removeEventListener('keypress', activateWithEnter);
  //   };
  // }, []);
  

  const history = useHistory()

  return (
    <div className='searchBar'>
      <div className='searchType'>
            Search By:&nbsp;
            <span className='clickableText' onClick={() => changeSearchBar("car")}>Car&nbsp;</span>
            /&nbsp;
            <span className='clickableText' onClick={() => changeSearchBar("pn")}>Part Number&nbsp;</span>
            /&nbsp;
            <span className='clickableText' onClick={() => changeSearchBar("freeText")}>Free Text</span>
      </div>

      <div id='searchByFreeText'>
        <input placeholder='Search By Free Text' id='freeText'></input>
          <button className='allButtons' onClick={() => searchValues()}>Search</button>
      </div>

      <div id='searchByPN'>
        <input placeholder='Search By Part Number' id='partNumber'></input>
          <button className='allButtons' onClick={() => searchValues()}>Search</button>
      </div>

      <div id='searchByCar' style={{display: "block"}}>
      <div className='searchInputs'>
            <select id='selectedYear' onChange={findModel}>
                <option value="" hidden>Year :</option>
                <option value="All"> All Years</option>
                {(() => {
                    let yearArr = [];
                    for (let i=1920; i <= new Date().getFullYear(); i++) {
                      yearArr.push(<option value={i} key={i} >{i}</option>);
                    }
                    return yearArr.reverse();
                })()}
            </select>
            <select id='selectedBrand' onChange={findModel}>
                <option value="" hidden>Brand :</option>
                {(() => {
                    let brandArr = [];
                    for (let i=0; i < brandArrState.length; i++) {
                      brandArr.push(<option value={brandArrState[i]} key={i}>{brandArrState[i]}</option>);
                    }
                    return brandArr;
                })()}
            </select>
            <select id='selectedModel'>
                <option value="" hidden>Model :</option>
                <option value="All"> All Models </option>
                {(() => {
                    let modelArr = [];
                    for (let i=0; i < modelArrState.length; i++) {
                      modelArr.push(<option value={modelArrState[i]} key={i}>{modelArrState[i]}</option>);
                    }
                    return modelArr;
                })()}
            </select>
              <button className='allButtons' onClick={() => searchValues()}>Search</button>
      </div>
      </div>
    </div>
  )
}