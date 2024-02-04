import React, {useState} from "react";
import { userContext, productsContext } from "./GlobalVars";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SiteNav from "./SiteNav";
import SearchBar from "./SearchBar";
import MainPage from "./MainPage";
import FooterCopyRights from "./FooterCopyRights";
import CategoryPage from "./CategoryPage";
import ProductPage from "./ProductPage";
import LoginPage from "./LoginPage";
import SignInPage from "./SignInPage";
import AddProductPage from "./AddProductPage";
import MyUploadsPage from "./MyUploadsPage";
import EditUploadPage from "./EditUploadPage";
import AboutPage from "./AboutPage";
import ContactPage from "./ContactPage";
import SupportUsPage from "./SupportUsPage";
import UnauthorizedPage from "./UnauthorizedPage";
import EditProfile from "./EditProfile";
import NotFound from "./NotFound";
import CarsList from "./CarsList";

document.title = "Project Cars - 3D";

function App() {

  const [user, setUser] = useState(null)
  const [searchResulst, setSearchResults] = useState([])

  return (
    <>
    <Router>
      <userContext.Provider value={{user, setUser}}>
      <productsContext.Provider value={{searchResulst, setSearchResults}}>
      <SiteNav/>
      <Switch>
        <Route exact path={"/401_unauthorized"}> <UnauthorizedPage/> </Route>
        <Route exact path={"/login"}> <LoginPage/> </Route>
        <Route exact path={"/sign_in"}> <SignInPage/> </Route>
        <Route exact path={"/"}>
          <SearchBar/>
          <MainPage/>
        </Route>
        
        <Route exact path={"/search_results/:typeText/:textId/:category"}>
          <SearchBar/>
          <CategoryPage/>
        </Route>

        <Route exact path="/search_results/:typeText/:carBrand/:carModel/:carYear/:category">
          <SearchBar />
          <CategoryPage />
        </Route>

        <Route exact path={"/product/:productId"}>
          <SearchBar/>
          <ProductPage/>
        </Route>

        <Route exact path={"/add_a_product"}>
          <AddProductPage/>
        </Route>

        <Route exact path={"/my_uploads"}>
          <MyUploadsPage/>
        </Route>

        <Route exact path={"/edit_upload/:productId"}>
          <EditUploadPage/>
        </Route>

        <Route exact path={"/edit_profile"}>
          <EditProfile/>
        </Route>

        <Route exact path={"/about_us"}>
          <AboutPage/>
        </Route>

        <Route exact path={"/contact_us"}>
          <ContactPage/>
        </Route>

        <Route exact path={"/support_us"}>
          <SupportUsPage/>
        </Route>

        <Route component={NotFound} />

      </Switch>
      <FooterCopyRights/>
      </productsContext.Provider>
      </userContext.Provider>
      
    </Router>
    </>
  )
}

export default App;