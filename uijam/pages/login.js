import axios from "axios"
import React from "react"

export default function LoginRedirect({ profileData }) {
    React.useEffect(() => {
        if (typeof window !== "undefined") {
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const page_type = urlParams.get('code')
        
            axios.post("https://uijam.herokuapp.com/authentication/authenticate", {code: page_type})
                .then(data => {
                    document.cookie = `code=${data.data.jwtToken}`

                    axios.post("https://uijam.herokuapp.com/authentication/join", {githubData: data.data.extraData})
                        .then(data => console.log(data.data))
                })

            window.setTimeout(() => {
                window.location.href="https://uijam.vercel.app/"
            }, 1000)
        }
    }, [])

    return (
        <>
        
        </>
    )
    
}