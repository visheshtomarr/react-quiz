import { useReducer } from "react";

const initialState = { count: 0, step: 1 };

// The argument passed into the "dispatch" function is equal
// to the "action" object in this reducer function.
function reducer(currState, action) {
  switch (action.type) {
    case "inc":
      return { ...currState, count: currState.count + currState.step };

    case "dec":
      return { ...currState, count: currState.count - currState.step };

    case "setCount":
      return { ...currState, count: action.payload };

    case "setStep":
      return { ...currState, step: action.payload };

    case "reset":
      return initialState;

    default:
      throw new Error("Unknown action");
  }
}

function DateCounter() {
  // const [count, setCount] = useState(0);
  // The 'useReducer' hook gets the access to initial state and a reducer 
  // function which can be used to update the current state based on an 'action'.
  const [state, dispatch] = useReducer(reducer, initialState);
  const { count, step } = state;

  // This mutates the date object.
  const date = new Date(Date.now());
  date.setDate(date.getDate() + count);

  const dec = function () {
    // This function is our 'reducer' function which already has the 
    // current state and we need to pass in the 'action' object. 
    dispatch({ type: "dec" });
  };

  const inc = function () {
    dispatch({ type: "inc" });
  };

  const defineCount = function (e) {
    // This payload will update the current state.
    dispatch({ type: "setCount", payload: Number(e.target.value) });
  };

  const defineStep = function (e) {
    dispatch({ type: "setStep", payload: Number(e.target.value) });
  };

  const reset = function () {
    dispatch({ type: "reset" });
  };

  return (
    <div className="counter">
      <div>
        <input
          type="range"
          min="0"
          max="10"
          value={step}
          onChange={defineStep}
        />
        <span>{step}</span>
      </div>

      <div>
        <button onClick={dec}>-</button>
        <input value={count} onChange={defineCount} />
        <button onClick={inc}>+</button>
      </div>

      <p>{date.toDateString()}</p>

      <div>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
export default DateCounter;
