import { useCallback, useEffect } from "react";
import { useSelector } from 'react-redux';
import { IGlobalState } from "../store/reducers";

export interface IGameBoard {
    height: number,
    width: number
};

const GameBoard = ({height, width}: IGameBoard) => {
  const invalidDir = useSelector((state: IGlobalState) => state.invalidDir)


  const moveUser = useCallback( 
    // TODO
    // IMPLEMENT USER MOVEMENT
    // INCLUDE EDGE DETECTION
    (dx = 0, dy = 0, ds: string) => {
      if (dx > 0) {

      }

    },
    []
  );

  const handleKeyEvents = useCallback(
    (event: KeyboardEvent) => {
      if (invalidDir) {
        switch (event.key) {
          case "w":
            moveUser(0, 0, invalidDir);
            break;

          case "s":
            moveUser(0, 0, invalidDir);
            break;

          case "a":
            moveUser(0, 0, invalidDir);
            break;

          case "d":
            event.preventDefault();
            moveUser(0, 0, invalidDir);
            break;
        }
      } else {
        // TODO
        // IMPLEMENT RESTRICTED MOVEMENT
        // User cannot certain direction next to edge
      }

    },
    [invalidDir, moveUser]
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