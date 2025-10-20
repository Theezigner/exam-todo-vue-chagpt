<script setup lang="ts">
import { ref, watch } from "vue";
import axios from "axios";
import { marked } from "marked";
import DOMPurify from "dompurify";

// Environment Variable & Constants

const API_URL = import.meta.env.VITE_API_URL || process.env.VUE_APP_API_URL;
const apiUrl = `${API_URL}/api/chat`;

const STORAGE_KEY = "ai_chat_history";
interface ChatMessage {
  id: number;
  content: string;
  isUser: boolean;
}

//  Persistence Logic (Load History)
const loadHistory = (): ChatMessage[] => {
  const history = localStorage.getItem(STORAGE_KEY);
  try {
    return history ? JSON.parse(history) : [];
  } catch (e) {
    console.error("Error loading chat history from localStorage", e);
    return [];
  }
};

// Reactive State (using ref())
const userInput = ref("");
const loading = ref(false);
const messages = ref<ChatMessage[]>(loadHistory());
const messageListRef = ref<HTMLElement | null>(null);
//Watcher to Persist Chat History
watch(
  messages,
  (newMessages) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newMessages));
  },
  { deep: true }
);

// Methods
const scrollToBottom = () => {
  if (messageListRef.value) {
    messageListRef.value.scrollTop = messageListRef.value.scrollHeight;
  }
};

const sendMessage = async () => {
  if (!userInput.value.trim() || loading.value) return;

  const userMessage = userInput.value.trim();
  userInput.value = "";
  loading.value = true;

  messages.value.push({
    id: Date.now(),
    content: userMessage,
    isUser: true,
  });
  setTimeout(() => scrollToBottom(), 10);

  try {
    const response = await axios.post(apiUrl, {
      message: userMessage,
      history: messages.value,
    });

    const aiResponse = response.data.answer;

    messages.value.push({
      id: Date.now() + 1,
      content: aiResponse,
      isUser: false,
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    messages.value.push({
      id: Date.now() + 1,
      content:
        "Sorry, communication error. Please check your backend server terminal.",
      isUser: false,
    });
  } finally {
    loading.value = false;
    setTimeout(() => scrollToBottom(), 10);
  }
};

const renderMarkdown = (content: string): string => {
  const html = marked.parse(content, {
  }) as string;

  return DOMPurify.sanitize(html);
};

const clearChatHistory = () => {
  messages.value = [];
  localStorage.removeItem(STORAGE_KEY);
  userInput.value = "";
  console.log("Chat history cleared.");
};
</script>

<template>
  <div class="chat-container">
    <div class="chat-header">
      <button @click="clearChatHistory" class="clear-button">
        Clear Chat History
      </button>
    </div>

    <div class="message-list" ref="messageListRef">
      <div
        v-for="message in messages"
        :key="message.id"
        :class="{ 'user-msg': message.isUser, 'ai-msg': !message.isUser }"
      >
        <strong v-if="message.isUser">You:</strong>
        <strong v-else>AI:</strong>

        <span v-if="message.isUser">
          {{ message.content }}
        </span>
        <span v-else v-html="renderMarkdown(message.content)"> </span>
      </div>
    </div>

    <div class="input-area"></div>
   
    <div class="input-area">
      <input
        v-model="userInput"
        @keyup.enter="sendMessage"
        placeholder="Ask me anything..."
        :disabled="loading"
      />
      <button @click="sendMessage" :disabled="loading">
        {{ loading ? "Sending..." : "Send" }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  height: 450px;
  width: 400px;
  display: flex;
  flex-direction: column;
  margin: 20px auto;
}
.message-list {
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px;
  background-color: #f9f9f9;
  margin-bottom: 10px;
  border-radius: 4px;
}
.user-msg {
  text-align: right;
  background-color: #cfccf1;
  color: black;
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 12px 12px 2px 12px;
}
.ai-msg {
  text-align: left;
  background-color: #ce96e4;
  color: black;
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 12px 12px 12px 2px;
}
.input-area {
  display: flex;
}
.input-area input {
  flex-grow: 1;
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 20px;
}
.input-area button {
  padding: 10px 15px;
  border: none;
  border-radius: 20px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}
.input-area button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.chat-header {
  display: flex;
  justify-content: flex-end;
  padding-bottom: 10px;
}

.clear-button {
  background: none;
  border: 1px solid #dc3545;
  color: #dc3545;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background-color 0.2s, color 0.2s;
}

.clear-button:hover {
  background-color: #dc3545;
  color: white;
}
</style>
