import { useContext, useState, useEffect } from 'react'
import { userContext } from './GlobalVars'
import { useHistory } from 'react-router-dom';
import InfoPopup from "./InfoPopup";


import "./styling_folder/generalSiteStyling.css";
import "./styling_folder/signInPage.css";
import "./styling_folder/addProductPage.css";


export default function AddProductPage() {
    useEffect(() => {
        fetch("/usersRouters/getUser", {
          method: 'Post',
          headers: {"Content-Type": "application/json", "Authorization": "Bearer " + localStorage.getItem("JWT")},
        }).then( response => response.json() )
        .then( data => setUser(data.user))
      }, []);

    function both(){
        addOrRemoveCarToList("Add");
        closeOpenAddCarModal("X");
    }
    
    function addImageToReview(){
        document.getElementById("addReviewImage").click();
     }
    

    // Function that opens or closes the modal (X = Close, O = Open)
    function closeOpenAddCarModal(closeOrOpen){
        let closeModal = document.getElementsByClassName("closeModal");
        let openModal = document.getElementById("carIcon");

        let modalBg = document.getElementById("addCarModalBgc");

        if(closeOrOpen === 'X'){
            modalBg.style.display = "none";
        }

        if(closeOrOpen === 'O'){
            modalBg.style.display = "flex";
        }
    };

    const [fitCarsArr, setFitCarsArr] = useState([]);

    function addOrRemoveCarToList(addOrRemove){
        let selectedBrand = document.getElementById("selectedBrand").value;
        let selectedModel = document.getElementById("selectedModel").value;
        let selectedFromYear = document.getElementById("selectedFromYear").value;
        let selectedToYear = document.getElementById("selectedToYear").value;

        if(addOrRemove === "Add"){
            setFitCarsArr([...fitCarsArr, {
                selectedFromYear: Number(selectedFromYear),
                selectedToYear: Number(selectedToYear),
                selectedBrand: selectedBrand,
                selectedModel: selectedModel
            }]);
        }
    };

    const handleDelete = (index) => {
        let cars = [...fitCarsArr];
        cars.splice(index, 1);
        setFitCarsArr(cars);
    }



    const {user, setUser} = useContext(userContext);
    let history = useHistory();

    function addProduct(){

        let productName = document.getElementById("productName").value;
        let productDescription = document.getElementById("productDescription").value;
        let productPartNumber = document.getElementById("productPartNumber").value;
        let productFiles = document.getElementById("productFiles").files;
        let productPictures = document.getElementById("productPictures").files;
        let productPicturesBase64 = document.getElementById("productPictures").value;
        let productCategory = document.getElementById("productCategory").value;
        let filamentDropDown = document.getElementById("filamentDropDown").value;
        let productNozzleTemp = document.getElementById("productNozzleTemp").value;
        let productBedTemp = document.getElementById("productBedTemp").value;    
                
            const h = {}; //headers
            let formData = new FormData();
            let file = [];
            formData.append('productOwner', user._id)
            formData.append('productDescription', productDescription)
            formData.append('productName', productName)
            formData.append('creationDate', new Date())
            formData.append('productPartNumber', productPartNumber)
            formData.append('productCategory', productCategory)
            formData.append('filamentDropDown', filamentDropDown)
            formData.append('productNozzleTemp', productNozzleTemp)
            formData.append('productBedTemp', productBedTemp)
            formData.append("fitCars", JSON.stringify(fitCarsArr));

            // for (let i = 0 ; i < fitCarsArr.length ; i++) {
            //     formData.append("fitCars", JSON.stringify(fitCarsArr[i]));
            // }

            for (let i = 0 ; i < productPictures.length ; i++) {
                formData.append("productPictures", productPictures[i]);
            }

            for (let i = 0 ; i < productFiles.length ; i++) {
                formData.append("productFiles", productFiles[i]);
            }           

            fetch("/productsRouters/add_product", {
                method: 'Post',
                headers: {h},
                body: formData
              }).then( response => response.json() )
              .then( data => {
                if(data.message !== undefined)
                {
                    alert(data.message);
                    return
                }
                history.push("product/" + data._id);
            }
            )
        };

        // Base64
        const [baseImage, setBaseImage] = useState([]);

        const uploadImage = async (e) => {
        //   const file = e.target.files[1];
          let base64Array = []
          for(let i=0; i<e.target.files.length; i++){
            const base64 = await convertBase64(e.target.files[i]);
            base64Array.push(base64)
          }

        //   const base64 = await convertBase64(file);
        //   const strippedBase64 = base64.replace(/^data:image\/[a-z]+;base64,/, "");
          setBaseImage(base64Array);
        //   console.log(base64Array);
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

        const [selectedFromYear, setSelectedFromYear] = useState("");
        const [toYearOptions, setToYearOptions] = useState([]);

        function handleFromYearChange(event) {
            const fromYear = event.target.value;
            const currentYear = new Date().getFullYear();
            const options = [];
            for (let i=fromYear; i <= currentYear; i++) {
              options.push(<option value={i} key={i}>{i}</option>);
            }
            setToYearOptions(options);
            setSelectedFromYear(fromYear);
            findModel();
          }

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

          
        const [modelFile, setModelFile] = useState(null);
        const [imageFile, setImageFile] = useState(null);
        const [modelError, setModelError] = useState(null);
        const [imageError, setImageError] = useState(null);
        
        const handleModelFileChange = (event) => {
          const file = event.target.files[0];
          const allowedFormats = ['.stl', '.obj', '.zip'];
        
          if (file) {
            const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        
            if (allowedFormats.includes(extension)) {
              setModelFile(file);
              setModelError(null);
            } else {
              setModelFile(null);
              setModelError('Invalid File Format');
            }
          }
        };
        
        const handleImageFileChange = (event) => {
          const file = event.target.files[0];
          const allowedFormats = ['.jpg', '.jpeg', '.png', '.gif'];
        
          if (file) {
            const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        
            if (allowedFormats.includes(extension)) {
              setImageFile(file);
              setImageError(null);
            } else {
              setImageFile(null);
              setImageError('Invalid File Format');
            }
          }
        };
        const isSubmitDisabled = modelFile === null || imageFile === null || modelError !== null || imageError !== null;


  return (
    <div>
        <div className='pageName' style={{borderBottom: "double"}}>
            <h1>
                Upload
            </h1>
        </div>
        {user ? (
            <>
        <div id='signInContainer'>
            <div className='signInInputsContainer'>
                <label>* Product Name</label>
                <br></br>
                <input type={"text"} id='productName'></input>
                <br></br>
                <br></br>

                <label>* Description</label>
                <br></br>
                <textarea type={"text"} id='productDescription'></textarea>
                <br></br>
                <br></br>

                <label>Part Number</label>
                <br></br>
                <input type={"text"} id='productPartNumber'></input>
                <br></br>
                <br></br>
            </div>

            <div className='signInInputsContainer'>
                <label style={{display: "flex"}}>* Upload Your 3D File &nbsp;<InfoPopup text="Only 1 .stl/.obj/.zip file - Max 50Mb" /> </label>
                <input type={"file"} id='productFiles' accept=".obj, .stl, .zip" onChange={handleModelFileChange}></input>
                {modelError && <p style={{ color: 'red' }}>{modelError}</p>}
                <br></br>
                <br></br>

                <label style={{display: "flex"}}>* Pictures &nbsp;<InfoPopup text="Max 6 Images In .png, .jpeg, .jpg, .gif - Max 50Mb per image" /></label>
                {/* <input type={"file"} id='productPictures' accept="image/*" multiple onChange={(e) => {uploadImage(e); handleImageFileChange}}></input> */}
                <input type="file" id="productPictures" accept=".png, .jpeg, .jpg, .gif" multiple onChange={(e) => { uploadImage(e); handleImageFileChange(e); }}></input>
                {imageError && <p style={{ color: 'red' }}>{imageError}</p>}
                <br></br>
                <br></br>
                <div id='selectedPicsContainer'>
                {(() => {
                    let base64ArrayDraw = [];
                    for (let i=0; i < baseImage.length; i++) {
                        base64ArrayDraw.push(<div key={i} className='selectedPics' style={{backgroundImage: `url(${baseImage[i]})`}}></div>);
                    }
                    return base64ArrayDraw;
                })()}
                </div>
            </div>

            <div className='signInInputsContainer'>
                <label>* Category</label>
                <br></br>
                <select id='productCategory'>
                    <option hidden></option>
                    <option>Engine</option>
                    <option>Braking</option>
                    <option>AC</option>
                    <option>Drivetrain</option>
                    <option>Exhaust</option>
                    <option>Interior</option>
                    <option>Exterior</option>
                    <option>Suspension</option>
                    <option>Steering</option>
                    <option>Accessories</option>
                    <option>Tools</option>
                </select>
                <br></br>
                <br></br>

                <label>Filament</label>
                <br></br>
                <select id='filamentDropDown'>
                    <option hidden></option>
                    <option>ABS</option>
                    <option>ASA</option>
                    <option>Nylon</option>
                    <option>PETG</option>
                    <option>PLA</option>
                </select>
                <br></br>
                <br></br>

                <label>Nozzle Temp</label>
                <br></br>
                <input type={"number"} id='productNozzleTemp'></input>
                <br></br>
                <br></br>

                <label>Bed Temp</label>
                <br></br>
                <input type={"number"} id='productBedTemp'></input>
                <br></br>
                <br></br>


            </div>

            <div id='carsInputsContainer' className='signInInputsContainer'>
                <div className='myCarsInput' id='myCarsInput' onClick={() => closeOpenAddCarModal("O")}>
                    <label>* Fit Cars</label>
                    <br></br>
                    <div className='usersCarsDiv' onClick={() => closeOpenAddCarModal("O")}>Add A Car</div>
                    <img src={require('./styling_folder/images/carIcon.png')} alt='Car' className='carIcon' id='carIcon'/>
                </div>
                <div id='customersCars'>
                   {(() => {
                        if(fitCarsArr.length === 0){
                            return <div className='customersCarsDiv'></div>
                        }

                        if(fitCarsArr.length > 0){
                            return fitCarsArr.map((car, i) => {
                                if(isNaN(car.selectedFromYear) && car.selectedToYear === 0){
                                    return <div className='customersCarsDiv' key={i}>
                                    <input className='nonInteractionInputs' placeholder={'All Years - '+ car.selectedBrand +' '+ car.selectedModel}></input>
                                    <img src={require('./styling_folder/images/trashIcon.png')} alt='Delete' className='trashIcon' onClick={() => handleDelete(i)} id={i}/>
                                </div>
                                }

                                if(car.selectedToYear === 0 && car.selectedFromYear > 0 || car.selectedToYear === car.selectedFromYear){
                                    return <div className='customersCarsDiv' key={i}>
                                    <input className='nonInteractionInputs' placeholder={car.selectedFromYear +' '+ car.selectedBrand +' '+ car.selectedModel}></input>
                                    <img src={require('./styling_folder/images/trashIcon.png')} alt='Delete' className='trashIcon' onClick={() => handleDelete(i)} id={i}/>
                                </div>
                                }

                                if(car.selectedToYear > 0 && car.selectedFromYear > 0){
                                    return <div className='customersCarsDiv' key={i}>
                                        <input className='nonInteractionInputs' placeholder={car.selectedFromYear +' - '+ car.selectedToYear +' '+ car.selectedBrand +' '+ car.selectedModel}></input>
                                        <img src={require('./styling_folder/images/trashIcon.png')} alt='Delete' className='trashIcon' onClick={() => handleDelete(i)} id={i}/>
                                    </div>
                                }
                            })
                        }
                   })()}
                </div>
            </div> 
        </div>

        <div className='signInInputsContainer' id='createAnAccountCtn'>
                <button id='createAccountBtn' className='allButtons' onClick={addProduct} disabled={isSubmitDisabled}>Upload</button>
            </div>

        <div id='addCarModalBgc' className='closeModal'>
            <div id='addCarModal'>
                <img src={require('./styling_folder/images/xBtn.png')} alt='X' id='xBtnModal' className='closeModal' onClick={() => closeOpenAddCarModal("X")}/>
                <h2>Add Cars</h2>

            <select id='selectedFromYear' onChange={handleFromYearChange}>
              <option value="" hidden>From Year :</option>
              <option value="All"> All Years</option>
              {(() => {
                let fromYearArr = [];
                for (let i=1920; i <= new Date().getFullYear(); i++) {
                  fromYearArr.push(<option value={i} key={i}>{i}</option>);
                }
                return fromYearArr.reverse();
              })()}
            </select>

            <select id='selectedToYear' disabled={selectedFromYear === "" || selectedFromYear === "All"}>
              <option value="" hidden>To Year :</option>
              {toYearOptions}
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
                <option value=""> All Models </option>
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


        ) : (
            <div>
            <div id='signInContainer'>
            <div className='signInInputsContainer'>
                <label>Product Name</label>
                <br></br>
                <input type={"text"} id='productName'></input>
                <br></br>
                <br></br>

                <label>Description</label>
                <br></br>
                <textarea type={"text"} id='productDescription'></textarea>
                <br></br>
                <br></br>

                <label>Part Number</label>
                <br></br>
                <input type={"text"} id='productPartNumber'></input>
                <br></br>
                <br></br>
            </div>

            <div className='signInInputsContainer'>
                <label>Upload Your 3D File</label>
                <br></br>
                <input type={"file"} id='productFiles' accept=".obj, .stl"></input>
                <br></br>
                <br></br>

                <label>Pictures</label>
                <br></br>
                <input type={"file"} id='productPictures' accept=".png, .jpeg, .jpg" multiple></input>
                <br></br>
                <br></br>

                <label>Car</label>
                <br></br>
                <input type={"text"} id='productFitCars'></input>
                <br></br>
                <br></br>
            </div>

            <div className='signInInputsContainer'>
                <label>Category</label>
                <br></br>
                <select id='productCategory'>
                    <option hidden></option>
                    <option>Engine</option>
                    <option>Braking</option>
                    <option>AC</option>
                    <option>Drivetrain</option>
                    <option>Exhaust</option>
                    <option>Interior</option>
                    <option>Exterior</option>
                    <option>Suspension</option>
                    <option>Steering</option>
                    <option>Accessories</option>
                    <option>Tools</option>
                </select>
                <br></br>
                <br></br>

                <label>Filament</label>
                <br></br>
                <select id='filamentDropDown'>
                    <option hidden></option>
                    <option>ABS</option>
                    <option>ASA</option>
                    <option>Nylon</option>
                    <option>PETG</option>
                    <option>PLA</option>
                </select>
                <br></br>
                <br></br>

                <label>Nozzle Temp</label>
                <br></br>
                <input type={"number"} id='productNozzleTemp'></input>
                <br></br>
                <br></br>

                <label>Bed Temp</label>
                <br></br>
                <input type={"number"} id='productBedTemp'></input>
                <br></br>
                <br></br>


            </div>

            <div id='carsInputsContainer' className='signInInputsContainer'>
                <div className='myCarsInput' id='myCarsInput'>
                    <label>Fit Cars</label>
                    <br></br>
                    <div className='usersCarsDiv'>Add A Car</div>
                    <img src={require('./styling_folder/images/carIcon.png')} alt='Car' className='carIcon' id='carIcon'/>
                </div>
                <div id='customersCars'>

                </div>
            </div>
            <div className='signInInputsContainer' id='createAnAccountCtn'>
                <button id='createAccountBtn' className='allButtons'>Upload</button>
            </div>
        </div>
        <div className='noCommentForYou'>
            <h2>
                Please login in-order to upload
            </h2>
        </div>
        </div>
        )}

    </div>
  )
}
