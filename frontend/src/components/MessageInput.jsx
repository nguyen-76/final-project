import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useSetRecoilState } from "recoil";
import { conversationAtom, selectedConversationAtom } from "../app/messageAtom";

const MessageInput = ({ setMessages }) => {
  const [messagesText, setMessagesText] = useState("");
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const setConversations = useSetRecoilState(conversationAtom);

  const showToast = useShowToast();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messagesText) return;
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messagesText,
          recipientId: selectedConversation.userId,
        }),
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.message, "error");
        return;
      }

      setMessages((messages) => [...messages, data]);

      setConversations((prevConvos) => {
        const updatedConversations = prevConvos.map((conversation) => {
          if (conversation._id === selectedConversation._id) {
            return {
              ...conversation,
              lastMessage: {
                text: messagesText,
                sender: data.sender,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
      setMessagesText("");
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  return (
    <form onSubmit={handleSendMessage}>
      <InputGroup>
        <Input
          w={"full"}
          placeholder="Type a message"
          onChange={(e) => setMessagesText(e.target.value)}
          value={messagesText}
        />
        <InputRightElement onClick={handleSendMessage} cursor={"pointer"}>
          <IoSendSharp />
        </InputRightElement>
      </InputGroup>
    </form>
  );
};

export default MessageInput;
