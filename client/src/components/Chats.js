import React from 'react'
import { Button, ListGroup } from 'react-bootstrap'
import { useChats } from '../contexts/ChatsProvider';

const Chats = () => {
  const { chats, selectChatIndex } = useChats()

  const removeChat = (index) => {
    let savedChats = JSON.parse(localStorage.getItem("yatc-chats"))
    savedChats.splice(index, 1)
    localStorage.setItem("yatc-chats", JSON.stringify(savedChats))
  }

  return (
    <>
    <ListGroup variant="flush">
      {chats.map((chat, index) => (
        <ListGroup.Item
          key={index}
          action
          onClick={() => selectChatIndex(index)}
          active={chat.selected}
          className="align-self-left"
        >
          {chat.members.map(m => m.name).join(', ')}
          <Button type="button" className="align-self-right" onClick={(e) => removeChat(index)}> X </Button>
        </ListGroup.Item>
      ))}
    </ListGroup>
    
    </>
  )
}

export default Chats;
