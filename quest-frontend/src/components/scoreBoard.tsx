import { useCallback, useEffect } from "react";
import { useSelector } from 'react-redux';
import { IGlobalState } from "../store/reducers";
import {Box} from '@chakra-ui/react'

const ScoreBoard = () => {
    const score = useSelector((state: IGlobalState) => state.score);
    return(
        <Box bg="green"> Current Score: {score}</Box>
    );
}

export default ScoreBoard;