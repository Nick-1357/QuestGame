import React, { useEffect, useState } from "react";
import axios from "axios";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import "./Question.css";

const Question = ({ questionID }: any) => {
    const [getMessage, setGetMessage] = useState<any | null>({});
    const [hintShown, setHintShown] = useState(false);
    
    useEffect(() => {
        axios
            .get("http://localhost:8000/api/extract_question", {
                params: { id: questionID },
            })
            .then((response) => {
                console.log("SUCCESS", response);
                setGetMessage(response);
            })
            .catch((error) => {
                console.log(error);
            });
        
    }, [questionID]);


    if (questionID !== -1 && getMessage.data.question !== undefined) {
        return (
            <div className="question">
                <Latex>{getMessage.data.question}</Latex>;
                {getMessage.data.choices !== undefined &&
                    getMessage.data.choices.map(
                        (choice: string, index: number) => {
                            return (
                                <div className="choice" key={index.toString()}>
                                    <input
                                        type="radio"
                                        id={"choice" + index}
                                        name="choices"
                                        value={"choice" + index}
                                    />
                                    <label htmlFor={"choice" + index}>
                                        <Latex>{choice}</Latex>
                                    </label>
                                </div>
                            );
                        }
                    )}
                <div className="hint">{hintShown && <Latex>{"Hint: " + getMessage.data.hint}</Latex>}</div>
                <button className="buttonQuestion" onClick={() => setHintShown(!hintShown)}> Generate hint</button>
                <button className="buttonQuestion"> Submit answer</button>
            </div>
        );
    } else {
        return <div className="question">Reach a question tile first!</div>;
    }
};

export default Question;
