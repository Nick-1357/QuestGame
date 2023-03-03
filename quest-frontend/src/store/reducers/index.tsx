import {UP, DOWN, LEFT, RIGHT, UPDATE_SCORE, IUserCoord, IDirCheck } from "../actions";

export interface IGlobalState {
    user: IUserCoord[] | [];
    invalidDir: IDirCheck[];
    score: number
    timeLeft: number
};

const globalState: IGlobalState = {
    user: [{x: 0, y: 0}],
    invalidDir: [{dir1: "", dir2: ""}],
    score: 0,
    timeLeft: 100
};

const gameReducer = (state = globalState, action: any) => {
    switch(action.type) {
        case RIGHT:
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
    }
};


export default gameReducer;