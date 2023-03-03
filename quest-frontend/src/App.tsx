import './App.css';
import { ChakraProvider, Container, Grid, GridItem, Heading } from '@chakra-ui/react'
import { Provider } from 'react-redux';
import store from "./store"
import GameBoard from './components/gameBoard';
import ScoreBoard from './components/scoreBoard';
import TimeLeft from './components/timeLeft';

function App() {
  return (
    <Provider store={store}>
      <ChakraProvider>
        <Container maxW="container.lg" centerContent>
          <Heading as ="h1"
          size="x1">
            Quest Game
            <Grid templateColumns='repeat (2,1fr)' gap={6}>
              <GridItem> <ScoreBoard /> </GridItem>
              <GridItem> <TimeLeft /> </GridItem>
            </Grid>
            <GameBoard height={600} width={500}/>
          </Heading>
        </Container>
      </ChakraProvider>
    </Provider>
  );
}



export default App;
