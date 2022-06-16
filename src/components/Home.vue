<script lang="ts">
import { parse } from 'path'
import { defineComponent, ref, computed, version } from 'vue'
import Key from "./Key.vue"


export default defineComponent({
    setup() {

        const RIGHT_LEN = 3
        const LEFT_LEN = 3

        const answer = ref("")
        const row_idx = ref(0)
        const col_idx = ref(0)
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



        const results = ref([
            ["-", "-", "-", "-", "-", "-"],
            ["-", "-", "-", "-", "-", "-"],
            ["-", "-", "-", "-", "-", "-"],
            ["-", "-", "-", "-", "-", "-"],
            ["-", "-", "-", "-", "-", "-"]
        ])


        const result_by_value = ref([
            "", // 0
            "", // 1
            "", // 2
            "", // 3
            "", // 4
            "", // 5
            "", // 6
            "", // 7
            "", // 8
            "", // 9
            "", // +
            "", // -
            "", // *
            "", // /
        ])


        const isCollect_by_value = computed(
            () => {
                return result_by_value.value.map(e => e === "o")
            }
        )


        const isHalfCollect_by_value = computed(
            () => {
                return result_by_value.value.map(e => e === "h")
            }
        )


        const isnotCollect_by_value = computed(
            () => {
                return result_by_value.value.map(e => e === "x")
            }
        )

        const isCollect = computed(
            () => {
                return results.value.map(result => result.map(e => e === "o"))
            }
        )

        const isHalfCollect = computed(
            () => {
                return results.value.map(result => result.map(e => e === "h"))
            }
        )


        const isnotCollect = computed(
            () => {
                return results.value.map(result => result.map(e => e === "x"))
            }
        )


        function judge(left: string, right: string) {
            return ["o", "o", "o", "h", "x", "o"]
        }

        function update(char: string) {
            if (char === "delete") {
                if (col_idx.value === 0) {
                    return
                }
                if ((col_idx.value - 1) > (LEFT_LEN - 1)) {
                    lines.value[row_idx.value].right[col_idx.value - (RIGHT_LEN + 1)] = ""
                } else {
                    lines.value[row_idx.value].left[col_idx.value - 1] = ""
                }
                col_idx.value--
            } else if (char === "return") {
                if (col_idx.value !== (LEFT_LEN + RIGHT_LEN)) {
                    alert("plese input all")
                    return
                }
                results.value[row_idx.value] = judge(lines.value[row_idx.value].left.join(), lines.value[row_idx.value].right.join())
                for (let i = 0; i < LEFT_LEN; i++) {
                    const v = lines.value[row_idx.value].left[i]
                    if (v === "+") {
                        result_by_value.value[10] = results.value[row_idx.value][i]
                    } else if (v === "-") {
                        result_by_value.value[11] = results.value[row_idx.value][i]
                    } else if (v === "*") {
                        result_by_value.value[12] = results.value[row_idx.value][i]
                    } else if (v === "/") {
                        result_by_value.value[13] = results.value[row_idx.value][i]
                    } else {
                        result_by_value.value[parseInt(v)] = results.value[row_idx.value][i]
                    }
                }

                for (let i = 0; i < RIGHT_LEN; i++) {
                    const v = lines.value[row_idx.value].right[i]
                    if (v === "+") {
                        result_by_value.value[10] = results.value[row_idx.value][i + LEFT_LEN]
                    } else if (v === "-") {
                        result_by_value.value[11] = results.value[row_idx.value][i + LEFT_LEN]
                    } else if (v === "*") {
                        result_by_value.value[12] = results.value[row_idx.value][i + LEFT_LEN]
                    } else if (v === "/") {
                        result_by_value.value[13] = results.value[row_idx.value][i + LEFT_LEN]
                    } else {
                        result_by_value.value[parseInt(v)] = results.value[row_idx.value][i + LEFT_LEN]
                    }
                }

                row_idx.value++;
                col_idx.value = 0;
            } else if (col_idx.value > (LEFT_LEN + RIGHT_LEN - 1)) {
                // skip
                return
            } else {
                if (col_idx.value > (LEFT_LEN - 1)) {
                    lines.value[row_idx.value].right[col_idx.value - LEFT_LEN] = char
                } else {
                    lines.value[row_idx.value].left[col_idx.value] = char
                }
                col_idx.value++
            }
        }

        const zero_is_collect = true
        return { lines, answer, update, row_idx, col_idx, results, isCollect, isHalfCollect, isnotCollect, zero_is_collect, result_by_value, isCollect_by_value, isHalfCollect_by_value, isnotCollect_by_value, LEFT_LEN, RIGHT_LEN }
    },
    components: {
        Key
    }
})


