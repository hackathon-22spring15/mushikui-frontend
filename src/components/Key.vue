<script lang="ts">
import { defineComponent } from "vue"


export default defineComponent({
    name: "Key",
    props: ["char", "input"]
})






</script>

<template>
    <button @click="input(char)">{{ char }}</button>
</template>


<style scoped>
button{
    border: none;
    border-radius: 10%;
    background-color: rgb(241, 241, 241);
    font-size: 30px;
    padding: 10px;
    text-align: center;
    margin: 1px;
}
</style>
