<template>
  <Header></Header>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Header from './components/Header.vue'
import Home from './components/Home.vue'

export default defineComponent({
    components: {
        Header,
        Home,
    },
    setup() {
    },
})
</script>

<style>
body,
#app {
  margin: 0;
  min-height: 100vh;
}

#app {
  display: flex;
  flex-direction: column;
}
</style>
