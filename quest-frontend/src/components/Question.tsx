import React, { useEffect, useState } from "react";
import axios from "axios";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import "./Question.css";
import { UPDATE_SCORE, updateScore } from "../store/actions";
import { useDispatch } from 'react-redux';

const Question = ({ questionID }: any) => {
    const [message, setMessage] = useState<any | null>({});
    const [hintShown, setHintShown] = useState(false);
    const [chatShown, setChatShown] = useState(false);
    const [answered, setAnswered] = useState(false);
    const [choiceSelected, setChoiceSelected] = useState(0);

    const dispatch = useDispatch()

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
                                        onClick={() =>
                                            setChoiceSelected(index)
                                        }
                                    />
                                    <label htmlFor={"choice" + index}>
                                        <Latex>{choice}</Latex>
                                    </label>
                                </div>
                            );
                        }
                    )}
                {answered && (
                    <div className="result">
                        {message.data.feedback[choiceSelected]}
                    </div>
                )}
                {hintShown && (
                    <div className="hint">
                        <Latex>{"Hint: " + message.data.hint}</Latex>
                    </div>
                )}
                <button
                    className="buttonQuestion"
                    onClick={() => setHintShown(!hintShown)}
                >
                    {" "}
                    Generate hint
                </button>
                <button
                    className="buttonQuestion"
                    onClick={() => setChatShown(!chatShown)}
                >
                    {" "}
                    Ask ChatGPT
                </button>
                <button
                    className="buttonQuestionSubmit"
                    onClick={() => {
                        setAnswered(true)
                        if (message.data.weights[choiceSelected] === 100) {
                            // Increase score
                            dispatch(updateScore(UPDATE_SCORE))
                        }
                    }}
                >
                    {" "}
                    Submit answer
                </button>
            </div>
        );
    } else {
        return <div className="question">Reach a question tile!</div>;
    }
};

export default Question;
