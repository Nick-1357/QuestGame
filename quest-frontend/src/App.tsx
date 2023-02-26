import './App.css';
import { ChakraProvider, Container, Grid, GridItem, Heading } from '@chakra-ui/react'
import { Provider } from 'react-redux';
import store from "./store"
import GameBoard from './components/gameBoard';

function App() {
  return (
    <Provider store={store}>
      <ChakraProvider>
        <Container maxW="container.lg" centerContent>
          <Heading as ="h1"
          size="x1">
            Quest Game
            <GameBoard height={600} width={500}/>
          </Heading>
        </Container>
      </ChakraProvider>
    </Provider>
  );
}


// const Board = ({ height, width }) => {
//   return (
//     <div className='board' style={{
//       border: "3px solid black",
//     }}>
//       <div className='header'>
//         <ScoreBoard score={100}/>
//         <Timer time = {2} />
//       </div>
//       <div className='gameboard'>
//         <gameBoard height={height} width = {width}/>
//       </div>
//     </div>
//   );
// };

// const GameBoard = ({ height, width }) => {
  
//   return (
//     <canvas
//       style={{
//         border: "3px solid black",
//       }}
//       height={height}
//       width={width}
//     />
//   );
// };

// const ScoreBoard = ({score}) => {
//   return (
//     <div style={{
//       border: "1px solid black",
//       width:"50px"
//     }}> Score: {score} </div>
//   );
// }

// const Timer = ({time}) => {
//   return (
//     <div style={{
//       border: "1px solid black",
//       width: "50px"
//     }}> Timer: {time} </div>
//   )
// }


//const canvasRef = useRef<HTMLCanvasElement | null>(null);

export default App;
