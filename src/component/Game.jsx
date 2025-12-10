import "./Game.css"
import { useEffect, useState } from "react";
import SingleCard from "./SingleCard.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { SiPokemon } from "react-icons/si";
import { saveGameRecord } from "../gameService.js";
import Leaderboard from "./Leaderboard.jsx";


const normalCards = [
  { src: "/img/bulbasaur.png", group:"bulbasaur", matched: false },
  { src: "/img/ivysaur.png", group:"bulbasaur", matched: false },
  { src: "/img/charmander.png",group:"charmander", matched: false },
  { src: "/img/charmeleon.png", group: "charmander", matched: false },
  { src: "/img/squirtle.png",group: "squirtle", matched: false },
  { src: "/img/wartortle.png",group: "squirtle", matched: false },
  { src: "/img/chikorita.png", group: "chikorita", matched: false },
  { src: "/img/bayleef.png", group: "chikorita", matched: false },
  { src: "/img/cyndaquil.png", group: "cyndaquil", matched: false },
  { src: "/img/quilava.png", group: "cyndaquil", matched: false },
  { src: "/img/totodile.png", group: "totodile", matched: false },
  { src: "/img/croconaw.png", group: "totodile", matched: false },
  { src: "/img/treecko.png", group: "treecko", matched: false },
  { src: "/img/grovyle.png", group: "treecko", matched: false },
  { src: "/img/torchic.png", group: "torchic", matched: false },
  { src: "/img/combusken-f.png", group: "torchic", matched: false },
  { src: "/img/mudkip.png", group: "mudkip", matched: false },
  { src: "/img/marshtomp.png", group: "mudkip", matched: false },
  { src: "/img/turtwig.png", group: "turtwig", matched: false },
  { src: "/img/grotle.png", group: "turtwig", matched: false },
  { src: "/img/chimchar.png", group: "chimchar", matched: false },
  { src: "/img/monferno.png", group: "chimchar", matched: false },
  { src: "/img/piplup.png", group: "piplup", matched: false },
  { src: "/img/prinplup.png", group: "piplup", matched: false },
];

const hardCards = [
  { src: "/img/bulbasaur.png", group:"bulbasaur", matched: false },
  { src: "/img/venusaur-f.png", group:"bulbasaur", matched: false },
  { src: "/img/charmander.png",group:"charmander", matched: false },
  { src: "/img/charizard.png", group: "charmander", matched: false },
  { src: "/img/squirtle.png",group: "squirtle", matched: false },
  { src: "/img/blastoise.png",group: "squirtle", matched: false },
  { src: "/img/chikorita.png", group: "chikorita", matched: false },
  { src: "/img/meganium-f.png", group: "chikorita", matched: false },
  { src: "/img/cyndaquil.png", group: "cyndaquil", matched: false },
  { src: "/img/typhlosion.png", group: "cyndaquil", matched: false },
  { src: "/img/totodile.png", group: "totodile", matched: false },
  { src: "/img/feraligatr.png", group: "totodile", matched: false },
  { src: "/img/treecko.png", group: "treecko", matched: false },
  { src: "/img/sceptile.png", group: "treecko", matched: false },
  { src: "/img/torchic.png", group: "torchic", matched: false },
  { src: "/img/blaziken-f.png", group: "torchic", matched: false },
  { src: "/img/mudkip.png", group: "mudkip", matched: false },
  { src: "/img/marshtomp.png", group: "mudkip", matched: false },
  { src: "/img/turtwig.png", group: "turtwig", matched: false },
  { src: "/img/torterra.png", group: "turtwig", matched: false },
  { src: "/img/chimchar.png", group: "chimchar", matched: false },
  { src: "/img/infernape.png", group: "chimchar", matched: false },
  { src: "/img/piplup.png", group: "piplup", matched: false },
  { src: "/img/empoleon.png", group: "piplup", matched: false },
  { src: "/img/snivy.png", group: "snivy", matched: false },
  { src: "/img/serperior.png", group: "snivy", matched: false },
  { src: "/img/tepig.png", group: "tepig", matched: false },
  { src: "/img/emboar.png", group: "tepig", matched: false },
  { src: "/img/oshawott.png", group: "oshawott", matched: false },
  { src: "/img/samurott.png", group: "oshawott", matched: false },

]

