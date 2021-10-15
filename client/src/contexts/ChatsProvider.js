import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import useLocalStorage from '../hooks/useLocalStorage';
import { useContacts } from './ContactsProvider';
import { useSocket } from './SocketProvider';

const ChatsContext = createContext()

export const useChats = () => {
  return useContext(ChatsContext)
}

export const ChatsProvider = ({ id, children }) => {
  const [chats, setChats] = useLocalStorage('chats', [])
  const [selectedChatIndex, setSelectedChatIndex] = useState(0)
  const { contacts } = useContacts()
  const socket = useSocket()
  //creates a blank chat in localStorage chat array which is an array of members and an array of messages with sender attached
  const createChat = (members) => {
    if(members.length >= 1){
      setChats(prevChats => {
        return [...prevChats, { members, messages: [] }]
      })
    }
  }
  //checks if chat with selected members exists, if false creates a new empty chat with selected members.
  //if true, sends a message to pre-existing chat.  
  const addMessageToChat = useCallback(({ members, text, sender }) => {
    setChats(prevChats => {
      let madeChange = false
      const newMessage = { sender, text }
      const newChats = prevChats.map(chat => {
        if (arrayEquality(chat.members, members)) {
          madeChange = true
          return {
            ...chat,
            messages: [...chat.messages, newMessage]
          }
        }

        return chat
      })

      if (madeChange) {
        return newChats
      } else {
        return [
          ...prevChats,
          { members, messages: [newMessage] }
        ]
      }
    })
  }, [setChats])

  useEffect(() => {
    if (socket == null) return

    socket.on('receive-message', addMessageToChat)

    return () => socket.off('receive-message')
  }, [socket, addMessageToChat])

  const sendMessage = (members, text) => {
    socket.emit('send-message', { members, text })

    addMessageToChat({ members, text, sender: id })
  }

  const formattedChats = chats.map((chat, index) => {
    const members = chat.members.map(recipient => {
      const contact = contacts.find(contact => {
        return contact.id === recipient
      })
      const name = (contact && contact.name) || recipient
      return { id: recipient, name }
    })

    const messages = chat.messages.map(message => {
      const contact = contacts.find(contact => {
        return contact.id === message.sender
      })
      const name = (contact && contact.name) || message.sender
      const fromMe = id === message.sender
      return { ...message, senderName: name, fromMe }
    })
    
    const selected = index === selectedChatIndex
    return { ...chat, messages, members, selected }
  })

  const value = {
    chats: formattedChats,
    selectedChat: formattedChats[selectedChatIndex],
    sendMessage,
    selectChatIndex: setSelectedChatIndex,
    createChat
  }

  return (
    <ChatsContext.Provider value={value}>
      {children}
    </ChatsContext.Provider>
  )
}

const arrayEquality = (a, b) => {
  if (a.length !== b.length) return false

  a.sort()
  b.sort()

  return a.every((element, index) => {
    return element === b[index]
  })
}