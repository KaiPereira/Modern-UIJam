import React from "react"
import axios from "axios"
import SideNav from "../../components/SideNav"
import ProfilePage from "../../components/ProfilePage"

export default function Profile({ params }) {
    const [profileModuleState, profileModuleShow] = React.useState(false)
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

    return (
        <>
            { profileModuleState &&
            <SideNav 
                codeCookie={codeCookie}
                dropdownState={dropdownState}
                changeDropdownStateFunction={changeDropdownStateFunction}
            />
            }
            <ProfilePage 
                codeCookie={codeCookie}
                profileName={params.profileName}
                profileModuleState={profileModuleState}
                dropdownState={dropdownState}
                changeDropdownStateFunction={changeDropdownStateFunction}
            />
        </>
    )
}

Profile.getInitialProps = async (context) => {
    return {
        params: context.query
    }
}