export default function Game() {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null)
  const [choiceTwo, setChoiceTwo] = useState(null)
  const [disabled, setDisabled] = useState(false)
  const [countdown, setCountdown] = useState(null)
  const [time, setTime] = useState(0)
  const [isTiming, setIsTiming] = useState(false)
  const [gameActive, setGameActive] = useState(false);
  const [error, setError] = useState("")
  const [showCongrats, setShowCongrats] = useState(false)
  const [recordSaved, setRecordSaved] = useState(false)
  const [refreshLeaderboard, setRefreshLeaderboard] = useState(0)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [difficulty, setDifficulty] = useState(null)
  const [showDifficultySelect, setShowDifficultySelect] = useState(true)
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  async function handleLogout() {
    setError("")

    try {
      await logout()
      navigate('/login')
    } catch {
      setError('登出失敗：' + error.message)
    }
  }

  //select level
  const selectDifficulty = (level) => {
    setDifficulty(level)
    setShowDifficultySelect(false)
    shuffleCards(level)
  }

  //re-select level
  const changeDifficulty = () => {
    setShowDifficultySelect(true)
    setDifficulty(null)
    setCards([])
    setTurns(0)
    setTurns(0)
    setTime(0)
    setIsTiming(false)
    setGameActive(false)
    setCountdown(null)
  }

  //countdown
  const startGame = () => {
    if(!difficulty){
      setShowDifficultySelect(true)
      return
    }
    setGameActive(false)
    setIsTiming(false)
    setTime(0)
    setShowCongrats(false)
    setRecordSaved(false)

    shuffleCards(difficulty)
    
    let num = 3;
    setCountdown(num)
    
    const timer = setInterval(() => {
      num--;
      if(num === 0){
        clearInterval(timer)
        setCountdown(null)

        setIsTiming(true)
        setGameActive(true)
      } else {
        setCountdown(num);
      }
    }, 1000)
  }

  //count time
  useEffect(() => {
    let timerId
    if(isTiming){
      timerId = setInterval(()=>{
        setTime(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(timerId)
  },[isTiming])

  //time stop and save record
  useEffect(() => {
    if(cards.length > 0 && cards.every(card => card.matched)){
      setIsTiming(false)
      setGameActive(false)
      setShowCongrats(true)
      
      // 儲存遊戲記錄
      if (!recordSaved && currentUser) {
        saveGameRecord(currentUser.uid, currentUser.email, turns, time, difficulty)
          .then(result => {
            if (result.success) {
              console.log('記錄已儲存!');
              setRecordSaved(true);
              setRefreshLeaderboard(prev => prev + 1); 
            }
          })
          .catch(error => {
            console.error('儲存記錄時發生錯誤:', error);
          });
      }
    }
  }, [cards, currentUser, turns, time, recordSaved, difficulty])



  //handle a choice
  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
  }

  useEffect(()=>{
    if (choiceOne && choiceTwo){
      setDisabled(true)
      if(choiceOne.group === choiceTwo.group){
        setCards(prevCards => {
          return prevCards.map(card => {
            if(card.group === choiceOne.group){
              return {...card, matched: true}
            } else
              return card
          })
        })
        resetTurn()
      } else {
        setTimeout(() => resetTurn(), 1000)
      }
    }
  }, [choiceOne, choiceTwo])

  const resetTurn = () => {
    setChoiceOne(null)
    setChoiceTwo(null)
    setTurns(prevTurns => prevTurns + 1)
    setDisabled(false)
  }

  //shuffle cards
  const shuffleCards = (level) => {
    const cardSet = level === "hard" ? hardCards : normalCards

    const shuffledCards = [...cardSet]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setChoiceOne(null)
    setChoiceTwo(null)
    setCards(shuffledCards);
    setTurns(0);
  };

  return (
    <div className="App">
      <div className="header">
        <h2 className="title"><SiPokemon />進化配對遊戲</h2>
        <div className="user">
          <span className="user-email">玩家: {currentUser?.email}</span>
          <button onClick={() => setShowLeaderboard(true)} className="leaderboard-button">排行榜</button>
          <button onClick={handleLogout} className="logout-button">登出</button>
        </div>
      </div>

      {showDifficultySelect && (
        <div className="difficulty-overlay">
          <div className="difficulty-modal">
            <h2>選擇難度</h2>
            <div className="difficulty-cards">
              <div className="difficulty-card" onClick={() => selectDifficulty("normal")}>
              <h3>普通模式</h3>
              <p>24張卡片（12對）</p>
              <p className="difficulty-example">一階 → 二階進化</p>
            </div>
            <div className="difficulty-card hard" onClick={() => selectDifficulty("hard")}>
              <h3>困難模式</h3>
              <p>30張卡片（15對）</p>
              <p className="difficulty-example">二階 → 三階進化</p>
            </div>
          </div>
        </div>
        </div>
      )}
      <div className="control">
        <button onClick={startGame} disabled={countdown !== null || !difficulty}>
          {difficulty ? "Start" : "請先選擇難度"}
        </button>
        {difficulty && (
          <button onClick={changeDifficulty} className="change-difficulty-btn">
              切換難度
            </button>
        )}
        <div className="control-right">
          <p className="stats">
            {difficulty && (
              <span className={`difficulty-badge ${difficulty}`}>
                {difficulty === 'normal' ? '普通' : '困難'}
              </span>
            )}
            Turns: {turns} | Time: {formatTime(time)}</p>
        </div>
      </div>   
      
      {countdown !== null && (
        <div className="countdown" key={countdown}>
          {countdown}
        </div>
      )}

      {showCongrats && (
        <div className="congrats-overlay">
          <div className="congrats-message">
            <h2>恭喜完成遊戲</h2>
            <p className={`difficulty-complete ${difficulty}`}>
              {difficulty === 'normal' ? '普通模式' : '困難模式'}
            </p>
            <p>翻牌次數: <strong>{turns}</strong></p>
            <p>完成時間: <strong>{formatTime(time)}</strong></p>
            <p className="saved-text"> ✓ 記錄已儲存 </p>
            <button onClick={() => setShowCongrats(false)} className="close-button">
              關閉
            </button>
          </div>
        </div>
      )}

      <div className={`card-grid ${difficulty === "hard" ? "hard-mode" : ""}`}>
        {cards.map((card) => (
          <SingleCard 
            key={card.id} 
            card={card} 
            handleChoice={handleChoice} 
            flipped={card === choiceOne || card === choiceTwo || card.matched} 
            disabled={disabled || !gameActive}
          />
        ))}
      </div>

      <Leaderboard isOpen={showLeaderboard} onClose={() => setShowLeaderboard(false)} refreshTrigger = {refreshLeaderboard} />
    </div>
  );
}