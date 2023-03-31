//Actions for sagas (dispatch())
export const MOVE_RIGHT = "MOVE_RIGHT";
export const MOVE_LEFT = "MOVE_LEFT";
export const MOVE_UP = "MOVE_UP";
export const MOVE_DOWN = "MOVE_DOWN";


// Actions for reducers (Event Listener)
export const RIGHT = "RIGHT";
export const LEFT = "LEFT";
export const UP = "UP";
export const DOWN = "DOWN";


export const SET_INVALID_MOVEMENT = "SET_INVALID_MOVEMENT";
export const RESET = "RESET";
export const UPDATE_SCORE = "UPDATE_SCORE";

export interface IUserCoord {
    x: number,
    y: number
};

export interface IDirCheck {
    dir1: string,
    dir2: string
}

export const makeMove = (newX: number, newY: number, movement: string) => ({
    type: movement,
    payload: [newX, newY],
});

export const setInvalDir = (direction: string) => ({
    type: SET_INVALID_MOVEMENT,
    payload: direction
});

export const resetGame = () => ({
    type: RESET
});

export const updateScore = (type: string) => ({
    type: UPDATE_SCORE,
});


