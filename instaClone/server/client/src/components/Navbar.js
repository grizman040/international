import React, { useState,useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";

const Navbar = () => {

  const { state, dispatch } = useContext(UserContext)
  const history = useHistory()
  const renderList = () => {
    if (state) {
      return [
        <li style= {{textTransform:"capitalize" }}><Link to="/profile"> {state.name}</Link></li>,
        <li ><Link to="/create">Create Dish</Link></li>,
        <li ><Link to='/myfollowerspost'>My Following Cookers</Link></li>,
      // <li style={{color:"black", textTransform:"capitalize" }}> {state.name} </li>,
        <li>
          <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
            onClick={() => {localStorage.clear()
            dispatch({type:"CLEAR"})
            history.push('/signin')
          }}
          >
            LogOut
            </button>
        </li>
     


      ]
    } else {
      return [

        <li><Link to="/signin">Sign In</Link></li>,
        <li><Link to="/signup">Sign Up</Link></li>
      ]

    }
  }

  return (
    <nav>
      <div className="nav-wrapper white" >
        <Link to={state ? "/" : "/signin"} className="brand-logo left">International Cooking</Link>
        <ul id="nav-mobile" className="right hide-on-med-and-down">

          {renderList()}

        </ul>
      </div>
    </nav>
  )
}
export default Navbar