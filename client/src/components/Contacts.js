import React from 'react'
import { ListGroup, Button } from 'react-bootstrap'
import { useContacts } from '../contexts/ContactsProvider';

export default function Contacts() {
  const { contacts } = useContacts()

  //removes Contacts from contact list. If existsting chat exists with contact, does not remove chat.
  const removeContact = (id) => {
      let savedContacts = JSON.parse(localStorage.getItem("yatc-contacts"))
      savedContacts.splice(id, 1)
      localStorage.setItem("yatc-contacts", JSON.stringify(savedContacts));
      
  }
  // returns list of all saved contacts.
  return (
    <ListGroup variant="flush">
      {contacts.map(contact => (
        <ListGroup.Item key={contact.id}>
          {contact.name}
          <Button type="button" className="align-self-right" onClick={(e) => removeContact(contact.id)}> X </Button>
        </ListGroup.Item>
      ))}
    </ListGroup>
  )
}
