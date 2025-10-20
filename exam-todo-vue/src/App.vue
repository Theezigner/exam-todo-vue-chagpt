<template>
  <main>
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { persistQueryClient } from '@tanstack/query-persist-client-core'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { queryClient } from './utils/queryClient'
import './App.css'

const persister = createAsyncStoragePersister({
  storage: window.localStorage,
})

persistQueryClient({
  queryClient,
  persister,
  maxAge: 1000 * 60 * 60 * 24, // 24 hours
})
</script>



