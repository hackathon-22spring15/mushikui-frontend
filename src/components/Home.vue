<script lang="ts">
import { defineComponent, ref } from 'vue'
import Key from "./Key.vue"

const answer = ref<string>("")
const current_row = ref(0)
const idx = ref(0)
const lines = ref(
    [
        {
            left: ["", "", ""],
            right: ["", "", ""]
        },
        {
            left: ["", "", ""],
            right: ["", "", ""]
        },
        {
            left: ["", "", ""],
            right: ["", "", ""]
        },
        {
            left: ["", "", ""],
            right: ["", "", ""]
        },
        {
            left: ["", "", ""],
            right: ["", "", ""]
        }
    ]
)

const RIGHT_LEN = 3
const LEFT_LEN = 3

function input(char: string) {
    console.log(idx.value)
    if (char == "delete") {
        if (idx.value == 0){
            console.log("empty")
            return
        }
        if ((idx.value - 1) > (LEFT_LEN - 1)) {
            lines.value[current_row.value].right[idx.value - (RIGHT_LEN + 1)] = ""
        } else {
            lines.value[current_row.value].left[idx.value - 1] = ""
        }
        idx.value--
    } else if (char == "return") {
        console.log(idx.value)
        if (idx.value != (LEFT_LEN + RIGHT_LEN)){
            alert("not inputed all")
            return 
        } 
        alert("judge")
        
        current_row.value++;
        // judge(lines.value[current_row.value])
        
        idx.value = 0;
    } else if (idx.value > (LEFT_LEN + RIGHT_LEN - 1)) {
        console.log("skip")
    } else {
        if (idx.value > (LEFT_LEN - 1)) {
            lines.value[current_row.value].right[idx.value - LEFT_LEN] = char
        } else {
            lines.value[current_row.value].left[idx.value] = char
        }
        idx.value++
    }
}

export default defineComponent({
    setup() {
        return { lines, answer, input }
    },
    components: {
        Key
    }
})
</script>

<template>
    <div class="board">
        <div class="row" v-for="row in lines">
            <div class="tile" v-for="element in row.left">
                {{ element }}
            </div>
            <div class="equal"> = </div>
            <div class="tile" v-for="element in row.right">
                {{ element }}
            </div>
        </div>
    </div>

    <div class="KeyBoard">
        <div class="normal">
            <Key char="0" :input="input"></Key>
            <Key char="1" :input="input"></Key>
            <Key char="2" :input="input"></Key>
            <Key char="3" :input="input"></Key>
            <Key char="4" :input="input"></Key>
            <Key char="5" :input="input"></Key>
            <Key char="6" :input="input"></Key>
            <Key char="7" :input="input"></Key>
            <Key char="8" :input="input"></Key>
            <Key char="9" :input="input"></Key>
        </div>
        <div class="operator">
            <Key char="+" :input="input"></Key>
            <Key char="-" :input="input"></Key>
            <Key char="*" :input="input"></Key>
            <Key char="/" :input="input"></Key>
        </div>
        <div class="special">
            <Key char="delete" :input="input"></Key>
            <Key char="return" :input="input"></Key>
        </div>
    </div>

</template>


<style scoped>
.row {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-gap: 5px;
    /* center */
    justify-content: center;
}

.board {
    display: grid;
    grid-template-rows: repeat(5, 1fr);
    margin-top: 30px;
    grid-gap: 10px;
    height: 250px;
    width: 350px;
    margin-inline: auto;
}

.tile {
    width: 100%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    line-height: 2rem;
    font-weight: bold;
    vertical-align: middle;
    box-sizing: border-box;
    color: rgb(0, 0, 0);
    text-transform: uppercase;
    user-select: none;
    background-color: rgb(223, 223, 223);
}

.equal {
    /* red color */
    color: rgb(0, 0, 0);
    width: 100%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    line-height: 2rem;
    font-weight: bold;
    vertical-align: middle;
    box-sizing: border-box;
    text-transform: uppercase;
    user-select: none;
}

.normal {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 5px;
    /* center */
    justify-content: center;
    margin-top: 30px;
    width: 400px;
    height: 100px;
    margin-inline: auto;
}
.operator {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 5px;
    /* center */
    justify-content: center;
    margin-top: 30px;
    width: 400px;
    height: 50px;
    margin-inline: auto;
}


.special {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 5px;
    justify-content: center;
    width: 400px;
    margin-inline: auto;
    margin-top: 30px;
}


.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>
