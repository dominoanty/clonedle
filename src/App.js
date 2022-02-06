import logo from './logo.svg';
import './App.css';
import Line from "./line/Line";
import { useState, useEffect } from 'react';
import { words } from "./5letterwords";

const ENTER = 1;
const BACKSPACE = 2;

function getDisplayLetter(letter) {
  if (letter === ENTER) {
    return "↵"
  } else if (letter === BACKSPACE) {
    return "⌫";
  } else {
    return letter;
  }
}

function KeyboardLetter(props) {

  return (
    <div className={"keyboard-letter " 
    + (props.disabled ? "keyboard-letter-disabled " : "")
    + (props.letter === ENTER || props.letter === BACKSPACE ? "special-keyboard-letter " : "")
    } onClick={() => { if (props.disabled != true) { props.onClick(props.letter) } }}>
      {getDisplayLetter(props.letter)}
    </div>
  )
}

function VictoryDialog(props) {
  return (
    <div>
      { (props.victoryAchieved === true) ?
         <div className="victory-dialog">
             <p>Victory Achieved!</p> 
             <div className="restart-button" onClick={props.onRestartClick}>↻</div> 
          </div> : <div/>
        }
    </div>
  )
}

function FailDialog(props) {
  return (
    <div>
      { (props.fail === true) ?
         <div className="fail-dialog">
             <p>The word was <span className="fail-dialog-actual-word">{props.actualWord}</span>.</p> 
             <div className="restart-button" onClick={props.onRestartClick}>↻</div> 
          </div> : <div/>
        }
    </div>
  )
}
function App() {

  const numLetters = 5;
  const [wordToBeGuessed, setWordToBeGuessed] = useState("");
  const numGuesses = 6;

  const topRowKeys = "qwertyuiop";
  const midRowKeys = "asdfghjkl";
  const bottomRowKeys = "zxcvbnm";
  const [word, setWord] = useState("");
  const [activeLine, setActiveLine] = useState(0);
  const [guesses, setGuesses] = useState([]);
  const [disabledKeyboardLetters, setDisabledKeyboardLetters] = useState({})
  const [dictionary, setDictionary] = useState({});
  const [notInDictionaryAlert, setNotInDictionaryAlert] = useState(false);
  const [victoryAchieved, setVictoryAchieved] = useState(false);
  const [failed, setFailed] = useState(false);
  const [triggerRestart, setTriggerRestart] = useState(false);

  useEffect(() => {
    setWordToBeGuessed(words[Math.floor(Math.random() * words.length)]);
    const dictionary = {}
    for (let word of words) {
      dictionary[word] = true;
    }
    setDictionary(dictionary);
  }, [])

  useEffect(() => {
    if (triggerRestart) {
      setWordToBeGuessed(words[Math.floor(Math.random() * words.length)]);
      setActiveLine(0);
      setWord("");
      setTriggerRestart(false);
      setVictoryAchieved(false);
      setGuesses([]);
      setDisabledKeyboardLetters({})
      setFailed(false);
    }
  }, [triggerRestart])

  const handleRestartClick = () => {
    setTriggerRestart(true);
  }

  const handleKeyboardClick = (letter) => {
    console.log("clicked: ", letter)
    if (letter === ENTER) {
      if (word.length === numLetters) {
        if (!(word in dictionary)) {
          setNotInDictionaryAlert(true);
        } else {
          setWord("")
          setGuesses([...guesses, word])
          setActiveLine(activeLine + 1);
          const letterCountForActualWord = {};
          for (const letter of wordToBeGuessed.split('')) {
            letterCountForActualWord[letter] = 1 + (letterCountForActualWord[letter] === undefined ? 0 : letterCountForActualWord[letter]);
          }

          const lettersToBeDisabled = []
          let solvedCount = 0;
          // Copy pasted logic from checking if Solved/Unsolved
          for (let i = 0; i < word.length; i++) {
            if (word.charAt(i) == wordToBeGuessed.charAt(i)) {
              letterCountForActualWord[word.charAt(i)] -= 1
              solvedCount += 1;
            } else if (letterCountForActualWord[word.charAt(i)] != 0 &&
              letterCountForActualWord[word.charAt(i)] != undefined) {
              letterCountForActualWord[word.charAt(i)] -= 1
            } else {
              // setDisabledKeyboardLetters({...disabledKeyboardLetters, [word.charAt(i)]: true})
              lettersToBeDisabled.push(word.charAt(i))
            }
          }
          const updatedLetterDisabledSet = { ...disabledKeyboardLetters }
          for (let letter of lettersToBeDisabled) {
            // Only disable if key is not in the actual word.
            if (wordToBeGuessed.indexOf(letter) === -1) {
              updatedLetterDisabledSet[letter] = true
            }
          }
          if (solvedCount === numLetters) {
            setVictoryAchieved(true);
          } else {
            if (activeLine + 1 >= numGuesses) {
              setFailed(true);
            }
          }
          setDisabledKeyboardLetters(updatedLetterDisabledSet);

        }
      }
    } else if (letter === BACKSPACE) {
      setWord(word.substring(0, word.length - 1))
      setNotInDictionaryAlert(false);
    }
    else if (word.length <= numLetters) {
      setWord(word + letter);
      setNotInDictionaryAlert(false);
    }

  }
  return (

    <div className="App">
      <div className="heading">
        <h2> Cloned-le </h2>
        <p> Atleast the name's very original :) </p>
      </div>
      <div className="playboard">
        {[...Array(numGuesses).keys()].map((number) =>
          <Line numLetters={numLetters} actualWord={wordToBeGuessed} guessAtLine={guesses[number]} currentGuess={word} lineIndex={number} currentActiveIndex={activeLine} />)}
      </div>

      {/* {wordToBeGuessed} */}
      {notInDictionaryAlert === true ? <div className="not-in-dictionary-alert"> Word not in dictionary </div> : <div/>}
      <VictoryDialog victoryAchieved={victoryAchieved} onRestartClick={handleRestartClick}/>
      <FailDialog actualWord={wordToBeGuessed} fail={failed} onRestartClick={handleRestartClick}/>
      <div className="keyboard">
        <div className="keyboard-toprow">
          {topRowKeys.split('').map(letter => <KeyboardLetter letter={letter} onClick={handleKeyboardClick} disabled={disabledKeyboardLetters[letter]} />)}
        </div>
        <div className="keyboard-midrow">
          {midRowKeys.split('').map(letter => <KeyboardLetter letter={letter} onClick={handleKeyboardClick} disabled={disabledKeyboardLetters[letter]} />)}

        </div>
        <div className="keyboard-bottomrow">
          <KeyboardLetter letter={BACKSPACE} onClick={handleKeyboardClick} />
          {bottomRowKeys.split('').map(letter => <KeyboardLetter letter={letter} onClick={handleKeyboardClick} disabled={disabledKeyboardLetters[letter]} />)}
          <KeyboardLetter letter={ENTER} onClick={handleKeyboardClick} />

        </div>

      </div>
    </div>
  );
}

export default App;
