import logo from './logo.svg';
import './App.css';
import { Grid, GridItem } from '@chakra-ui/react'

function App() {
  return (
    <div className="App">
        <h1> Quest Game</h1>
        <Board height={540} width={800} />
    </div>
  );
}


const Board = ({ height, width }) => {
  
  return (
    <div className='board' style={{
      border: "3px solid black",
    }}>
      <div className='header'>
        <ScoreBoard score={100}/>
        <Timer time = {2} />
      </div>
      <div className='gameboard'>
        <GameBoard height={500} width = {500}/>
      </div>
    </div>
  );
};

const GameBoard = ({ height, width }) => {
  
  return (
    <canvas
      style={{
        border: "3px solid black",
      }}
      height={height}
      width={width}
    />
  );
};

const ScoreBoard = ({score}) => {
  return (
    <div style={{
      border: "1px solid black",
      width:"50px"
    }}> Score: {score} </div>
  );
}

const Timer = ({time}) => {
  return (
    <div style={{
      border: "1px solid black",
      width: "50px"
    }}> Timer: {time} </div>
  )
}


//const canvasRef = useRef<HTMLCanvasElement | null>(null);

export default App;
