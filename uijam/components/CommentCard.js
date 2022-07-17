import React from "react"
import axios from "axios"
import Link from "next/link"

export default function CommentCard(props) {
    const [jwtGithubName, changeJwtGithubName] = React.useState()
    const [editMode, changeEditMode] = React.useState(false)
    const [editInput, changeEditInput] = React.useState()
    const [commentBody, changeCommentBody] = React.useState(props.commentBody)
    const [deletedStatus, changeDeletedStatus] = React.useState(false)
    const [authorDetails, changeAuthorDetails] = React.useState()
    
    
    if (props.codeCookie) {
        axios.post("http://localhost:5000/authentication/parse-jwt", {
            jwt: props.codeCookie
        })
        .then(data => changeJwtGithubName(data.data.username))
    }
    
    React.useEffect(() => {
        axios.post("http://localhost:5000/profiles/profile", {
            githubName: props.authorGithub
        })
        .then(profile => changeAuthorDetails(profile.data[0]))
    }, [])

    function deleteComment() {
        axios.patch("http://localhost:5000/solutions/deleteComment", {
            commentId: props.id,
            id: props.solutionId
        }, {
            headers: {
                Authorization: `Bearer ${props.codeCookie}`
            }
        })
        changeDeletedStatus(true)
    }

    function editComment() {
        changeEditMode(!editMode)
    }

    function submitEdits(e) {
        axios.patch("http://localhost:5000/solutions/updateComment", {
            solutionId: props.solutionId,
            commentId: props.id,
            commentBody: editInput
        }, {
            headers: {
                Authorization: `Bearer ${props.codeCookie}`
            }
        })
        .then(data => {
            changeCommentBody(editInput)
            changeEditMode(false)
        })

        e.preventDefault()
    }

    function changeEditInputValue(event) {
        changeEditInput(event.target.value)
    }

    return (
        <>{ authorDetails &&
        <>
        { !deletedStatus &&
        <div className="commentCard">
            { props.solutionThumbnail &&
            <div className="commentCardChallenge">
                <div className="commentCardChallengeInfo">
                    <img src={props.solutionThumbnail} className="commentCardChallengeThumbnail" />
                    <div className="commentCardChallengeInfoInfo">
                        <p className="commentCardChallengeInfoHeader">{props.title}</p>
                        <div className="commentCardChallengeDifficulty" style={{color: props.difficulty == "easy" ? "#6CBF58" : props.difficulty == "normal" ? "#BFB558" : props.difficulty == "hard" ? "#BF9058" : "#BF5858", borderColor: props.difficulty == "easy" ? "#6CBF58" : props.difficulty == "normal" ? "#BFB558" : props.difficulty == "hard" ? "#BF9058" : "#BF5858"}}>{props.difficulty.toUpperCase()}</div>
                    </div>
                </div>
                <div className="commentCardChallengeSeeMoreAlign">
                    <Link href={`/solutions/${props.link}`}>
                        <div className="commentCardChallengeSeeMoreTextAlign">
                            <p>See More</p>
                            <i className="fa-solid fa-angle-right"></i>
                        </div>
                    </Link>
                </div>
            </div>
            }
            <div className="specificSolutionAccountDetails">
                <div className="solutionCardPersonalInfo">
                    <div className="solutionCardPersonalInfoImage">
                        <Link href={`/profile/${props.authorGithub}`}>
                            <img src={authorDetails.avatar} alt="comment person's avatar" />
                        </Link>
                    </div>
                    <div className="solutionCardPersonalInfoName">
                        <div className="solutionCardProfileInfo">
                            <p className="solutionCardProfileName">{authorDetails.name}</p>
                            <p className="solutionCardProfileDetailSeperation">•</p>
                            <p className="solutionCardProfilePoints">{authorDetails.points}</p>
                        </div>
                        <p className="solutionCardDate">{props.commentDate}</p>
                    </div>
                </div>
                { props.authorGithub == jwtGithubName &&
                <div className="commentModification">
                    <div className="commentModificationCard" onClick={editComment}>
                        <i className="fa-regular fa-pen-to-square"></i>
                    </div>
                    <div className="commentModificationCard" onClick={deleteComment}>
                        <i className="fa-solid fa-x"></i>
                    </div>
                </div>
                }
            </div>
            { editMode ?
                <form className="commentCardEditBodyAlign" onSubmit={submitEdits}>
                    <textarea className="commentCardEditBody" onChange={changeEditInputValue}>{commentBody}</textarea>
                    <div className="commentCardEditSubmitAlign">
                        <button type="button" onClick={editComment}>
                            <p><i className="fa-solid fa-x"></i></p>
                        </button>
                        <button>
                            <p>Submit <span>Changes</span></p>
                        </button>
                    </div>
                </form> 
            :
                <p className="commentCardBody">
                    {commentBody}
                </p>
            }
        </div>
        }
        </>
        }</>
    )
}