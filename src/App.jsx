import { useEffect, useState } from "react";
import "./App.css";

function Card({ src, user, tags, id, setClicked }) {
  return (
    <div className="card" onClick={()=>setClicked(id)}>
      <img src={src} className="card-img" />
      <p>
        {user} -- {tags}{" "}
      </p>
    </div>
  );
}

function App() {
  const [count, setCount] = useState(0);
  const [pics, setPics] = useState([]);
  const [currScore, setCurrScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [restart, setRestart] = useState(0)
  useEffect(function () {
    (async function testAPI() {
      async function fetchOp (page) {
        let req = await fetch(
          `https://pixabay.com/api/?key=41170801-35310c2fd89b39439f4b376cc&category=people&page=${page}}`
        );
        let res = await req.json();
        console.log(res);
        return res.hits.map(function (elem) {
          return {
            url: elem.largeImageURL,
            user: elem.user,
            tag: elem.tags,
            id: elem.id,
            isClicked: false,
          };
        });
      }
      let arr1 = await fetchOp(1)
      let arr2 = await fetchOp(2)
      arr1.push(...arr2)
      console.log(arr1)
      setPics(arr1);
    })();
  }, [restart]);

  function shuffleArr (arr) {
    return arr.sort(() => Math.random() - 0.5);
  }

  function handleCardClick(id) {
    if (pics[pics.findIndex(elem => elem.id==id)].isClicked===true) {
      if (bestScore < currScore) setBestScore(currScore)
        setCurrScore(0)        
        setRestart(!restart)
    }
    else {
      // if pics NOT clicked before
      let picsCopy = structuredClone(pics)
      let indexToBeClick = picsCopy.findIndex((element) => element.id==id)
      picsCopy[indexToBeClick].isClicked=true
      console.log(picsCopy[indexToBeClick])
      picsCopy=shuffleArr(picsCopy)
      setPics(picsCopy)
      setCurrScore((score)=> score+1)
    }

  }

  return (
    <div className="">
      <div className="top">
        <div className="title">
          <h1>Amphibia Memory Game</h1>
          <p>
            Get points by clicking on an image but don't click on any more than
            once!
          </p>
        </div>
        <div className="scoreboard">
          <p>Current Score: {currScore} </p>
          <p>Best Score: {bestScore} </p>
        </div>
      </div>
      <div className="cards">
        {pics.map((pic) => (
          <Card
            src={pic.url}
            user={pic.user}
            tags={pic.tag}
            id={pic.id}
            setClicked={ handleCardClick }
          />
        ))}
      </div>
    </div>
  );
}

export default App;
