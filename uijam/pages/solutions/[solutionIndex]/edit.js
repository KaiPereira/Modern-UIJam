import axios from "axios"
import React from "react"
import SideNav from "../../../components/SideNav"
import ProfileModule from "../../../components/subcomponents/ProfileModule"

export default function EditSolution({urlParams}) {
    const [showError, changeShowError] = React.useState(false)
    const [profileModuleState, profileModuleShow] = React.useState(false)
    const [codeCookie, changeCodeCookie] = React.useState()
    const [solutionData, changeSolutionData] = React.useState()
    const [previewImage, changePreviewImage] = React.useState()
    const [formElements, changeFormElements] = React.useState({
        repo: "",
        site: "",
        preview: ""
    })
    const [dropdownState, changeDropdownState] = React.useState(false)

    function changeDropdownStateFunction() {
        changeDropdownState(!dropdownState)
    }

    React.useEffect(() => {
        if (document.cookie.match(new RegExp('(^| )' + "code" + '=([^;]+)'))) {
            var match = document.cookie.match(new RegExp('(^| )' + "code" + '=([^;]+)'));
            changeCodeCookie(match[2])
        }
        axios.get("http://localhost:5000/solutions/all")
            .then(solutions => {
                changeSolutionData(solutions.data[urlParams.solutionIndex])
                changeFormElements(prevState => {
                    return {
                        ...prevState,
                        repo: solutions.data[urlParams.solutionIndex].repository,
                        site: solutions.data[urlParams.solutionIndex].site,
                        preview: solutions.data[urlParams.solutionIndex].thumbnail
                    }
                })
                changePreviewImage(solutions.data[urlParams.solutionIndex].thumbnail)
            })
        profileModuleShow(true)
    }, [])


    function updateImageDisplay(input) {
        const reader = new FileReader();
        const file = input.target.files[0];
        reader.readAsDataURL(file);
        reader.addEventListener('load', (event) => {
            // Get the file size
            fetch(event.target.result)
                .then(result => result.blob())
                .then(fileData => {
                    if (fileData.size > 500000) {
                        // If the file size is bigger 500 000 bytes then show error
                        changeShowError(true)
                    } else {
                        // If bytes is not bigger than 500 000 bytes than add it to settings and get rid of error
                        changeFormElements(prevState => ({
                            ...prevState,
                            preview: event.target.result
                        }))
                        changePreviewImage(event.target.result)
                        changeShowError(false)
                    }
                    
                })
        });
    }

    function formElementChange(event) {
        changeFormElements(prevState => {
            return {
                ...prevState,
                [event.target.name]: event.target.value
            }
        })
    }

    function updateSolution(e) {
        axios.patch("http://localhost:5000/solutions/update", {
            id: solutionData._id,
            site: formElements.site,
            respository: formElements.repo,
            preview: formElements.preview,
            url: solutionData.thumbnail
        }, {
            headers: {
                Authorization: `Bearer ${codeCookie}`
            }
        })
        // window.location.href="http://localhost:3000/solutions"
    }
    

    return (
        <>
            { profileModuleState &&
            <SideNav 
                codeCookie={codeCookie}
                dropdownState={dropdownState}
                changeDropdownStateFunction={changeDropdownStateFunction}
            />
            }
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
                { codeCookie ?
                <div className="submitChallenge">
                    <h1>Update Solution</h1>
                    <form className="submitChallengeForm" onSubmit={updateSolution}>
                        <input type="url" placeholder="Github Repository" onChange={formElementChange} name="repo" value={formElements.repo} required/>
                        <input type="url" placeholder="Live Site" onChange={formElementChange} name="site" value={formElements.site} required/>
                        <div className="submitChallengeFormThumbnailAlign">
                            <label htmlFor="challengeFileSubmit">
                                {
                                    previewImage ?
                                    <img src={previewImage} className="solutionPreviewImage"/> 
                                    :
                                    <p>Screenshot</p>
                                }
                                <input type="file" accept=".jpg, .png, .webp" id="challengeFileSubmit" onChange={updateImageDisplay} />
                            </label>
                            { showError &&
                            <div className="settingsImageErrorMessage">
                                <i className="fa-solid fa-triangle-exclamation"></i>
                                <p>Error: File must be less than 500 KB</p>
                            </div>
                            }
                        </div>
                        <button className="submitChallenegButton">
                            <a>
                                <div>
                                    Submit
                                </div>
                            </a>
                        </button>
                    </form>
                </div>
                : 
                <div className="submitChallengeErrorAlign">
                    <h1>Oooops!</h1>
                    <p className="submitChallengeErrorDescription">It seems like you need to be logged in to be able to edit this solution</p>
                    <a href="https://github.com/login/oauth/authorize?client_id=cae64f03f1ded6b7c2f8">
                        <p>Login</p>
                    </a>
                </div>
                }
            </main>
        </>
    )
}

EditSolution.getInitialProps = async (context) => {
    return {
        urlParams: context.query
    }
}