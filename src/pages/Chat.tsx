import { FormEvent, useEffect, useState } from "react";
import io from "socket.io-client";

import { v4 as uuid } from "uuid";

let myId = uuid();
const socket = io("http://localhost:8080");
socket.on("connect", () => console.log("[IO] Connection sucessfully established"));

interface IMessage {
    id: string;
    text: string;
}


const Chat = () => {
    
    const [messages, updateMessages] = useState<IMessage[]>([]);
    const [message, updateMessage] = useState<IMessage>({id: "0", text: ""});

    useEffect((): any => {
        const handleNewMessage = (newMessage: IMessage) => {
            updateMessages([...messages, newMessage]);
            console.log(messages);
        };
        socket.on("chat.message", handleNewMessage);
        return () => socket.off("chat.message", handleNewMessage);
    },[messages])

    const handleInputChange = (event: FormEvent<HTMLInputElement>) => {
        updateMessage({
            id: myId,
            text: event.currentTarget.value
        });
    }

    const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (message.text.trim()) {
            socket.emit("chat.message", {
                id: myId,
                text: message.text
            });
            updateMessage({id: myId, text: ""});
        }
    }

    return (
        <main className="container">
            <ul className="list">
                {messages.map((newMessage, key) => (
                <li className={`list__item list__item--${myId === newMessage.id ? "mine" : "other"}`} key={key}>
                    <span className={`message message--${myId === newMessage.id ? "mine" : "other"}`}>
                        {newMessage.text}
                    </span>
                </li>
                ))}
               
            </ul>
            <form onSubmit={handleFormSubmit} className="form">
                <input 
                    type="text" 
                    placeholder="Type a new message here" 
                    className="form__field"
                    onChange={handleInputChange} 
                    value={message.text}
                />
            </form>
        </main>
    )
}

export default Chat;