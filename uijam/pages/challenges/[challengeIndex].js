import { withRouter } from 'next/router'
import React from "react"
import axios from "axios"
import SideNav from "../../components/SideNav"
import Link from "next/link"
import ProfileModule from "../../components/subcomponents/ProfileModule"
import LoginRequiredModal from '../../components/subcomponents/LoginRequiredModal'

function ChallengePage({ router }) {
    const [profileModuleState, profileModuleShow] = React.useState(false)
    const [modalState, changeModalState] = React.useState(false)
    const [challengeData, changeChallengeData] = React.useState()
    const [codeCookie, changeCodeCookie] = React.useState()
    const [dropdownState, changeDropdownState] = React.useState(false)

    function changeDropdownStateFunction() {
        changeDropdownState(!dropdownState)
    }

    React.useEffect(() => {
        if (document.cookie.match(new RegExp('(^| )' + "code" + '=([^;]+)'))) {
            var match = document.cookie.match(new RegExp('(^| )' + "code" + '=([^;]+)'));
            changeCodeCookie(match[2])
        }
        profileModuleShow(true)
    })

    const challengeIndex = parseInt(router.query.challengeIndex)

    React.useEffect(() => {
        axios.get("http://uijam.herokuapp.com/challenges/all")
            .then(data => changeChallengeData(data.data[challengeIndex]))
    }, [challengeIndex])

    function openPopup() {
        changeModalState(true)
    }

    function closePopup() {
        changeModalState(false)
    } 

    return (
        <>
            {
                challengeData &&
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
                        <div className="challengeInformation">
                            <div className="challengeInfoWithoutRequirements">
                                <img src={challengeData.image} className="challengeImage" alt="challenge thumbnail" />
                                <div className="challengeInfo">
                                    <div className="challengeDifficulty" style={{color: challengeData.difficulty == "easy" ? "#6CBF58" : challengeData.difficulty == "normal" ? "#BFB558" : challengeData.difficulty == "hard" ? "#BF9058" : "#BF5858", borderColor: challengeData.difficulty == "easy" ? "#6CBF58" : challengeData.difficulty == "normal" ? "#BFB558" : challengeData.difficulty == "hard" ? "#BF9058" : "#BF5858"}}>{challengeData.difficulty.toUpperCase()}</div>
                                    <h1>{challengeData.header}</h1>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ac efficitur In ac efficitur felis, non ullamcorper est. Curabitur lacinia urna ac sapien posuere </p>
                                    {
                                        codeCookie ?
                                        <Link href={{
                                            pathname: "[index]/submit",
                                            query: { index: router.query.challengeIndex}
                                        }}>
                                            <div className="challengeSubmit">
                                                <a>
                                                    <button>Submit Solution</button>
                                                </a>
                                            </div>
                                        </Link>
                                        :
                                        <button className="challengeSubmit" onClick={openPopup}>
                                            <a>
                                                <button>Submit Solution</button>
                                            </a>
                                        </button>
                                    }
                                </div>
                            </div>
                            <div className="requirements">
                                <h2>Requirements</h2>
                                <ul>
                                    {challengeData.requirements.map((data, index) => {
                                        return (
                                            <li key={index}>{data}</li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </div>    
                    </main>
                </>
            }
        </>
    )
}


  export default withRouter(ChallengePage)