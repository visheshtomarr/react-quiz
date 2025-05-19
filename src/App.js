import { useEffect, useReducer } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartScreen from "./components/StartScreen";
import Questions from "./components/Questions";
import NextButton from "./components/NextButton";
import Progress from "./components/Progress";
import FinishScreen from "./components/FinishScreen";
import Footer from "./components/Footer";
import Timer from "./components/Timer";

const SECONDS_PER_QUESTION = 30;
const initialState = {
  questions: [],
  // Status can be in following states: "loading", "error", "ready", 
  // "active", "finished"
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null
};

function reducer(currState, action) {
  switch (action.type) {
    case 'dataReceived':
      return {
        ...currState,
        questions: action.payload,
        status: 'ready'
      };

    case 'dataFailed':
      return {
        ...currState,
        status: 'error'
      };

    case 'start':
      return {
        ...currState,
        status: 'active',
        secondsRemaining: currState.questions.length * SECONDS_PER_QUESTION
      };

    case 'newAnswer':
      const currQuestion = currState.questions[currState.index];

      return {
        ...currState,
        answer: action.payload,
        points:
          action.payload === currQuestion.correctOption
            ? currState.points + currQuestion.points
            : currState.points
      };

    case 'nextQuestion':
      return {
        ...currState,
        index: currState.index + 1,
        answer: null
      }

    case 'finish':
      return {
        ...currState,
        status: 'finished',
        highscore:
          currState.points > currState.highscore
            ? currState.points
            : currState.highscore
      }

    case 'restart':
      return {
        ...initialState,
        questions: currState.questions,
        status: 'ready',
        highscore: currState.highscore
      };

    case 'tick':
      return {
        ...currState,
        status: currState.secondsRemaining === 0 ? 'finished' : currState.status,
        secondsRemaining: currState.secondsRemaining - 1,
      }

    default:
      throw new Error("Unknown action");
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    questions,
    status,
    index,
    answer,
    points,
    highscore,
    secondsRemaining
  } = state;

  const numOfQuestions = questions.length;
  const maxPoints = questions.reduce((prev, curr) => prev + curr.points, 0);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:5000/questions");
        const data = await res.json();
        dispatch({ type: 'dataReceived', payload: data });
      } catch (error) {
        dispatch({ type: 'dataFailed' });
      }
    }
    fetchData();
  }, [])

  return (
    <div className="app">
      <Header />
      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' &&
          <StartScreen
            num={numOfQuestions}
            dispatch={dispatch}
          />}
        {status === 'active' && (
          <>
            <Progress
              index={index}
              points={points}
              num={numOfQuestions}
              maxPoints={maxPoints}
              answer={answer}
            />
            <Questions
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer
                dispatch={dispatch}
                secondsRemaining={secondsRemaining}
              />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                num={numOfQuestions}
              />
            </Footer>
          </>
        )}
        {status === 'finished' &&
          <FinishScreen
            points={points}
            maxPoints={maxPoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        }
      </Main>
    </div>
  );
}

export default App;
