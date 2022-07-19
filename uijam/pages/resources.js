import SideNav from "../components/SideNav"
import React from "react"
import ReasourcesMain from "../components/Resources"
import axios from "axios"

export default function Resources({ resourceData }) {
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
        <>
            { profileModuleState &&
            <SideNav 
                codeCookie={codeCookie}
                dropdownState={dropdownState}
                changeDropdownStateFunction={changeDropdownStateFunction}
            />
            }
            <ReasourcesMain 
                codeCookie={codeCookie}
                resourceData={resourceData}
                profileModuleState={profileModuleState}
                dropdownState={dropdownState}
                changeDropdownStateFunction={changeDropdownStateFunction}
            />
        </>
    )
}

Resources.getInitialProps = async (context) => {
    const res = await axios.get("https://uijam.herokuapp.com/resources/all")
    const resourceData = res.data

    return {
        resourceData: resourceData
    }
}