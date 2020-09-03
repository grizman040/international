import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../App'
import { Link } from 'react-router-dom'
import moment from 'moment'
console.log(moment().startOf('day').fromNow());

const Home = () => {
    const [data, setData] = useState([])
    const { state, dispatch } = useContext(UserContext)
    useEffect(() => {
        fetch('/allposts', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                setData(result.posts)
            })
    }, [])
    const likePost = (id) => {
        fetch('/like', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                const newData = data.map(item => {

                    if (item._id == result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }
    const unlikePost = (id) => {
        fetch('/unlike', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                //   console.log(result)
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }

    const makeComment = (text, postId) => {
        fetch('/comment', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId,
                text
            })
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                const newData = data.map(item => {
                    if (item._id == result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }

    const deletePost = (postid) => {
        fetch(`/deletepost/${postid}`, {
            method: "delete",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                const newData = data.filter(item => {
                    return item._id !== result._id
                })
                setData(newData)
            })
    }
    return (
        <div className="home">
            {
                data.map(item => {
                    return (
                        <div className="card home-card" key={item._id}>
                            <h5 style={{ padding: "5px" }}><Link to={item.postedBy._id !== state._id ? "/profile/" + item.postedBy._id : "/profile"}>{item.postedBy.name}</Link> {item.postedBy._id == state._id
                                && <i className="material-icons deleteIcon" style={{
                                    float: "right"
                                }}
                                    onClick={() => deletePost(item._id)}
                                >delete</i>

                            }</h5>
                            <div className="card-image">
                                <img src={item.photo} />
                            </div>
                            <div className="card-content">
                                {item.likes.includes(state._id)
                                    ?
                                    <i className="material-icons likeIcon" style={{ color: "red" }}
                                        onClick={() => { unlikePost(item._id) }}
                                    >favorite</i>
                                    :
                                    <i className="material-icons likeIcon"
                                        onClick={() => { likePost(item._id) }}
                                    >favorite_border</i>
                                }
                                <h6>{item.likes.length} likes</h6>
                                <div className="postBody">
                                    <h6><span className="userName"></span> {item.title}</h6>
                                    <p style={{ fontWeight: "bold" }} >{item.body}</p>
                                </div>

                                {
                                    item.comments.map(record => {
                                        return (
                                            <div key={record._id} className="commentArea">
                                                <p  ><span className="userName">{record.postedBy.name}</span> {record.text}</p>
                                  
                                                
                                            </div>


                                        )

                                    })
                                }
                                <p className="createdAt">{moment(item.createdAt).startOf().fromNow()}</p>

                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    makeComment(e.target[0].value, item._id)
                                }}>
                                    <input type="text" placeholder="add a comment" />
                                </form>
                            </div>
                        </div>
                    )
                })
            }


        </div>
    )
}


export default Home