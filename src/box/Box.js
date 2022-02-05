import "./Box.css"
import { useState } from "react";
import { SOLVED, ALMOST_SOLVED, UNSOLVED } from "../colors";

export default function Box(props) {
    const [selected, setSelected] = useState(false);
    return (
        <div className={"letterBox " + ((selected) ? 'letter-box-active ': ''
        + ((props.solvedStatus === SOLVED) ? "letter-box-solved ": "")
        + ((props.solvedStatus === UNSOLVED) ? "letter-box-unsolved ": "")
        + ((props.solvedStatus === ALMOST_SOLVED) ? "letter-box-almost ": "")
        )}
            onClick={() => setSelected(true)}
            onBlur={() => setSelected(false)}>
                {props.letter}
            </div>
    );
}