import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App'
import { useParams } from 'react-router-dom'
const Profile = () => {
    const [userProfile, setProfile] = useState(null)

    const { state, dispatch } = useContext(UserContext)
    const { userid } = useParams()
    const [showFollow, setShowFollow] = useState(state ? !state.following.includes(userid) : true)
    // console.log('testing user ' + userid);

    useEffect(() => {
        fetch(`/user/${userid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                //    console.log(result)

                setProfile(result)
            })
    }, [userid])
    const followUser = () => {
        fetch('/follow', {
            method: 'PUT',
            headers: {
                "Content-type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                followId: userid
            })



        }).then(res => res.json())
            .then(data => {

                // console.log(data);
                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
                localStorage.setItem("user", JSON.stringify(data))
                setProfile((prevState) => {
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: [...prevState.user.followers, data._id]
                        }
                    }
                })
                setShowFollow(false)

            })
    }
    const unFollowUser = () => {
        fetch('/unfollow', {
            method: 'PUT',
            headers: {
                "Content-type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                unfollowId: userid
            })



        }).then(res => res.json())
            .then(data => {

                console.log(data);
                dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
                localStorage.setItem("user", JSON.stringify(data))

                setProfile((prevState) => {
                    const newFollower = prevState.user.followers.filter(item => item !== data._id)
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: newFollower
                        }
                    }
                })
                setShowFollow(true)


            })
    }


    return (
        <>
            {userProfile ?
                <div className="profilePage">
                    <div style={{
                        display: "flex",
                        justifyContent: "space-around",
                        margin: "18px 0px",
                        borderBottom: "1px solid grey"
                    }}>
                        <div>
                            <img style={{ width: "160px", height: "160px", borderRadius: "80px" }}
                                src={userProfile.user.pic}
                            />
                        </div>
                        <div>
                            <div style={{
                                display:"flex",
                                justifyContent:"space-around"
                            }}>
                                <h4>{userProfile.user.name}</h4>
                                <img className="flagCountryProfile" src={`https://www.countryflags.io/${state ? state.country : ""}/shiny/64.png`} />

                            </div>
                            <h5>{userProfile.user.email}</h5>
                            <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
                                <h6>{userProfile.posts.length} posts</h6>
                                <h6>{userProfile.user.followers.length} followers</h6>
                                <h6>{userProfile.user.following.length} following</h6>
                            </div>
                            {showFollow ?
                                <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
                                    onClick={() => followUser()}
                                >
                                    Follow
          </button>
                                :
                                <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
                                    onClick={() => unFollowUser()}
                                >
                                    Unfollow
            </button>


                            }





                        </div>
                    </div>

                    <div className="gallery">
                        {
                            userProfile.posts.map(item => {
                                return (
                                    <img key={item._id} className="items" src={item.photo} alt={item.title} />
                                )
                            })
                        }


                    </div>
                </div>


                : <h2>loading...!</h2>}

        </>
    )
}


export default Profile