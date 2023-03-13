import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { makeMove, MOVE_LEFT, MOVE_DOWN, MOVE_RIGHT, MOVE_UP } from "../store/actions";
import { IGlobalState } from "../store/reducers";

export interface IQuestion{
    questionID: number,
    questionContent: string,
    answer: string,
    reached: boolean
}

const Question = ({questionID, questionContent, answer, reached}: IQuestion) => {
    const invalidDirState = useSelector((state: IGlobalState) => state.invalidDir)
    const invalidDir1 = invalidDirState[0].dir1;
    const invalidDir2 = invalidDirState[0].dir2;
    const dispatch = useDispatch();

    const moveUser = useCallback( 
        // Might need checking
        (dx = 0, dy = 0, invDir1: string, invDir2: string) => {
          if (dx > 0 && invDir1 !== "RIGHT") { // X-axis bound checking
            dispatch(makeMove(dx, dy, MOVE_RIGHT));
          }
    
          if (dx < 0 && invDir1 !== "LEFT") {
            dispatch(makeMove(dx, dy, MOVE_LEFT));
          }
    
          if (dy > 0 && invDir2 !== "DOWN") {
            dispatch(makeMove(dx, dy, MOVE_DOWN));
          }
    
          if (dy < 0 && invDir2 !== "UP") {
            dispatch(makeMove(dx, dy, MOVE_UP));
          }
        },
        [dispatch]
      );
    const handleKeyEvents = useCallback(
        (event: KeyboardEvent) => {
          // console.log("handleKeyEvents called");
          switch (event.key) {
            case "w": //"w" and "d" are along Y-axis; dy > 0 == DOWN; dy < 0 == UP
              moveUser(0, -20, invalidDir1, invalidDir2);
              break;
    
            case "s":
              moveUser(0, 20, invalidDir1, invalidDir2);
              break;
    
            case "a": // "a" and "d" are along X-axis
              moveUser(-20, 0, invalidDir1, invalidDir2);
              break;
    
            case "d":
              event.preventDefault();
              moveUser(20, 0, invalidDir1, invalidDir2);
              break;
          }
          
        },
        [invalidDir1, invalidDir2, moveUser]
      );
    const handleSubmitButton=()=>{
        window.addEventListener("keypress", handleKeyEvents);
        
    }

    if (reached === true) {
        return (
            <div className="question">
                {questionContent} <br></br>
                {answer}
            <br></br>
            <button> Generate hint</button>
            <button onClick={handleSubmitButton}> Submit answer</button>
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
