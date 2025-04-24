<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useForumStore } from '@/stores/forums'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/24/solid'
import { useRouter } from 'vue-router'

const items = [{ title: 'Forums' }]

const forumsStore = useForumStore()
await forumsStore.fetchForums()

const visibleCounts = ref<number[]>([])

onMounted(() => {
  visibleCounts.value = items.map(() => 5)
})

const showMore = (groupIndex: number) => {
  visibleCounts.value[groupIndex] += 5
}
const showLess = (groupIndex: number) => {
  visibleCounts.value[groupIndex] = 5
}

const openGroup = ref<number | null>(null)
const openItem = ref<number | null>(null)

const toggleGroup = (index: number) => {
  openGroup.value = openGroup.value === index ? null : index
  openItem.value = null
}

const toggleItem = (index: number) => {
  openItem.value = openItem.value === index ? null : index
}

const router = useRouter()

const goToForum = (forumId: number) => {
  router.push(`/forums/${forumId}`)
}
</script>

<template>
  <div class="w-64 bg-[#1a1a1b] border-r-2 border-gray-600 h-auto overflow-y-auto py-8 px-3">
    <div v-for="(group, groupIndex) in items" :key="groupIndex">
      <v-divider></v-divider>

      <button @click="toggleGroup(groupIndex)"
        class="w-full flex items-center justify-between px-3 py-2 text-gray-400 font-semibold hover:bg-[#2a2a2b] my-3 rounded">
        {{ group.title.toUpperCase() }}
        <component :is="openGroup === groupIndex ? ChevronUpIcon : ChevronDownIcon"
          class="w-4 h-4 text-gray-400" />
      </button>

      <div v-show="openGroup === groupIndex">
        <div v-for="(item, itemIndex) in forumsStore.getForums.slice(0, visibleCounts[groupIndex])"
          :key="itemIndex" class="mb-1">
          <div class="w-full flex justify-between items-start px-3 py-2 hover:bg-[#2a2a2b] rounded text-sm text-gray-200 hover:text-gray-300">
            <button @click="goToForum(item.id)" class="flex-grow text-left">
              {{ item.name }}
            </button>
            <button @click="toggleItem(itemIndex)" class="flex-shrink-0">
              <component :is="openItem === itemIndex ? ChevronUpIcon : ChevronDownIcon"
                class="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <div v-show="openItem === itemIndex"
            class="ml-6 mt-2 text-sm">
            <div v-if="item.sujets && item.sujets.length > 0">
              <NuxtLink v-for="sujet in item.sujets" :key="sujet.id" :to="`/sujets/${sujet.id}`"
                class="block hover:bg-[#2a2a2b] px-3 py-2 text-gray-200 hover:text-gray-300 truncate border-l border-gray-600 hover:border-gray-400">
                {{ sujet.title }}
              </NuxtLink>
            </div>
            <div v-else class="italic text-gray-500">Aucun sujet pour ce forum.</div>
          </div>
        </div>

        <!-- Boutons Afficher plus / moins -->
        <div v-if="forumsStore.getForums.length > 5" class="text-center m-2">
          <button v-if="forumsStore.getForums.length > visibleCounts[groupIndex]"
            @click="showMore(groupIndex)"
            class="text-sm text-gray-100 rounded-full hover:bg-[#3a3a3b] hover:text-white p-2">
            En voir plus
          </button>
          <button v-else @click="showLess(groupIndex)"
            class="text-sm text-gray-100 rounded-full hover:bg-[#3a3a3b] hover:text-white p-2">
            En voir moins
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
