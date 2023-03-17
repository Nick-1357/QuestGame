import { ChakraProvider, Container, Grid, GridItem, Heading } from '@chakra-ui/react'
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { IGlobalState } from "../store/reducers";
import { makeMove, MOVE_LEFT, MOVE_DOWN, MOVE_RIGHT, MOVE_UP } from "../store/actions";
import { IObjectBody, clearBoard, drawObject, generateRandomPosition, questPosDict } from "../utils";
import Question from './Question';

export interface IGameBoard {
    height: number,
    width: number
};

const GameBoard = ({height, width}: IGameBoard) => {
  const canvasRef = useRef <HTMLCanvasElement | null> (null);
  const [context, setContext] = useState < CanvasRenderingContext2D | null> (null);
  const invalidDirState = useSelector((state: IGlobalState) => state.invalidDir)
  const invalidDir1 = invalidDirState[0].dir1;
  const invalidDir2 = invalidDirState[0].dir2;
  const [questAmt, setQuestAmt] = useState(3);

  const user1 = useSelector((state: IGlobalState) => state.user);

  // const questionArray = [generateRandomPosition(width-20,height-20), generateRandomPosition(width-20,height-20), generateRandomPosition(width-20,height-20)];
  let questArr: IObjectBody[] = new Array();
  const [pos, setPos] = useState(questArr);

  let reachedQuestionArray = new Array();
  const [reachedQuestion, setReachedQuestion] = useState(reachedQuestionArray);
  const [currentQuestionID, setCurrentQuestionID] = useState(-1);

  let questPosDict: questPosDict = {};
  const [questionPosDict, setQuestionPostDict] = useState(questPosDict)

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
          if (user1[0].x == pos[idx].x && user1[0].y == pos[idx].y && !reachedQuestion[idx].reached) {
            reachedQuestion[idx].reached = true;


            setCurrentQuestionID(3577);

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
        case "z":
          setQuestAmt(Math.floor((Math.random() * 10) + 1));
          break;
        
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

  useEffect(() => {
    setContext(canvasRef.current && canvasRef.current.getContext("2d"));
    clearBoard(context);
    drawObject(context, user1, "#91C483");

    questionTriggerCheck();

    for (let i = 0; i < pos.length; i++){
      if (reachedQuestion[i]?.reached === false){
        drawObject(context, [pos[i]], "#676FA3");
      }
    }
    
    
    
  }, [context, user1, pos, reachedQuestion, questAmt]);

  useEffect(() => {
    window.addEventListener("keypress", handleKeyEvents);
    
    return () => {
      window.removeEventListener("keypress", handleKeyEvents);
    };

  }, [handleKeyEvents, invalidDir1]);


    return (
        <Grid templateColumns='repeat(2, 1fr)' gap={50}>
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
        </Grid>
        
    ); 
}


export default GameBoard;

