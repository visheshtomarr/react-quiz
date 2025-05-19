function Progress({ index, num, maxPoints, points, answer }) {

    return (
        <div className="progress">
            <progress
                max={num}
                // If there will be an answer, then only '1' will be added to
                // current index, else '0' will be added.
                value={index + Number(answer !== null)}
            />
            <p>
                Question <strong>{index + 1}</strong> / {num}
            </p>
            <p>
                <strong>{points}</strong> / {maxPoints}
            </p>
        </div>
    )
}

export default Progress;
