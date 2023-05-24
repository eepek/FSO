import { useState } from 'react'

const Button = (props) => (
  <td>
    <button onClick={props.handleClick}>{props.text}</button>
  </td>
)

const Statistics = (props) => {

  if (props.good > 0 || props.bad > 0 || props.neutral > 0) {
    const total = props.good + props.bad + props.neutral
    const average = (props.good - props.bad) / total
    const positive = 100*(props.good / total)
    return (
    <>
      <tr>
        <th colSpan={3} style={{padding: 5}}>Statistics</th>
      </tr>
        <StatisticLine text='good' value={props.good} />

        <StatisticLine text='neutral' value={props.neutral} />

        <StatisticLine text='bad' value={props.bad} />
        <StatisticLine text='total' value={total} />
        <StatisticLine text='average' value={average} />
        <StatisticLine text='positive' value={positive + ' %' } />
      
    </>
    )
    }

  return (
   <> 
    <tr> 
     <th colSpan={3} style={{padding: 5}}>Statistics</th>
    </tr>
    <tr>
     <td colSpan={3}>No feedback given</td>
    </tr>
    </>
  )
  }

const StatisticLine = (props) => {

  return (
  <tr>
    <td>{props.text}</td><td>{props.value}</td>
  </tr>
  )
  }

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const increaseGood = () => setGood(good + 1)
  const increaseNeutral = () => setNeutral(neutral + 1)
  const increaseBad = () => setBad(bad + 1)

  return (
    <table>
    <tbody>
      <tr >
      <th colSpan={3} style={{padding: 10}}>Give feedback</th>
      </tr>
      <tr>
      <Button handleClick={increaseGood} text='Good'/>
      <Button handleClick={increaseNeutral} text='Neutral' />
      <Button handleClick={increaseBad} text='Bad' />
      </tr>
      <Statistics good={good} neutral={neutral} bad={bad} />

    </tbody>
    </table>
  )
}

export default App
