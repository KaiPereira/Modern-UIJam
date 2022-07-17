import axios from "axios";
import SideNav from "../../components/SideNav"
import React from "react"
import CommentCard from "../../components/CommentCard"
import Router from "next/router";
import ProfileModule from "../../components/subcomponents/ProfileModule"
import LoginRequiredModal from "../../components/subcomponents/LoginRequiredModal";
import Link from "next/link"

export default function SpecificSolution({ solutionData, solutionIndex }) {
    const [disabled, setDisabled] = React.useState(false);
    const [modalState, changeModalState] = React.useState(false)
    const [codeCookie, changeCodeCookie] = React.useState()
    const [likes, changeLikes] = React.useState(solutionData.likes)
    const [likeFilled, changeLikeFilled] = React.useState()
    const [commentBody, changeCommentBody] = React.useState()
    const [allSolutionCommends, changeAllComments] = React.useState(solutionData.comments)
    const [peopleWhoLiked, changePeopleWhoLiked] = React.useState(solutionData.peopleWhoLiked)
    const [jwtPayload, changeJwtPayload] = React.useState()
    const [profileData, changeProfileData] = React.useState()
    const [profileModuleState, profileModuleShow] = React.useState(false)
    const [dropdownState, changeDropdownState] = React.useState(false)

    function changeDropdownStateFunction() {
        changeDropdownState(!dropdownState)
    }

    React.useEffect(() => {
        if (document.cookie.match(new RegExp('(^| )' + "code" + '=([^;]+)'))) {
            var match = document.cookie.match(new RegExp('(^| )' + "code" + '=([^;]+)'));
            changeCodeCookie(match[2])
            axios.post("http://localhost:5000/authentication/parse-jwt", {
                jwt: match[2]
            })
            .then(data => {
                changeLikeFilled(solutionData.peopleWhoLiked.includes(data.data.username))
                changeJwtPayload(data.data.username)
            })
        }
        axios.post("http://localhost:5000/profiles/profile", {
            githubName: solutionData.authorGithub
        })
        .then(profile => changeProfileData(profile.data[0]))

        profileModuleShow(true)
    }, [])

    async function modifyLikes() {
        if (codeCookie) {
            // Set disabled is use to stop people from spamming the button
            setDisabled(true)

            // Grab the username from your jwt and use it to check if you are in the peopleWhoLiked
            await axios.post("http://localhost:5000/authentication/parse-jwt", {
                jwt: codeCookie
            })
            .then(async data => {
                // Update the likes with the updateLike route
                await axios.patch("http://localhost:5000/solutions/updateLike", {
                    id: solutionData._id
                }, {
                    headers: {
                        Authorization: `Bearer ${codeCookie}`
                    }
                })
                .then(() => {
                    // Just for decorational purpose so the user does not need to reload the page!
                    if (peopleWhoLiked.includes(data.data.username)) {
                        changeLikes(prevState => prevState - 1)
                        changeLikeFilled(!likeFilled)
                        changePeopleWhoLiked(prevState => prevState.filter(person => person !== data.data.username))
                    } else {
                        changePeopleWhoLiked(prevState => [...prevState, data.data.username])
                        changeLikes(prevState => prevState + 1)
                        changeLikeFilled(!likeFilled)
                    }
                })
            })
            setDisabled(false)
        } else {
            // If there is no user logged in turn the modal on!
            changeModalState(true)
        }
    }

    function commentBodyChange(event) {
        changeCommentBody(event.target.value)
    }

    let allComments = allSolutionCommends.map((comment, index) => {
        return (
            <CommentCard 
                commentDate={comment.commentDate}
                authorGithub={comment.authorGithub}
                commentBody={comment.commentBody}
                codeCookie={codeCookie}
                id={comment._id}
                solutionId={solutionData._id}
                key={index}
            />
        )
    })

    function addComment(e) {
        if (codeCookie) {
            axios.post("http://localhost:5000/authentication/parse-jwt", {
                jwt: codeCookie
            })
            .then(jwtPayload => {
                axios.post("http://localhost:5000/profiles/profile", {
                    githubName: jwtPayload.data.username
                })
                .then(profile => {

                    axios.patch("http://localhost:5000/solutions/addComment", {
                        id: solutionData._id,
                        commentBody: commentBody
                    }, {
                        headers: {
                            Authorization: `Bearer ${codeCookie}`
                        },
                    })
                    .then(data => {
                        // request data again and basically refresh comments
                        Router.reload();
                    })
                })
            })
        } else {
            changeModalState(true)
        }

        document.getElementById("specificSolutionDiscussionForm").reset()
        e.preventDefault()
        
    }

    function closePopup() {
        changeModalState(false)
    }
    
    function deleteSolution() {
        axios.patch("http://localhost:5000/solutions/delete", {
            id: solutionData._id
        }, {
            headers: {
                Authorization: `Bearer ${codeCookie}`
            }
        })

        window.location.href = "http://localhost:3000/solutions"
    }
    
    return (
        <>
            <LoginRequiredModal 
                modalState={modalState}
                closePopup={closePopup}
            />
            { profileModuleState &&
            <SideNav 
                codeCookie={codeCookie}
                dropdownState={dropdownState}
                changeDropdownStateFunction={changeDropdownStateFunction}
            />
            }
            { profileData &&
            <main onClick={dropdownState ? changeDropdownStateFunction : undefined}>
                { profileModuleState ?
                <ProfileModule 
                    codeCookie={codeCookie}
                    dropdownState={dropdownState}
                    changeDropdownStateFunction={changeDropdownStateFunction}
                />
                :
                <div className="profileModulePlaceholderContainer"></div>
                }
                <div className="specificSolutionMainAlign">
                    <div className="specificSolutionMain">
                        <div className="specificSolutionAccountDetails">
                            <div className="solutionCardPersonalInfo">
                                <div className="solutionCardPersonalInfoImage">
                                    <Link href={`/profile/${solutionData.authorGithub}`}>
                                        <img src={profileData.avatar} alt="solution person's avatar" />
                                    </Link>
                                </div>
                                <div className="solutionCardPersonalInfoName">
                                    <div className="solutionCardProfileInfo">
                                        <p className="solutionCardProfileName">{profileData.name}</p>
                                        <p className="solutionCardProfileDetailSeperation">•</p>
                                        <p className="solutionCardProfilePoints">{profileData.points}</p>
                                    </div>
                                    <p className="solutionCardDate">{solutionData.date}</p>
                                </div>
                            </div>
                            <button onClick={modifyLikes} className="specificSolutionLikesAlign" disabled={disabled}>
                                {likeFilled ? <i className="fa-solid fa-heart"></i> : <i className="fa-regular fa-heart"></i>}
                                <p>{likes}</p>
                            </button>
                        </div>
                        { solutionData.authorGithub == jwtPayload &&
                        <div className="specificSolutionModificationsAlign">
                                <div className="commentModification">
                                    <Link href={`/solutions/${solutionIndex}/edit`}>
                                        <div className="commentModificationCard">
                                            <i className="fa-regular fa-pen-to-square"></i>
                                        </div>
                                    </Link>
                                    <div className="commentModificationCard" onClick={deleteSolution}>
                                        <i className="fa-solid fa-x"></i>
                                    </div>
                                </div>
                        </div>
                        }
                        <img src={solutionData.thumbnail} className="specificSolutionThumbnail" />
                        <div className="specificSolutionButtonsAlign">
                            <div className="specificSolutionButtons">
                                <div className="specificSolutionButtonSite">
                                    <a href={solutionData.site} target="_blank" rel="noreferrer">
                                        <button>Live Site</button>
                                    </a>
                                </div>
                                <a href={solutionData.repository} className="specificSolutionButtonGithub" target="_blank" rel="noreferrer">
                                    <button>View Code</button>
                                </a>
                            </div>
                        </div>
                        <div className="specificSolutionDiscussion">
                            <div className="specificSolutionDiscussionSeperationAlign">
                                <div className="specificSolutionSeperation"></div>
                            </div>
                            <h1>Discussion</h1>
                            <form id="specificSolutionDiscussionForm" className="specificSolutionDiscussionForm" onSubmit={addComment}>
                                <textarea placeholder="Start Writing..." onChange={commentBodyChange}></textarea>
                                <button>
                                    <p>Comment</p>
                                </button>
                            </form>
                            {allComments}
                        </div>
                    </div>
                </div>
            </main>
            }
        </>
    )
}

SpecificSolution.getInitialProps = async (context) => {
    const res = await axios.get("http://localhost:5000/solutions/all")
    const solutionData = await res.data[parseInt(context.query.solutionIndex)]

    return { 
      solutionData: solutionData,
      solutionIndex: context.query.solutionIndex
    };
  };