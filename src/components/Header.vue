<script>
import { defineComponent } from "vue";

export default defineComponent({
  setup() {},
});
</script>

<template>
  <div class="HeaderContainer">
    <div>Mushikui</div>
    <!-- <div class="TestContainer">test</div> -->
  </div>
</template>

<style scoped>
.HeaderContainer {
  display: flex;
  text-align: center;
  font-size: 30px;
  border-bottom: solid;
  height: 60px;
  justify-content: center;
  align-items: center;
  position: relative;
}

.TestContainer {
  position: absolute;
  right: 10px;
}
</style>
