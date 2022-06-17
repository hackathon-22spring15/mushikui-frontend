<script lang="ts">
import { defineComponent } from "vue";
import { transSymbol } from "../utils";

export default defineComponent({
  name: "Key",
  props: ["char", "input"],
  setup() {
    return {
      transSymbol,
    };
  },
});
</script>

<template>
  <button @click="input(char)">{{ transSymbol(char) }}</button>
</template>

<style scoped>
button {
  border: none;
  border-radius: 10%;
  background-color: rgb(223, 223, 223);
  font-size: 30px;
  padding: 10px;
  text-align: center;
  margin: 1px;
}
</style>
