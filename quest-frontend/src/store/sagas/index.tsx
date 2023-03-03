import { takeLatest, CallEffect, put, PutEffect, delay } from "redux-saga/effects";
import { 
    MOVE_DOWN,
    MOVE_LEFT,
    MOVE_RIGHT,
    MOVE_UP,
    IUserCoord,
    RESET,
    setInvalDir,
    LEFT,
    RIGHT,
    UP,
    DOWN 
} from "../actions";


export function* moveSaga(params: {
    type: string,
    payload: IUserCoord; 
}) : Generator<
    | PutEffect<{ type: string; payload: IUserCoord}>
    | PutEffect<{ type: string; payload: string }>
    | CallEffect<true>
    > {
        while(params.type !== RESET) {
            yield put({
                type: params.type.split("_")[1],
                payload: params.payload
            });

            switch (params.type.split("_")[1]) {
                case RIGHT:
                    yield put(setInvalDir(LEFT));
                    break;
                
                case LEFT:
                    yield put(setInvalDir(RIGHT));
                    break;
                
                case UP:
                    yield put(setInvalDir(DOWN));
                    break;
                
                case DOWN:
                    yield put(setInvalDir(UP));
                    break;
            }

            yield delay(100);
        }
}

function* watcherSagas() {
    yield takeLatest(
        [MOVE_UP, MOVE_DOWN, MOVE_LEFT, MOVE_RIGHT],
        moveSaga
    );
}

export default watcherSagas;