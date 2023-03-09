

const Question = ({questionID}: any) => {
    if (questionID !== -1) {
        return (
            <div className="question">
                Placeholder Question {questionID}
            <button> Generate hint</button>
            <button> Submit answer</button>
            </div>
        );
    } else {
        return (
            <div className="question">
                Reach a question tile first!
            </div>
        );
    }
    
}

export default Question;
