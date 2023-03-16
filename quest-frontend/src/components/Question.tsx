import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'katex/dist/katex.min.css'
import Latex from 'react-latex-next'

const Question = ({questionID}: any) => {
    const [getMessage, setGetMessage] = useState<any | null>({})

    useEffect(()=>{
        axios.get('http://localhost:8000/api/extract_question', {params: {"id": questionID}}).then(response => {
        console.log("SUCCESS", response)
        setGetMessage(response)
        }).catch(error => {
        console.log(error)
        })

    }, [questionID])

    if (questionID !== -1) {
        console.log(getMessage.data.question)
        return (
            <div className="question">
                
                <div dangerouslySetInnerHTML={{ __html: getMessage.data.question }} />
                
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
