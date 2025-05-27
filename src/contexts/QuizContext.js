import { createContext, useContext, useEffect, useReducer } from "react";

const QuizContext = createContext();

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

function QuizProvider({ children }) {
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

    return <QuizContext.Provider value={{
        questions,
        status,
        index,
        answer,
        points,
        highscore,
        secondsRemaining,
        numOfQuestions,
        maxPoints,
        dispatch
    }}>
        {children}
    </QuizContext.Provider>
}

function useQuiz() {
    const context = useContext(QuizContext);
    if (context === undefined)
        throw new Error("QuizContext is used outside of QuizProvider");
    return context;
}

export { QuizProvider, useQuiz };