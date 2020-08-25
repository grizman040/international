import React, { useEffect, createContext,useReducer,useContext } from 'react';
import Navbar from './components/Navbar';
import "./App.css";
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom'
import Profile from './components/screen/Profile';
import Home from './components/screen/Home';
import SignIn from './components/screen/SignIn';
import SignUp from './components/screen/SignUp';
import CreatePost from './components/screen/createPost';
import {reducer, initialState} from './reducers/userReducer';
import UserProfile from "./components/screen/UserProfile";
import SubscribeUserPost from "./components/screen/SubscribeUserPost";

export const UserContext = createContext()


const Routing = () => {
  const history = useHistory()
  const {state,dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user =JSON.parse(localStorage.getItem("user"))
if(user){
  dispatch({type:"USER", payload: user})
  // history.push('/')

}else{
  history.push('/signin')
}
  },[])
  return (
    <Switch >
      <Route exact path='/'>
        <Home />
      </Route>
      <Route path='/signin'>
        <SignIn />
      </Route>
      <Route path='/signup'>
        <SignUp />
      </Route>
      <Route exact path='/profile'>
        <Profile />
      </Route>
      <Route path='/profile/:userid'>
        <UserProfile />
      </Route>
      <Route path='/create'>
        <CreatePost />
      </Route>
      <Route path='/myfollowerspost'>
        <SubscribeUserPost />
      </Route>
    </Switch>

  )
}

function App() {
  const[state,dispatch]= useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
      <Navbar />
<Routing />


    </BrowserRouter>
     </UserContext.Provider> 
  )
}

export default App;
