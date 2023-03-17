import React, { useEffect, useState } from "react";
import axios from "axios";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import "./Question.css";

const Question = ({ questionID }: any) => {
    const [message, setMessage] = useState<any | null>({});
    const [hintShown, setHintShown] = useState(false);

    useEffect(() => {
        axios
            .get("http://localhost:8000/api/extract_question", {
                params: { id: questionID },
            })
            .then((response) => {
                console.log("SUCCESS", response);
                setMessage(response);
            })
            .catch((error) => {
                console.log(error);
            });
        
    }, [questionID]);


    if (questionID !== -1 && message.data.question !== undefined) {
        return (
            <div className="question">
                <Latex>{message.data.question}</Latex>;
                {message.data.choices !== undefined &&
                    message.data.choices.map(
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
                <div className="hint">{hintShown && <Latex>{"Hint: " + message.data.hint}</Latex>}</div>
                <button className="buttonQuestion" onClick={() => setHintShown(!hintShown)}> Generate hint</button>
                <button className="buttonQuestion"> Submit answer</button>
            </div>
        );
    } else {
        return <div className="question">Reach a question tile!</div>;
    }
};

export default Question;
