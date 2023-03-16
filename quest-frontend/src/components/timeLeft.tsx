import { useCallback, useEffect } from "react";
import { useSelector } from 'react-redux';
import { IGlobalState } from "../store/reducers";
import {Box} from '@chakra-ui/react'

const TimeLeft = () => {
    const time = useSelector((state: IGlobalState) => state.timeLeft);
    return(
        <Box bg= "tomato"> Time left: {time}</Box>
    );
}

export default TimeLeft;