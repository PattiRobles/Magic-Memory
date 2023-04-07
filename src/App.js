import { useEffect, useState } from "react";
import "./App.css";
import { SingleCard } from "./components/SingleCard.js";

const cardImages = [
  { src: "/img/helmet-1.png", matched: false },
  { src: "/img/potion-1.png", matched: false },
  { src: "/img/ring-1.png", matched: false },
  { src: "/img/scroll-1.png", matched: false },
  { src: "/img/shield-1.png", matched: false },
  { src: "/img/sword-1.png", matched: false },
];

function App() {
  const [cards, setCards] = useState([]); // 12 sets cards for new game
  const [turns, setTurns] = useState(0); // counter for
  const [choiceOne, setChoiceOne] = useState();
  const [choiceTwo, setChoiceTwo] = useState();
  const [counter, setCounter] = useState(0);
  const [disabled, setDisabled] = useState(false);

  //shufflecards - duplicate, randomise, assign random id & sets state
  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages] //2 lots of the initial array
      .sort(() => Math.random() - 0.5) // NEG: remain in same order POSITIVE: switches order around
      .map((card) => ({ ...card, id: Math.random() })); // maps through each element of the array and gives it a unique id property
    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    setCounter(0);
  };

  //handle choice
  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
    // checks if choiceone alseady has a value, if truthy, ie not evaluates as null, it already has a value (therefore sets choice 2) if NULL evaluates as false (and set 1),
  };
  //can compare values straight after because state has actually not updated, they are scheduled for the end. use useEffect hook

  //compare 2 cards
  //(useeffect fires on the first render of the component and thgen whenever the value in the dependency array changes)
  useEffect(() => {
    // setDisabled(true); // useeffect runs when the component first evaluates / mounts - therefore at the beginning all cards set to disabled, wont flick
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.src === choiceTwo.src) {
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              // or equal to choice2 as they are the same
              return { ...card, matched: true }; //returns a new object, we spread out the properties of the card (src and match property) and then we change the matched property to be true
            } else {
              return card;
            }
          });
        });
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  //console.log(cards);

  // const compareChoices = (choiceOne, choiceTwo) => {
  //   if (choiceOne && choiceTwo) {
  //     console.log();
  //     resetTurn();
  //   }
  // };

  // compareChoices();

  //reset choices and increase a turn
  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setCounter((prevCount) => prevCount + 1);
    setDisabled(false);
  };

  //start the game automatically
  useEffect(() => {
    shuffleCards();
  }, []);

  return (
    <div className="App">
      <h1>Magic Match</h1>
      <button onClick={shuffleCards}>New Game</button>

      <div className="card-grid">
        {cards.map((card) => (
          <SingleCard //all these below are PROPS
            card={card}
            key={card.id}
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo || card.matched} // passed as prop to single card component
            disabled={disabled}
          />
        ))}
      </div>
      <p>Number of turns {counter}</p>
    </div>
  );
}

export default App;
