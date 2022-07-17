import Link from "next/link"

export default function ResourceCard(props) {

    let allSills = props.skills.map((skill, index) => {
        const skillStyle = skill == "HTML" ? "#6CBF58" : skill == "CSS" ? "#BF5858" : skill == "JS" ? "#BFBB58" : skill == "UI" ? "#9E58BF" : skill == "UX" ? "#58B9BF" : "#5862BF"
        return (
            <div className="resourceCardInformationSkill" key={index} style={{color: skillStyle, borderColor: skillStyle}}>{skill}</div>
        )
    })

    return (
        <div className="resoureCard">
            <div className="resourceCardImageEffect">
                <a href={props.link} target="_blank" rel="noreferrer">
                    <img src={props.thumbnail} alt="resource card thumbnail" />
                </a>
            </div>
            <div className="resourceCardInformation">
                <p className="resourceCardInformationHeader">{props.header}</p>
                <div className="resourceCardInformationSkills">
                    {allSills}
                </div>
                <p className="resourceCardInformationDescription">{props.description}</p>
            </div>
        </div>
    )
}