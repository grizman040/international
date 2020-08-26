import React, { useEffect, useState, useContext } from "react";
import { UserContext } from '../../App'

const Profile = () => {
  const [myPics, setPics] = useState([])
  const { state, dispatch } = useContext(UserContext)
  const [image, setImage] = useState("")
  // const [url, setUrl] = useState(undefined)
  useEffect(() => {
    fetch("/mypost", {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    })
      .then(res => res.json())
      .then(result => {
        console.log(result);
        setPics(result.mypost)


      })


  }, [])
  useEffect(()=>{
    if(image){
     const data = new FormData()
     data.append("file",image)
     data.append("upload_preset","insta-clone")
     data.append("cloud_name", "dqpxnyjss")
     fetch("https://api.cloudinary.com/v1_1/dqpxnyjss/image/upload",{
       method:"post",
       body:data
     })
     .then(res=>res.json())
     .then(data=>{
 
    
        fetch('/updatepic',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                pic:data.url
            })
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
            dispatch({type:"UPDATEPIC",payload:result.pic})
            // window.location.reload()
        })
    
     })
     .catch(err=>{
         console.log(err)
     })
    }
 },[image])
  const updatePhoto = (file) => {
    setImage(file)
  } 


  // console.log(state);  
  return (
    <div className="profilePage">
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "10px auto",
          borderBottom: "1px solid #c5c4c4",
        }}
      >

        <div>
          <img
            style={{ width: "200px", height: "200px", borderRadius: "50%" }}
            src={state? state.pic:""} alt=""
          />
          <div>

            <div className="file-field input-field">
              <div className="btn">
                <span>Update Avatar</span>
                <input type="file"
                  onChange={(e) => updatePhoto(e.target.files[0])} />
              </div>
              <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
              </div>
            </div>

          </div>

        </div>

        <div>
          <div>
            <h3>{state ? state.name : "loading"}</h3>
            <h5>{state ? state.email : "loading"}</h5>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "108%",
              }}

            >

              <h6>{myPics.length} posts</h6>
              <h6>{state? state.followers.length:"0"} followers</h6>
              <h6>{state?state.following.length:"0"} following</h6>
            </div>
          </div>
        </div>

      </div>
      <div className="gallery">

        {
          myPics.map(item => {
            return (
              <img key={item._id} className="items" src={item.photo} alt={item.title} />
            )

          })

        }
      </div>
    </div>
  );
};
export default Profile;
