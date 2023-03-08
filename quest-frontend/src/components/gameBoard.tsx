import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { IGlobalState } from "../store/reducers";
import { makeMove, MOVE_LEFT, MOVE_DOWN, MOVE_RIGHT, MOVE_UP } from "../store/actions";
import { clearBoard, drawObject } from "../utils";

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

  const user1 = useSelector((state: IGlobalState) => state.user);
  // const [pos, setPos] = useState < IObjectBody > (
  //   generateRandomPosition(width - 20, height - 20)
  // );
  let userXPos = 0;
  let userYPos = 0;

  const dispatch = useDispatch();


  const moveUser = useCallback( 
    // Might need checking
    // Somehow comparing userXPos and userYPos to width and height does not work
    (dx = 0, dy = 0, invDir1: string, invDir2: string) => {
      if (dx > 0 && userXPos <= (width - 20)) { // X-axis bound checking
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

  useEffect(() => {
    setContext(canvasRef.current && canvasRef.current.getContext("2d"));
    clearBoard(context);
    drawObject(context, user1, "#91C483");

    userXPos = user1[0].x;
    userYPos = user1[0].y;
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