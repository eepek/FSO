import { useState } from 'react'

const Mostvoted = (props) => {
  return (
    <>
      <h1>most voted anecdote</h1>
      <p>{props.anecdote}</p>
    </>
  )
}


const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
  const [vote, setVote] = useState(Array(anecdotes.length).fill(0));
  const [selected, setSelected] = useState(0)
  
  const handleClick = () => {
    let number = Math.floor(Math.random()*(anecdotes.length))
    while (number === selected) {
      number = Math.floor(Math.random()*(anecdotes.length))
    }
    setSelected(number)
  }
  
  const voteClick = (number) => {
    const votes_updated = [...vote]
    votes_updated[number] += 1
    setVote(votes_updated)
    handleClick()
  }
  console.log(vote)
  return (
    <>
    <h1>anecdote of the day</h1>
    <div>
      {anecdotes[selected]}
    </div>
    <p>has {vote[selected]} votes</p>
    
    <button onClick={() => voteClick(selected)}>Vote</button>
    <button onClick={handleClick}>Next anecdote</button>
    <br></br>
    <Mostvoted anecdote={anecdotes[vote.indexOf(Math.max(...vote))]} />
    </>
  )
}

export default App