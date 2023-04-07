import { Grid, GridItem } from '@chakra-ui/react'
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { IGlobalState } from "../store/reducers";
import { makeMove, MOVE_LEFT, MOVE_DOWN, MOVE_RIGHT, MOVE_UP} from "../store/actions";
import { IObjectBody, clearBoard, drawObject, generateRandomPosition, questPosDict } from "../utils";
import Question from './Question';
import ReviewSection from './ReviewSection';

import "./ReviewSection.css"

export interface IGameBoard {
    height: number,
    width: number
};

const GameBoard = ({height, width}: IGameBoard) => {
  const canvasRef = useRef <HTMLCanvasElement | null> (null);
  const [context, setContext] = useState < CanvasRenderingContext2D | null> (null);
  const [questAmt, setQuestAmt] = useState(3);
  const [prevRand, setPrevRand] = useState(-1);

  enum Diff {
    EASY,
    MED,
    HARD
  }

  const questionIDs = [1, 3, 6, 7, 982, 1073, 1081]
  const questionDiff = [Diff.EASY, Diff.EASY, Diff.HARD, Diff.EASY, Diff.MED, Diff.MED, Diff.HARD]
  const diffColors = ["#008450", "#EFB700", "#B81D13"]


  const user1 = useSelector((state: IGlobalState) => state.user);

  // const questionArray = [generateRandomPosition(width-20,height-20), generateRandomPosition(width-20,height-20), generateRandomPosition(width-20,height-20)];
  let questArr: IObjectBody[] = new Array();
  const [pos, setPos] = useState(questArr);

  let reachedQuestionArray = new Array();
  const [reachedQuestion, setReachedQuestion] = useState(reachedQuestionArray);
  const [currentQuestionID, setCurrentQuestionID] = useState(-1);

  let questPosDict: questPosDict = {};
  const [questionPosDict, setQuestionPostDict] = useState(questPosDict);

  let visitedQueue = new Array()
  const [visited, setVisited] = useState(visitedQueue);
  
  const dispatch = useDispatch();

  function updateArr(questArr: IObjectBody[]) {
    // Empty out both array
    questArr.length = 0;
    reachedQuestionArray.length = 0;
    questPosDict = {};

    // Regenerate new questions with randomized position
    for (let i = 0; i < questAmt; i++) {
      questArr.push(generateRandomPosition(width - 20, height - 20));
      reachedQuestionArray.push({id: i, reached: false});

      // For when user steps on a question
      let xKey: number =  questArr[i].x
      let yValue: number = questArr[i].y;
    
      questPosDict[xKey] = [];
      questPosDict[xKey].push(yValue);
    }

    // Debugging purposes
    // console.log("QuestAMT:" , questAmt);
    // console.log("questARR: ", questArr)
    // console.log("reachedARR: ", reachedQuestionArray);
    // console.log("posDICT: ", questPosDict);

    // Update the states
    setReachedQuestion(reachedQuestionArray);
    setPos(questArr);
    setQuestionPostDict(questPosDict);

    return questArr;

  }

  function questionTriggerCheck() {
    if (String(user1[0].x) in questionPosDict) {
      if (questionPosDict[user1[0].x].includes(user1[0].y)) {

        for (let idx = 0; idx < reachedQuestion.length; idx++) {
          if (user1[0].x === pos[idx].x && user1[0].y === pos[idx].y && !reachedQuestion[idx].reached) {
            let randIdx = Math.floor(Math.random() * questionIDs.length); // Generates a random num between 0 to length(questionsID)

            while (prevRand == randIdx) {
              randIdx = Math.floor(Math.random() * questionIDs.length);
            }

            reachedQuestion[idx].reached = true;

            setCurrentQuestionID(questionIDs[randIdx]);
            setPrevRand(randIdx);

            const prevQueue = [...visited, randIdx]; // Repeatedly concatenate old state array with new value
            setVisited(prevQueue);  // Then re-assign it to the state array

            // Debugging purposes
            // console.log("questARR: ", pos)
            // console.log("reachedARR: ", reachedQuestion);
          }
        }
      }
    }
  }

  useEffect(() => {
    updateArr(questArr);

  }, [questAmt])


  const moveUser = useCallback( 
    (dx = 0, dy = 0) => {
      if (dx > 0) {
        dispatch(makeMove(dx, dy, MOVE_RIGHT));
      }

      if (dx < 0) {
        dispatch(makeMove(dx, dy, MOVE_LEFT));
      }

      if (dy > 0) {
        dispatch(makeMove(dx, dy, MOVE_DOWN));
      }

      if (dy < 0) {
        dispatch(makeMove(dx, dy, MOVE_UP));
      }
    },
    [dispatch]
  );

  const handleKeyEvents = useCallback(
    (event: KeyboardEvent) => {
      switch (event.key) {
        case "z":
          setQuestAmt(Math.floor((Math.random() * 10) + 1));
          break;
        
        case "w": //"w" and "d" are along Y-axis; dy > 0 == DOWN; dy < 0 == UP
          moveUser(0, -20);
          break;

        case "s":
          moveUser(0, 20);
          break;

        case "a": // "a" and "d" are along X-axis 
          moveUser(-20, 0);
          break;

        case "d":
          event.preventDefault();   
          moveUser(20, 0);
          break;
      }
      
    },
    [moveUser]
  );

  useEffect(() => {
    setContext(canvasRef.current && canvasRef.current.getContext("2d"));
    clearBoard(context);
    drawObject(context, user1, "#3944BC");

    questionTriggerCheck();

    for (let i = 0; i < pos.length; i++){
      if (reachedQuestion[i]?.reached === false){
        let quesColor = diffColors[questionDiff[i]];
        drawObject(context, [pos[i]], quesColor);
      }
    }
      
  }, [context, user1, pos, reachedQuestion, questAmt]);

  useEffect(() => {
    window.addEventListener("keypress", handleKeyEvents);
    
    return () => {
      window.removeEventListener("keypress", handleKeyEvents);
    };

  }, [handleKeyEvents]);


    return (
        <Grid templateColumns='repeat(2, 1fr)' gap={50}  templateRows='2'>
        <GridItem>
        <canvas
          ref={canvasRef}
          style={{
            border: "3px solid black",
          }}
          height={height}
          width={width}
        />
        </GridItem>
        <GridItem><Question questionID = {currentQuestionID}/></GridItem>
        <GridItem>
          <ReviewSection array= {visited} setID={setCurrentQuestionID} questionArray = {questionIDs}></ReviewSection>
          
        </GridItem>
        </Grid>


        
    ); 
}

export default GameBoard;

