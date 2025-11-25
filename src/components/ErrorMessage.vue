<script setup>
const props = defineProps({
  message: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div
    v-if="props.message"
    class="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
  >
    {{ props.message }}
  </div>
</template>


