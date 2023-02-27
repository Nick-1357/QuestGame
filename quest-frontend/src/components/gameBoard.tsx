import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { IGlobalState } from "../store/reducers";

import { makeMove, MOVE_LEFT, MOVE_DOWN, MOVE_RIGHT, MOVE_UP } from "../store/actions";

export interface IGameBoard {
    height: number,
    width: number
};

const GameBoard = ({height, width}: IGameBoard) => {
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
      if (invalidDir1) { // invalidDir1 should be updated first and used as a condition check
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
      }
    },
    [invalidDir1, moveUser]
  );


  useEffect(() => {
    window.addEventListener("keypress", handleKeyEvents);
    
    return () => {
      window.removeEventListener("keypress", handleKeyEvents);
    };
  }, [handleKeyEvents]);


    return (
        <canvas
          style={{
            border: "3px solid black",
          }}
          height={height}
          width={width}
        />
    ); 
}


export default GameBoard