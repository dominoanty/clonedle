import Box from "../box/Box";
import "./Line.css";
import { SOLVED, UNSOLVED, ALMOST_SOLVED} from '../colors';

function rightPad(word, numLetters) {
    if (word.length < numLetters) {
        for (let i = word.length; i < numLetters; i++) {
            word = word + " ";
        }
    }
    return word;
}
export default function Line(props) {
    const arr = [1, 2, 3];
    const isLineActive = props.currentActiveIndex === props.lineIndex;
    const isLineHistory = props.currentActiveIndex > props.lineIndex;
    let wordToShow = "";
    wordToShow = isLineActive ? props.currentGuess: wordToShow;
    wordToShow = isLineHistory ? props.guessAtLine : wordToShow;
    wordToShow = rightPad(wordToShow, props.numLetters);

    const letterCountForActualWord = {}; 
    for (const letter of props.actualWord.split('')) {
        letterCountForActualWord[letter] = 1 + (letterCountForActualWord[letter] === undefined ? 0 : letterCountForActualWord[letter]);
    }

    const colorList = []; 
    if (isLineHistory) {
        for (let i = 0; i < wordToShow.length; i++) {
            if (wordToShow.charAt(i) == props.actualWord.charAt(i)) {
                letterCountForActualWord[wordToShow.charAt(i)] -= 1
                colorList.push(SOLVED);
            } else if(letterCountForActualWord[wordToShow.charAt(i)] != 0 && 
            letterCountForActualWord[wordToShow.charAt(i)] != undefined ) {
                letterCountForActualWord[wordToShow.charAt(i)] -= 1
                colorList.push(ALMOST_SOLVED);
            } else {
                colorList.push(UNSOLVED);
            }
        }
    }

    return (
        <div className={"letterRow " + (isLineActive ? "activeLetterRow": "")}>
            {
                [...Array(props.numLetters).keys()].map((number) => {
                    return <Box letter={wordToShow.charAt(number)} solvedStatus={colorList[number]}/>
                })
            }
        </div>
    )

}