import { useState, useEffect } from 'react'
import axios from 'axios'
import contactsService from './services/contacts'

const FilterResults = (props) => {
  return (
  <div>filter shown with: <input value={props.newSearch} onChange={props.filterPersons} /></div>
  )
}

const AddNewPerson = (props) => {
  return (
    <>
    <h3>add a new name</h3>
    <form onSubmit={props.addPerson}>
      <div>
        name: <input value={props.newName} onChange={props.handleNewPerson} />
      </div>
      <div>
        number: <input value={props.newNumber} onChange={props.handeNewNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  </>
  )
}

const ShowPersons = (props) => {
  return (
    <>
    <h2>Numbers</h2>
    {props.personsToShow.map(person => <PersonLine key={person.name} person={person} deleteContact={() => props.deleteContact(person)}  />)}
    </>)
}

const PersonLine = (props) => {

  return (
    <div>
    {props.person.name} {props.person.number}<button onClick={props.deleteContact}>delete</button>
    </div>
  )
}

const Notification = ({message, type}) => {
  if (message === null) {
    return null
  }
  let bordercolor = 'red'
  if (type === 'notice') {
    bordercolor = 'green'
  } 
  const bannerStyle = {
    background: '#d7dadb',
    borderStyle: 'dashed',
    borderWidth: 'thick',
    borderColor: bordercolor,
    padding: 10,
    margin: 10
  }

  return (
    <div style={bannerStyle}>
      {message}
    </div>
  )
}



const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState('notice')

  useEffect(() => {
    
    contactsService
    .getAll()
    .then(contacts => {

        setPersons(contacts)
      })

  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    
    const newPerson = {name: newName,
                      number: newNumber}
    //Includesia en saanut toimimaan ilman useita totuusvertailuja, 
    //find olisi toiminut, mutta koska listat on lyhyitä tässä tehtävässä
    //päädyin käyttämään some() koska se palauttaa suoraan totuusarvon ja sain puristettua testauksen "yhdelle" riville
    if (persons.some(person => person.name === newPerson.name)) {
      if (window.confirm(`${newPerson.name} is already in phonebook, replace the old number with new one?`)) {
        const id = persons.find(lookinFor => lookinFor.name === newPerson.name).id
        newPerson['id'] = id
        // console.log(newPerson)
        contactsService.updateNumber(newPerson).then(response => {
          setPersons(persons.map(person => person.id !== newPerson.id ? person : response.data))
          setNewName("")
          setNewNumber("")
          setNotificationType('notice')
          setNotificationMessage(`Number updated!`)
        }).catch(() => {
          setNotificationType('error')
          setNotificationMessage("Number can't be updated because it was removed from phonebook")
        })
      }
    } else {
      addPersonToPhonebook(newPerson)
    }
  }

  const addPersonToPhonebook = (person) => {
    //Lisäys on nyt axios post metodin sisällä, jotta jos POST ei onnistu niin ei sitä myöskään lisätä
    //turhaan näkymään pelkästään selainnäkymässä, luulisin
    contactsService
      .create(person)
      .then(response => {
        // console.log(response)
        setPersons(persons.concat(response))
        setNewName("")
        setNewNumber("")
        setNotificationType('notice')
        setNotificationMessage(`${person.name} added to phonebook`)
      }).catch(() => {
        setNotificationType('error')
        setNotificationMessage(`Encountered error while adding to phonebook`)
      } )
      setTimeout(() => {
        setNotificationMessage(null)
      }, 4321)
  }

  const deleteContact = ({id, name}) => {
    if (window.confirm(`Do you want to delete ${name}?`)) {
      contactsService
        .removeContact(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
          setNotificationType('notice')
          setNotificationMessage(`${name} removed!`)
        }).catch( () => {
          setNotificationType('error')
          setNotificationMessage(`Could not remove ${name}`)
        })
        setTimeout(() => {
          setNotificationMessage(null)
        }, 4321)
    }
  }

  const handleNewPerson = (event) => {
    // console.log(event.target)
    setNewName(event.target.value)
  } 

  const handeNewNumber = (event) => {
    setNewNumber(event.target.value)
  }

  let personsToShow = persons.filter(person => person.name.toLowerCase().includes(newSearch.toLowerCase()))

  const filterPersons = (event) => {
    setNewSearch(event.target.value)
    setShowAll(false)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <FilterResults newSearch={newSearch} filterPersons={filterPersons} />
      <AddNewPerson addPerson={addPerson} newName={newName} newNumber={newNumber} handleNewPerson={handleNewPerson} handeNewNumber={handeNewNumber}/>
      <Notification message={notificationMessage} type={notificationType} />
      <ShowPersons personsToShow={personsToShow} deleteContact={deleteContact}/>
    </div>
  )

}

export default App