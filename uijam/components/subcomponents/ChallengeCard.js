import Link from 'next/link'

export default function ChallengeCard(props) {
    let difficultyText = props.difficulty == "easy" ? "EASY" : props.difficulty == "normal" ? "NORMAL" : props.difficulty == "hard" ? "HARD" : "EXPERT"
    let difficultyBlockColor = {color: props.difficulty == "easy" ? "#6CBF58" : props.difficulty == "normal" ? "#BFB558" : props.difficulty == "hard" ? "#BF9058" : "#BF5858", borderColor: props.difficulty == "easy" ? "#6CBF58" : props.difficulty == "normal" ? "#BFB558" : props.difficulty == "hard" ? "#BF9058" : "#BF5858"}
    let difficultyBorderColor = {borderColor: props.difficulty == "easy" ? "#6CBF58" : props.difficulty == "normal" ? "#BFB558" : props.difficulty == "hard" ? "#BF9058" : "#BF5858"}

    return (
        <div className="challengeCard" style={difficultyBorderColor}>
            <div className="challengeCardImageAlign">
                <Link href={`/challenges/${props.link}`}>
                    <img src={props.challengeImage} alt="challenge card's thumbnail"/>
                </Link>
            </div>
            <div className="challengeCardInfo">
                <p className="challengeCardInfoHeader">{props.header}</p>
                <p className="challengeCardInfoDescription">{props.description}</p>
                <div className="challengeCardInfoDifficulty" style={difficultyBlockColor}>{difficultyText}</div>
            </div>
        </div>
    )
}