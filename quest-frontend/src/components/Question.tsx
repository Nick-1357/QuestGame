import React, { useEffect, useState } from "react";
import axios from "axios";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import "./Question.css";

const Question = ({ questionID }: any) => {
    const [getMessage, setGetMessage] = useState<any | null>({});

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
        console.log(getMessage.data.question);

        // Split the message into parts using a custom delimiter
        const parts = getMessage.data.question.split("#");

        return (
            <div className="question">
                {parts.map((part: string, index: number) => {
                    // Render even-indexed parts as LaTeX
                    if (index % 2 === 0) {
                        return (
                            <div dangerouslySetInnerHTML={{ __html: part }} />
                        );
                    }
                    // Render odd-indexed parts as plain text
                    else {
                        return <Latex key={index}>{part}</Latex>;
                    }
                })}
                <button className="buttonQuestion"> Generate hint</button>
                <button className="buttonQuestion"> Submit answer</button>
            </div>
        );
    } else {
        return <div className="question">Reach a question tile first!</div>;
    }
};

export default Question;
