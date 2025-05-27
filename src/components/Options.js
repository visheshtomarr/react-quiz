import { useQuiz } from "../contexts/QuizContext";

function Options({ question }) {
    const { dispatch, answer } = useQuiz();

    const alreadyAnswered = answer !== null;

    return (
        <div className="options">
            {question.options.map((option, index) => (
                <button
                    className={`
                        btn 
                        btn-option 
                        ${index === answer ? 'answer' : ''}
                        ${alreadyAnswered ?
                            index === question.correctOption
                                ? 'correct'
                                : 'wrong'
                            : ''}
                        `}
                    key={option}
                    disabled={alreadyAnswered}
                    onClick={() => dispatch({ type: 'newAnswer', payload: index })}
                >
                    {option}
                </button>
            ))}
        </div>
    )
}

export default Options;
