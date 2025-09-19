import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Avatar, Tooltip, Box } from "@chakra-ui/react";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../miscellaneous/chatLogic";

const ScrollableChats = ({ messages }) => {
  const user = useSelector((state) => state.userSlice.userData);
  const containerRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Reliable scroll-to-bottom whenever messages change
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // direct scroll (most reliable)
    el.scrollTop = el.scrollHeight;

    // fallback / smooth scroll for browsers that support it
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  return (
    <Box
      ref={containerRef}
      h="100%"                 // container will fill parent's height
      overflowY="auto"        // enable vertical scrolling
      p={3}
      display="flex"
      flexDirection="column"
      gap={1}
    >
      {messages &&
        messages.map((m, i) => (
          <Box
            key={m._id}
            display="flex"
            alignItems="flex-end"
            // ensure each message row doesn't collapse
            width="100%"
          >
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}

            <Box
              maxW="75%"
              borderRadius="20px"
              px={4}
              py={2}
              color="black"
              // keep the same color logic you had
              bg={m.sender._id === user._id ? "#4DA6FF" : "#6AFF4D"}
              // margin left uses your helper (it should return a value suitable for Chakra's ml)
              ml={isSameSenderMargin(messages, m, i, user._id)}
              mt={isSameUser(messages, m, i, user._id) ? 1 : 3}
              // align self so current user's messages float right
              alignSelf={m.sender._id === user._id ? "flex-end" : "flex-start"}
              wordBreak="break-word"
            >
              {m.content}
            </Box>
          </Box>
        ))}

      {/* invisible element to ensure scrollIntoView works */}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default ScrollableChats;
