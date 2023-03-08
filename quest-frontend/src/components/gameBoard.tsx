import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { IGlobalState } from "../store/reducers";
import { makeMove, MOVE_LEFT, MOVE_DOWN, MOVE_RIGHT, MOVE_UP } from "../store/actions";
import { IObjectBody, clearBoard, drawObject, generateRandomPosition } from "../utils";

export interface IGameBoard {
    height: number,
    width: number
};

const GameBoard = ({height, width}: IGameBoard) => {
  const canvasRef = useRef <HTMLCanvasElement | null> (null);
  const [context, setContext] = useState < CanvasRenderingContext2D | null> (null);
  const [moved, setMoved] = useState(false);
  const invalidDirState = useSelector((state: IGlobalState) => state.invalidDir)
  const invalidDir1 = invalidDirState[0].dir1;
  const invalidDir2 = invalidDirState[0].dir2;

  let dx = 0, dy = 0;

  const user1 = useSelector((state: IGlobalState) => state.user);
  const questionArray = [generateRandomPosition(width-20,height-20), generateRandomPosition(width-20,height-20), generateRandomPosition(width-20,height-20)];
  const [pos, setPos] = useState(questionArray);

  

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
      console.log("handleKeyEvents called");
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

  // useEffect(() => {
  //   moveUser(0, 0, invalidDir1, invalidDir2);
  //   setMoved(false);
  // }, [moved])


  useEffect(() => {
    setContext(canvasRef.current && canvasRef.current.getContext("2d"));
    clearBoard(context);
    drawObject(context, user1, "#91C483");
    drawObject(context, pos,"#676FA3");

  }, [context, user1]);

  useEffect(() => {
    window.addEventListener("keypress", handleKeyEvents);
    
    return () => {
      window.removeEventListener("keypress", handleKeyEvents);
    };

  }, [handleKeyEvents, invalidDir1]);


    return (
        <canvas
          ref={canvasRef}
          style={{
            border: "3px solid black",
          }}
          height={height}
          width={width}
        />
    ); 
}


export default GameBoard