</script>

<template>
    <div class="board">
        <div class="row" v-for="row, i in lines" :key="i">
            <div class="tile"
                v-bind:class="{ current_input: ((row_idx === i) && (col_idx === j)), correct: isCollect[i][j], half: isHalfCollect[i][j], notcollect: isnotCollect[i][j] }"
                v-for="element, j in row.left" :key="j">
                {{ element }}
            </div>
            <div class="equal"> = </div>
            <div class="tile"
                v-bind:class="{ current_input: ((row_idx === i) && (col_idx === j + LEFT_LEN)), correct: isCollect[i][j + LEFT_LEN], half: isHalfCollect[i][j + 3], notcollect: isnotCollect[i][j + LEFT_LEN] }"
                v-for="element, j in row.right" :key="j">
                {{ element }}
            </div>
        </div>
    </div>

    <div class="keyboard">
        <div class="numbers">
            <Key char="0" v-bind:class="{ correct: isCollect_by_value[0], half: isHalfCollect_by_value[0], notcollect: isnotCollect_by_value[0] }" :input="update"></Key>
            <Key char="1" v-bind:class="{ correct: isCollect_by_value[1], half: isHalfCollect_by_value[1], notcollect: isnotCollect_by_value[1] }" :input="update"></Key>
            <Key char="2" v-bind:class="{ correct: isCollect_by_value[2], half: isHalfCollect_by_value[2], notcollect: isnotCollect_by_value[2] }" :input="update"></Key>
            <Key char="3" v-bind:class="{ correct: isCollect_by_value[3], half: isHalfCollect_by_value[3], notcollect: isnotCollect_by_value[3] }" :input="update"></Key>
            <Key char="4" v-bind:class="{ correct: isCollect_by_value[4], half: isHalfCollect_by_value[4], notcollect: isnotCollect_by_value[4] }" :input="update"></Key>
            <Key char="5" v-bind:class="{ correct: isCollect_by_value[5], half: isHalfCollect_by_value[5], notcollect: isnotCollect_by_value[5] }" :input="update"></Key>
            <Key char="6" v-bind:class="{ correct: isCollect_by_value[6], half: isHalfCollect_by_value[6], notcollect: isnotCollect_by_value[6] }" :input="update"></Key>
            <Key char="7" v-bind:class="{ correct: isCollect_by_value[7], half: isHalfCollect_by_value[7], notcollect: isnotCollect_by_value[7] }" :input="update"></Key>
            <Key char="8" v-bind:class="{ correct: isCollect_by_value[8], half: isHalfCollect_by_value[8], notcollect: isnotCollect_by_value[8] }" :input="update"></Key>
            <Key char="9" v-bind:class="{ correct: isCollect_by_value[9], half: isHalfCollect_by_value[9], notcollect: isnotCollect_by_value[9] }" :input="update"></Key>
        </div>
        <div class="operator">
            <Key char="+" v-bind:class="{ correct: isCollect_by_value[10], half: isHalfCollect_by_value[10], notcollect: isnotCollect_by_value[10] }" :input="update"></Key>
            <Key char="-" v-bind:class="{ correct: isCollect_by_value[11], half: isHalfCollect_by_value[11], notcollect: isnotCollect_by_value[11] }" :input="update"></Key>
            <Key char="*" v-bind:class="{ correct: isCollect_by_value[12], half: isHalfCollect_by_value[12], notcollect: isnotCollect_by_value[12] }" :input="update"></Key>
            <Key char="/" v-bind:class="{ correct: isCollect_by_value[13], half: isHalfCollect_by_value[13], notcollect: isnotCollect_by_value[13] }" :input="update"></Key>
        </div>
        <div class="special">
            <Key char="delete" :input="update"></Key>
            <Key char="return" :input="update"></Key>
        </div>
    </div>

</template>


<style scoped>
.row {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-gap: 5px;
    justify-content: center;
}

.board {
    display: grid;
    grid-template-rows: repeat(5, 1fr);
    margin-top: 30px;
    grid-gap: 10px;
    height: 400px;
    width: 560px;
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
    box-shadow: 0 3px 4px rgba(0, 0, 0, 0.32);
}

.equal {
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

.numbers {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 5px;
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


.correct {
    background-color: rgb(99, 172, 99) !important;
}

.half {
    background-color: rgb(211, 211, 101) !important;
}

.notcollect {
    background-color: rgb(110, 108, 108) !important;
}


.current_input {
    background-color: rgb(84, 84, 84) !important;
    box-shadow: none !important;
}
</style>
