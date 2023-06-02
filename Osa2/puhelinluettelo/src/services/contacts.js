import axios from "axios";
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
    return axios.get(baseUrl).then(response => response.data)
    
}

const create = newContact => {
    return axios.post(baseUrl, newContact).then(response => response.data)
}

const removeContact = id => {
    return axios.delete(`${baseUrl}/${id}`)
}

const updateNumber = contact => {
    // console.log(contact)
    return axios.put(`${baseUrl}/${contact.id}`, contact)
}

export default {getAll, create, removeContact, updateNumber}