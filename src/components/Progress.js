import { useQuiz } from "../contexts/QuizContext";

function Progress() {
    const { index, numOfQuestions, maxPoints, points, answer } = useQuiz();
    return (
        <div className="progress">
            <progress
                max={numOfQuestions}
                // If there will be an answer, then only '1' will be added to
                // current index, else '0' will be added.
                value={index + Number(answer !== null)}
            />
            <p>
                Question <strong>{index + 1}</strong> / {numOfQuestions}
            </p>
            <p>
                <strong>{points}</strong> / {maxPoints}
            </p>
        </div>
    )
}

export default Progress;
