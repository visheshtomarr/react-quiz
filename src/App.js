import { useEffect, useReducer } from "react";
import Header from "./components/Header";
import Main from "./components/Main";

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
        <p>1/15</p>
        <p>Questions?</p>
      </Main>
    </div>
  );
}

export default App;
