import React from "react"

export default function LoginRequiredModal(props) {
    if (typeof document !== "undefined" && props.modalState) {
       document.body.style.pointerEvents = "none" 
    } else if (typeof document !== "undefined") {
        document.body.style.pointerEvents = "auto" 
    }
    return (
        <>{( props.closePopup && props.modalState) &&
            <div className="loginRequiredModal">
                <button onClick={props.closePopup}>
                    <i className="fa-solid fa-xmark"></i>
                </button>
                <h1>Ooops!</h1>
                <p className="loginRequiredDescription">It seems like you need to be logged in to be able to participate</p>
                <a href="https://github.com/login/oauth/authorize?client_id=cae64f03f1ded6b7c2f8">
                    <p>Login</p>
                </a>
            </div>
        }</>
    )
}