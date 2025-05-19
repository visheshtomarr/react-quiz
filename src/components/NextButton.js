function NextButton({ dispatch, answer, index, num }) {
    if (answer === null) return null;

    if (index < num - 1) {
        return (
            <button
                className="btn btn-ui"
                onClick={() => dispatch({ type: 'nextQuestion' })}
            >
                Next
            </button>
        )
    }

    if (index === num - 1) {
        return (
            <button
                className="btn btn-ui"
                onClick={() => dispatch({ type: 'finish' })}
            >
                Finish
            </button>
        )
    }
}

export default NextButton;
