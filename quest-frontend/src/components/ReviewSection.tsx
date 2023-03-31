import axios from "axios";
import { useState, useEffect } from "react";
import Question from "./Question";
import Latex from "react-latex-next";
import "./ReviewSection.css";


const ReviewSection = ({ array, setID } : any) => {
    return (
        array.map((item: any, idx: any) => (
            <button className="buttonReview" value={item} onClick={() => {setID(item)}}> Question ID: {item} </button>
        ))
    )
}

export default ReviewSection;