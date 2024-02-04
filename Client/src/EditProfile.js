import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import InfoPopup from './InfoPopup';

import "./styling_folder/generalSiteStyling.css";
import "./styling_folder/signInPage.css";

document.title = "Edit Profile";



// Function that opens or closes the modal (X = Close, O = Open)
function closeOpenAddCarModal(closeOrOpen){
    let modalBg = document.getElementById("addCarModalBgc");

    if(closeOrOpen === 'X'){
        modalBg.style.display = "none";
    }

    if(closeOrOpen === 'O'){
        modalBg.style.display = "flex";
    }
};


function addImageToReview(){
    document.getElementById("addReviewImage").click();
 }


export default function SignInPage() {
  const [user, setUser] = useState();
  const [carsOwn, setCarsOwn] = useState([]);


  useEffect(() => {
    fetch("/usersRouters/getUser", {
      method: 'Post',
      headers: {"Content-Type": "application/json", "Authorization": "Bearer " + localStorage.getItem("JWT")},
    }).then(response => {
      if (!response.ok) {
          history.push('/401_unauthorized');
          return;
      }
      else{
          return response.json();
      }
    })
    .then( data => {
      setUser(data.user)
      setCarsOwn(data.user.carsOwn)
      uploadImage()
    })
  }, []);
  

    const [countryArr, setCountryArr] = useState([]);
    useEffect(() => {
        const countryDropDown = document.getElementById('countryDropDown');
        let countrys = [];

        if(countryDropDown <= 1){
          fetch('https://restcountries.com/v3.1/all').then(res => {
              return res.json();
            }).then(data => {
              data.forEach(country => {
                countrys.push(country.name.common)
                let filteredArray = countrys.filter(item => item !== "Palestine");
                setCountryArr(filteredArray.sort());
              })  
          
            }).catch(err => {
              console.log(err);
            })
        }
     },[]);
     const history = useHistory()

        async function updateUser(){
            let userSiteName = document.getElementById("userSiteName").value;
            let userEmail = document.getElementById("userEmail").value;
            // let userPassword = document.getElementById("userPassword").value;
            // let userConfirmPassword = document.getElementById("userConfirmPassword").value;
            let userFname = document.getElementById("userFname").value;
            let userLname = document.getElementById("userLname").value;
            let userCountry = document.getElementById("countryDropDown").value;
            let userBirthday = document.getElementById("userBirthday").value;
            let userAvatar = document.getElementById("addReviewImage").files[0];
        
                    let formData = new FormData();
                    formData.append('userEmail', userEmail)
                    formData.append('userSiteName', userSiteName)
                    formData.append('creationDate', new Date())
                    // formData.append('userPassword', userPassword)
                    formData.append('userFname', userFname)
                    formData.append('userLname',  userLname)
                    formData.append('userCountry', userCountry)
                    formData.append('userBirthday', userBirthday)
                    formData.append('userAvatar', userAvatar)
                    formData.append('carsOwn', JSON.stringify(carsOwn))
      
                      await fetch("/usersRouters/edit_profile", {
                      method: 'Post',
                      headers: {"Authorization": "Bearer " + localStorage.getItem("JWT")},
                      body: formData
                    }).then(response => {
                      if (!response.ok) {
                          history.push('/401_unauthorized');
                          return;
                      }
                      else{
                          return response.json();
                      }
                    })
                    .then( data => {
                      localStorage.setItem('JWT', data.token);
                      history.push('/');
                      window.location.reload();
                    })

            };

      


    function addOrRemoveCarToList(addOrRemove){
        let selectedBrand = document.getElementById("selectedBrand").value;
        let selectedModel = document.getElementById("selectedModel").value;
        let selectedFromYear = document.getElementById("selectedFromYear").value;

        if(addOrRemove === "Add"){
            setCarsOwn([...carsOwn, {
                selectedFromYear: Number(selectedFromYear),
                selectedBrand: selectedBrand,
                selectedModel: selectedModel
            }]);
        }
    };

    const handleDelete = (index) => {
        let cars = [...carsOwn];
        cars.splice(index, 1);
        setCarsOwn(cars);
    }


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
                let selectedFromYear = document.getElementById("selectedFromYear").value
                let selectedBrand = document.getElementById("selectedBrand").value
                if(selectedFromYear === "" || selectedBrand === ""){
                    return;
                }
                else{
                    fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformakeyear/make/${selectedBrand}/modelyear/${selectedFromYear}/vehicleType/car?format=json`)
                    .then((response) => response.json())
                    .then( data => {
                    data.Results.forEach((element, index, array) => {
                          modelArr.push(element.Model_Name)
                          setModelArrState(modelArr.sort())
                        })
                    })
                }
              }

              function both(){
                addOrRemoveCarToList("Add");
                closeOpenAddCarModal("X");
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

  return (
    <div>
        <div className='pageName' style={{borderBottom: "double"}}>
            <h1>
                Edit Profile
            </h1>
        </div>
        {(user === undefined) ? ( 
              <h1>Loading...</h1>  
            ) : (              
        <>
        <div id='signInContainer'>
            <div className='signInInputsContainer'>
                <label>User Name</label>
                <br></br>
                <input type={"text"} id='userSiteName' defaultValue={user.userSiteName} disabled></input>
                <br></br>
                <br></br>
                <label>Email</label>
                <br></br>
                <input type={"email"} id='userEmail' defaultValue={user.userEmail} disabled></input>
                <br></br>
                <br></br>

                <label>Password</label>
                <br></br>
                <input type={"password"} id='userPassword' defaultValue="*******" disabled></input>
            </div>

            <div className='signInInputsContainer'>
                <label>First Name</label>
                <br></br>
                <input type={"text"} id='userFname' defaultValue={user.userFname}></input>
                <br></br>
                <br></br>

                <label>Last Name</label>
                <br></br>
                <input type={"text"} id='userLname' defaultValue={user.userLname}></input>
                <br></br>
                <br></br>

                <label>Country</label>
                <br></br>
                <select id='countryDropDown'>
                <option value={user.userCountry} hidden>{user.userCountry}</option>
                {(() => {
                    let countrys = []
                    for (let i=0; i < countryArr.length; i++) {
                      countrys.push(<option value={countryArr[i]} key={i} >{countryArr[i]}</option>);
                    }
                    return countrys;
                })()}
                </select>
                <br></br>
                <br></br>

                <label>Birth Day</label>
                <br></br>
                <input type='date' id='userBirthday' defaultValue={new Date(user.userBirthday).toLocaleDateString('en-CA')} disabled/>
            </div>

            <div id='carsInputsContainer' className='signInInputsContainer'>
                <div className='myCarsInput' id='myCarsInput' onClick={() => closeOpenAddCarModal("O")}>
                    <label>My Cars</label>
                    <br></br>
                    <div className='usersCarsDiv' onClick={() => closeOpenAddCarModal("O")}>Add A Car</div>
                    <img src={require('./styling_folder/images/carIcon.png')} alt='Car' className='carIcon' id='carIcon'/>
                </div>
                <div id='customersCars'>
                   {(() => {
                        if(carsOwn.length === 0){
                            return <div className='customersCarsDiv'></div>
                        }

                        if(carsOwn.length > 0){
                            return carsOwn.map((car, i) => {
                                    return <div className='customersCarsDiv' key={i}>
                                        <input className='nonInteractionInputs' placeholder={car.selectedFromYear +' '+ car.selectedBrand +' '+ car.selectedModel}></input>
                                        <img src={require('./styling_folder/images/trashIcon.png')} alt='Delete' className='trashIcon' onClick={() => handleDelete(i)} id={i}/>
                                    </div>
                                
                            })
                        }
                   })()}
                </div>
            </div> 



            <div className='signInInputsContainer' id='createAnAccountCtn'>
                <label>Update Your Profile Picture</label>
                <br></br>
                <input id='addReviewImage' type={"file"} accept=".png, .jpeg, .jpg, .gif" onChange={(e) => {uploadImage(e)}}></input>
                {(() => {
                    let base64ArrayDraw = [];
                    if (baseImage.length > 0) {
                        for (let i=0; i < baseImage.length; i++) {
                            base64ArrayDraw.push(<img key={i} src={`${baseImage[i]}`} alt="Add Avatar" className='userProfilePic' onClick={addImageToReview}></img>);
                        }
                        return base64ArrayDraw;
                    }

                    if(user.userAvatar !== "null"){
                      return <img src={`http://${process.env.REACT_APP_LOCALHOST_IP_ADDRESS}/${user.userAvatar}`} alt="Add Avatar" className='userProfilePic' onClick={addImageToReview}></img>
                    }

                    else {
                        return <img src={require('./styling_folder/images/emptyUserProfile.png')} alt="Add Avatar" className='addImage' onClick={addImageToReview}/>
                    }
                })()}



                <br></br>
                <button id='createAccountBtn' className='allButtons' onClick={updateUser}>Update Profile</button>
            </div>
        </div>


        <div id='addCarModalBgc' className='closeModal'>
            <div id='addCarModal'>
                <img src={require('./styling_folder/images/xBtn.png')} alt='X' id='xBtnModal' className='closeModal' onClick={() => closeOpenAddCarModal("X")}/>
                <h2>Select Your Car</h2>

            <select id='selectedFromYear'>
              <option value="" hidden>Year :</option>
              {(() => {
                let fromYearArr = [];
                for (let i=1920; i <= new Date().getFullYear(); i++) {
                  fromYearArr.push(<option value={i} key={i}>{i}</option>);
                }
                return fromYearArr.reverse();
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
                {(() => {
                    let modelArr = [];
                    for (let i=0; i < modelArrState.length; i++) {
                      modelArr.push(<option value={modelArrState[i]} key={i}>{modelArrState[i]}</option>);
                    }
                    return modelArr;
                })()}
            </select>
                <button className='allButtons' onClick={() => both()}>Add</button>
            </div>
        </div>
        </>
        )}
    </div>
  )
}
