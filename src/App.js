import { useEffect, useReducer } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartScreen from "./components/StartScreen";

const initialState = {
  questions: {},
  // Status can be in following states: "loading", "error", "ready", 
  // "active", "finished"
  status: 'loading'
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
      }

    default:
      throw new Error("Unknown action");
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { questions, status } = state;

  const numOfQuestions = questions.length;

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
        {status === 'ready' && <StartScreen num={numOfQuestions} />}
      </Main>
    </div>
  );
}

export default App;
