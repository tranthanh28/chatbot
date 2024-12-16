<script setup>
import MarkdownIt from "markdown-it";
import { ref, watch, nextTick, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Cookies from 'js-cookie';

const markdown = new MarkdownIt();
const chatContainer = ref(null);
const messages = ref([]);
const input = ref('');
const isLoading = ref(false);
const maxTokens = ref(1000);
const temperature = ref(0.7);

const config = useRuntimeConfig();
const api = config.public.apiBackend;
const token = config.public.tokenBackend;

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!input.value) return;

  messages.value.push({
    role: 'user',
    content: input.value
  });

  input.value = '';
  await fetchApiChat()
};

const fetchApiChat = async () => {
  try {
    isLoading.value = true;
    const response = await fetch(api, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      body: JSON.stringify({
        max_tokens: maxTokens.value,
        temperature: temperature.value,
        message: messages.value
      })
    });

    const data = await response.json();

    messages.value.push({
      role: 'assistant',
      content: data.message || data.response || data.data || data
    });
  } catch (error) {
    console.error('Error:', error);
    alert('Error occurred while fetching response');
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  const route = useRoute();
  
  if (route.query.type == '2') {
    const formIncident = Cookies.get('form-incident');
    
    if (formIncident) {
      try {
        let decodedMessage = JSON.parse(formIncident);
        let content = `Kênh: ${decodedMessage["channel"]} \n Tóm tắt: ${decodedMessage["summarizeIncident"]} \n Độ lớn: ${decodedMessage["level"]} \n Hãy đánh giá sự vụ trên và đưa ra hướng giải quyết`
        messages.value.push({
          role: 'user',
          content: content,
        });
        await fetchApiChat()
        // await append({
        //   role: 'user',
        //   content: content
        // });

        // await nextTick();
        // await handleSubmit();
      } catch (error) {
        console.error('Error processing form-incident:', error);
      }
    }
  }
});

watch(messages, () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
},{ deep: true, immediate: true });

watch(input, () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
});
</script>

<template>
  <div class="max-w-xl mx-auto text-black">
    <h1 class="my-8 text-5xl font-bold text-center text-black">AI Chatbot</h1>
    <div class="max-w-xl mx-auto">
      <div class="mb-4 flex gap-4">
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">Max Tokens</label>
          <input
            v-model="maxTokens"
            type="number"
            step="1"
            min="0"
            max="10000"
            class="w-full p-1 text-sm text-black bg-gray-100 border rounded-md shadow border-white/40"
          />
        </div>
        <div class="flex-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">Temperature</label>
          <input
            v-model="temperature"
            type="number"
            step="0.1"
            min="0"
            max="1"
            class="w-full p-1 text-sm text-black bg-gray-100 border rounded-md shadow border-white/40"
          />
        </div>
      </div>
      <div class="bg-white rounded-md shadow h-[60vh] flex flex-col justify-between">
        <div ref="chatContainer" class="h-full overflow-auto chat-messages">
          <div v-for="(message, i) in messages" :key="i" class="flex flex-col p-4">
            <div v-if="message.role === 'assistant'" class="pr-8 mr-auto">
              <div class="p-2 mt-1 text-gray-700 bg-gray-200 rounded-lg markdown-content" v-html="markdown.render(message.content)">
              </div>
            </div>
            <div v-else class="pl-8 ml-auto">
              <div class="p-2 mt-1 text-white bg-blue-400 rounded-lg markdown-content" v-html="markdown.render(message.content)">
              </div>
            </div>
          </div>
          <div class="p-4 ml-10 mr-auto" v-if="isLoading">
            <span class="loader"></span>
          </div>
        </div>
        <form @submit="handleSubmit">
          <div class="flex items-center w-full p-4">
            <input
                v-model="input"
                type="text"
                placeholder="Type here..."
                class="w-full p-1 text-sm text-black bg-transparent bg-gray-100 border rounded-md shadow border-white/40 grow"
            />
            <button
                :disabled="isLoading"
                type="submit"
                class="flex items-center justify-center flex-none w-10 h-10 ml-2 bg-green-500 rounded-full"
            >
              <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
              >
                <path
                    d="M22 2L11 13"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
                <path
                    d="M22 2L15 22L11 13L2 9L22 2Z"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

</template>
<style>
.loader {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: block;
  position: relative;
  color: #d3d3d3;
  box-sizing: border-box;
  animation: animloader 2s linear infinite;
}

@keyframes animloader {
  0% {
    box-shadow: 14px 0 0 -2px, 38px 0 0 -2px, -14px 0 0 -2px, -38px 0 0 -2px;
  }
  25% {
    box-shadow: 14px 0 0 -2px, 38px 0 0 -2px, -14px 0 0 -2px, -38px 0 0 2px;
  }
  50% {
    box-shadow: 14px 0 0 -2px, 38px 0 0 -2px, -14px 0 0 2px, -38px 0 0 -2px;
  }
  75% {
    box-shadow: 14px 0 0 2px, 38px 0 0 -2px;
  }
}
</style>