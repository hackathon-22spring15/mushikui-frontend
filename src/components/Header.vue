<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {},
});
</script>

<template>
  <div class="HeaderContainer">
    <div class="title">Mushikui</div>
    <!-- <div class="TestContainer">test</div> -->
  </div>
</template>

<style scoped>
.HeaderContainer {
  display: flex;
  text-align: center;
  border-bottom: solid 4px rgb(99, 172, 99);
  height: 60px;
  justify-content: center;
  align-items: center;
  position: relative;
}

.title {
  font-size: 50px;
  font-family: 'Acme', sans-serif;
  margin-top: 5px;
}

.TestContainer {
  position: absolute;
  right: 10px;
}
</style>
