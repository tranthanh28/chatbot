<template>
  <div class="container-cus">
    <div class="button-container">
      <el-button
        type="success"
        size="large"
        class="custom-button"
        @click="redirectToAI(1)"
      >
        <el-icon class="mr-2"><ChatDotRound /></el-icon>
        Hỏi đáp AI
      </el-button>
      <el-button
        type="primary"
        size="large"
        class="custom-button"
        @click="showForm"
      >
        <el-icon class="mr-2"><DocumentChecked /></el-icon>
        Tư vấn đề xuất hành động
      </el-button>
    </div>
    <el-dialog
      v-model="visible"
      title="Đánh giá Sự vụ"
      :close-on-click-modal="true"
      :before-close="handleClose"
      :close-on-press-escape="true"
    >
      <div>
        <el-form :model="form" label-width="auto">
          <el-form-item label="Kênh">
            <el-input v-model="form.channel" autocomplete="off" />
          </el-form-item>
          <el-form-item label="Tóm tắt sự vụ">
            <el-input v-model="form.summarizeIncident" type="textarea" />
          </el-form-item>
          <el-form-item label="Mức độ nghiêm trọng">
            <el-input v-model="form.level" autocomplete="off" />
          </el-form-item>
        </el-form>
        <div class="dialog-footer d-flex justify-content-center" style="margin-top: 60px;">
          <el-button type="primary" @click="create">Nhập</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ChatDotRound, DocumentChecked } from '@element-plus/icons-vue'
import { useCookie } from '#app'

const visible = ref(false)
const form = ref({
  channel: '',
  summarizeIncident: '',
  level: ''
})
const appUrl = useRuntimeConfig().public.appUrl

const handleClose = () => {
  visible.value = false
}

const showForm = () => {
  visible.value = true
}

const create = () => {
  const formIncident = useCookie('form-incident')
  formIncident.value = JSON.stringify(form.value)
  visible.value = false
  redirectToAI(2)
}

const redirectToAI = (type = 1) => {
  window.location.href = `${appUrl}?type=${type}`
}
</script>

<style scoped>
.container-cus {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-container {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.custom-button {
  padding: 15px 30px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.custom-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.mr-2 {
  margin-right: 8px;
}
</style>
