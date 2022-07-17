import SettingsMain from "../components/Settings"
import SideNav from "../components/SideNav"
import React from "react"

export default function Settings() {
    const [codeCookie, changeCodeCookie] = React.useState()
    const [profileModuleState, profileModuleShow] = React.useState(false)
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
        <>{ codeCookie && <>
            <SideNav 
                codeCookie={codeCookie}
                dropdownState={dropdownState}
                changeDropdownStateFunction={changeDropdownStateFunction}
            />
            <SettingsMain 
                codeCookie={codeCookie}
                profileModuleState={profileModuleState}
                dropdownState={dropdownState}
                changeDropdownStateFunction={changeDropdownStateFunction}
            />
        </>}</>
    )
}