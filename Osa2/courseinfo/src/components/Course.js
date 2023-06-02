const Header = (props) => {
    return (
      <>
        <h2>{props.title}</h2>
      </>
    )
  }
  
  const Content = (props) =>  {
    const {parts} = props
    return (
      <>
        {/* <Part  parts={props.parts[0]}/>
        <Part  parts={props.parts[1]} />
        <Part  parts={props.parts[2]} /> */}
        {parts.map(part => <Part key={part.id} parts={part} />)}
      </>
    )
  }
  
  const Part = (props) => {
    return (
      <>
        <p>{props.parts.name} {props.parts.exercises}</p>
      </>
    )
  }
  
  const Total = (props) => {
    const { parts } = props
    return (
      <>
        <b>Number of exercises {parts.reduce(((sum, part) => sum + part.exercises),0)}</b>
      </>
    )
  }

const Course = (props) => {
    return (
        <div>
          <Header title={props.course.name}/>
          <Content parts={props.course.parts} />
          <Total parts={props.course.parts} />
        </div>
      )
}

export default Course