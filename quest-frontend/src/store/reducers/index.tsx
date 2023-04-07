import {UP, DOWN, LEFT, RIGHT, UPDATE_SCORE, IUserCoord } from "../actions";

export interface IGlobalState {
    user: IUserCoord[] | [];
    score: number
    timeLeft: number
};

const globalState: IGlobalState = {
    user: [{x: 0, y: 0}],
    score: 0,
    timeLeft: 100
};

const gameReducer = (state = globalState, action: any) => {
    switch(action.type) {
        case RIGHT: //perform a certain set of operations
        case LEFT:
        case UP:
        case DOWN:
            let newUser = [...state.user];
            newUser = [{
                x: state.user[0].x + action.payload[0],
                y: state.user[0].y + action.payload[1],
            }, ...newUser];

            newUser.pop();

            return {
                ...state,
                user: newUser
            };

            default:
                return state;

        case UPDATE_SCORE:
            return {
                ...state,
                score: state.score + 10,
            }
    }
};


export default gameReducer;