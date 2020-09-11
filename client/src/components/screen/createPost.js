import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import M from "materialize-css";
import { CountryDropdown} from 'react-country-region-selector';



const CreatePost = () => {
  const history = useHistory()
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [image,setImage] = useState("")
  const [ country, setCountry ] = useState("")
  // const [url, setUrl] = useState("")
  const postDetails = ()=>{
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
      // console.log(data);
      fetch("/createpost", {
        method: "post",
        headers: {
  
            "Content-Type": "application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body: JSON.stringify({
            title,
            body,
            photo:data.url,
            country
        })
    }).then(res => res.json())
    
        .then(data => {
          // console.log(data);
            if (data.error) {
                M.toast({ html: data.error, classes: "#ef5350 red lighten-1" })
            }
            else {
             
              M.toast({ html: "Post created", classes: "#ef5350 red lighten-1" })
                history.push('/')
            }
        }).catch(err=>{
            console.log(err);
       
  
      }) 
    })
    .catch(err=>{
      console.log(err);
    })
    

  }
  return (
    <div
      className="card input filled"
      style={{
        maxWidth: "500px",
        margin: " 30px auto",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <input type="text"
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input type="text"
        placeholder="body"
        value={body}
        onChange={(e) => setBody(e.target.value)} />

      <div className="file-field input-field">
        <div className="btn">
          <span>Upload Image</span>
          <input type="file" 
          onChange={(e)=>setImage(e.target.files[0])}/>
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      <div>
        <CountryDropdown
          value={country}
          valueType="short"
          onChange={(val) => setCountry(val)} />
        {/* <RegionDropdown
          country={country}
          value={region}
          onChange={(val) => this.selectRegion(val)} /> */}
      </div>
      
      <button className="btn waves-effect waves-light #42a5f5 blue darken-1"
      onClick={(e)=>postDetails()}>
        Submit post
          </button>

    </div>
  );
};

export default CreatePost;
