import Link from "next/link"
import React from "react"
import axios from "axios"

export default function ProfileModule(props) {
    const [profileData, changeProfileData] = React.useState()
    const [profileModuleState2, changeProfileModule2] = React.useState(false)

    function logoutUser() {
        document.cookie = "code=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
        window.location.reload()
    }

    React.useEffect(() => {
        if (props.codeCookie) {
            axios.post("http://uijam.herokuapp.com/authentication/parse-jwt", {
                jwt: props.codeCookie
            })
            .then(payloadData => {
                axios.post("http://uijam.herokuapp.com/profiles/profile", {
                    githubName: payloadData.data.username
                })
                .then(profile => {
                    changeProfileData(profile.data[0])
                    changeProfileModule2(true)
                })
            })
        } else {
            changeProfileModule2(true)
        }
    }, [])

    return (
        <>{ profileModuleState2 ?
       <>
        { !profileData ?
            <div className="loginButtonAlign loginButtonAlignMain">
                <svg viewBox="0 0 31 26" fill="none" xmlns="http://www.w3.org/2000/svg" className="navFriesMenu" onClick={props.changeDropdownStateFunction}>
                    <rect width="31" height="5" rx="2.5" fill="white" className="navFriesRect1"/>
                    <rect y="11" width="23" height="5" rx="2.5" fill="white" className="navFriesRect2"/>
                    <rect y="21" width="31" height="5" rx="2.5" fill="white" className="navFriesRect3"/>
                </svg>
                <a href="https://github.com/login/oauth/authorize?client_id=cae64f03f1ded6b7c2f8">
                    <button>Login</button>
                </a>
            </div>
            :
            <div className="profileAlign">
                <svg viewBox="0 0 31 26" fill="none" xmlns="http://www.w3.org/2000/svg" className="navFriesMenu" onClick={props.changeDropdownStateFunction}>
                    <rect width="31" height="5" rx="2.5" fill="white" className="navFriesRect1"/>
                    <rect y="11" width="23" height="5" rx="2.5" fill="white" className="navFriesRect2"/>
                    <rect y="21" width="31" height="5" rx="2.5" fill="white" className="navFriesRect3"/>
                </svg>
                <div className="profileRing">
                    <img src={profileData.avatar} alt="profile avatar" />
                    <div className="profileDropdownAlign">
                        <div className="profileDropdown">
                            <div className="profileDropdownOverflowControl">
                                <Link href={`/profile/${profileData.githubName}`}>
                                    <div className="profileDropdownElement">
                                        <i className="fa-regular fa-user"></i>
                                        <p>Profile</p>
                                    </div>
                                </Link>
                                <Link href="/settings">
                                    <div className="profileDropdownElement">
                                        <i className="fa-solid fa-gear"></i>
                                        <p>Settings</p>
                                    </div>
                                </Link>
                                <button className="profileDropdownElement" onClick={logoutUser}>
                                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                                    <p>Logout</p>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            }
       </> 
       : 
       <div className="profileModulePlaceholderContainer"></div>
       }</>
    )
}