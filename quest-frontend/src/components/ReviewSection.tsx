import axios from "axios";
import { useState, useEffect } from "react";
import Question from "./Question";
import Latex from "react-latex-next";
import "./ReviewSection.css";


const ReviewSection = ({ array, setID, questionArray } : any) => {
    return (
        array.map((item: any, idx: any) => (
            <button className="buttonReview" key={item} onClick={() => {setID(questionArray[item])}}> Question ID: {questionArray[item]} </button>
        ))
    )
}

export default ReviewSection;