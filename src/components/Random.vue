<script lang="ts">
import { defineComponent, ref, computed, version, onBeforeMount } from "vue";
import Key from "./Key.vue";
import ResultModal from "./Modal.vue";
import apis, { Expression } from "../lib/apis";
import { transSymbol } from "../utils";
import { useToast } from "vue-toastification";
import { useRoute } from 'vue-router';

const check_finished = (row: Array<number>) => {
  return row.every((e) => e === 2);
};

export default defineComponent({
  setup() {
    // 行の数
    const N_ROW = 5;

    // イコールを含めた式の要素の数
    const EXPR_LEN = 7;

    // 現在入力中の枠が何行目か
    const row_idx = ref(0);
    // 現在入力中の枠が何列目か
    const col_idx = ref(0);

    const RIGHT_LEN = ref(3);
    const LEFT_LEN = ref(3);
    const lines = ref<Array<{ left: string[]; right: string[] }>>([]);
    const results = ref<Array<Array<number>>>([]);
    const showModal = ref(false);
    const can_input = ref(true);
    const seed = ref(0);
    const toast = useToast();
    const route = useRoute();

    onBeforeMount(async () => {
      const { seeds } = route.params;
      seed.value = Number(seeds);
      try {
        can_input.value = false;
        const { data } = await apis.getEqualRandomExpressionRandomSeedGet(
          seed.value
        );
        RIGHT_LEN.value = 6 - data.pos;
        LEFT_LEN.value = data.pos;
        lines.value = init_line(LEFT_LEN.value, RIGHT_LEN.value, N_ROW);
        results.value = init_result(LEFT_LEN.value, RIGHT_LEN.value, N_ROW);
      } catch (e) {
        console.log(e);
      }
      can_input.value = true;
    });

    const logKey = (e: KeyboardEvent) => {
      if (!can_input.value) return;
      switch (e.key) {
        case "Enter":
          update("⏎");
          break;
        case "Backspace":
        case "Delete":
          update("⌫");
          break;
        default:
          if (/^[0-9-/\+\*]$/.test(e.key)) {
            update(e.key);
          }
      }
    };
    window.addEventListener("keydown", logKey);

    // left_len, right_len, n_rowから空文字列で初期化された結果を格納する配列を作る
    //
    // 例:init_line(3, 3, 5) ->
    // [
    //     {
    //         left: ["", "", ""],
    //         right: ["", "", ""]
    //     },
    //     {
    //         left: ["", "", ""],
    //         right: ["", "", ""]
    //     },
    //     {
    //         left: ["", "", ""],
    //         right: ["", "", ""]
    //     },
    //     {
    //         left: ["", "", ""],
    //         right: ["", "", ""]
    //     },
    //     {
    //         left: ["", "", ""],
    //         right: ["", "", ""]
    //     }
    // ]
    const init_line = (
      left_len: number,
      right_len: number,
      n_row: number
    ): { left: string[]; right: string[] }[] => {
      let result = [];
      let _left = [];
      let _right = [];
      for (let i = 0; i < n_row; i++) {
        _left = [];
        _right = [];
        for (let j = 0; j < left_len; j++) {
          _left.push("");
        }
        for (let j = 0; j < right_len; j++) {
          _right.push("");
        }
        result.push({
          left: _left,
          right: _right,
        });
      }
      return result;
    };

    // 判定の結果を格納する空文字列で初期化された二次元配列を生成する
    // 例:init_result(3, 3, 5) ->
    // [
    //     ["-", "-", "-", "-", "-", "-"],
    //     ["-", "-", "-", "-", "-", "-"],
    //     ["-", "-", "-", "-", "-", "-"],
    //     ["-", "-", "-", "-", "-", "-"],
    //     ["-", "-", "-", "-", "-", "-"]
    // ]
    const init_result = (
      left_len: number,
      right_len: number,
      n_row: number
    ): Array<Array<number>> => {
      let result = [];
      for (let i = 0; i < n_row; i++) {
        let _row = [];
        for (let j = 0; j < left_len + right_len; j++) {
          _row.push(-1);
        }
        result.push(_row);
      }
      return result;
    };

    // 各値,  演算子についての判定結果を保存する配列
    // 例えば一番最後の要素は / の判定結果を格納
    const result_by_value = ref([
      -1, // 0
      -1, // 1
      -1, // 2
      -1, // 3
      -1, // 4
      -1, // 5
      -1, // 6
      -1, // 7
      -1, // 8
      -1, // 9
      -1, // +
      -1, // -
      -1, // *
      -1, // /
    ]);

    const isCorrect_by_value = computed(() => {
      return result_by_value.value.map((e) => e === 2);
    });

    const isHalfCorrect_by_value = computed(() => {
      return result_by_value.value.map((e) => e === 1);
    });

    const isNotCorrect_by_value = computed(() => {
      return result_by_value.value.map((e) => e === 0);
    });

    const isCorrect = computed(() => {
      return results.value.map((result) => result.map((e) => e === 2));
    });

    const isHalfCorrect = computed(() => {
      return results.value.map((result) => result.map((e) => e === 1));
    });

    const isNotCorrect = computed(() => {
      return results.value.map((result) => result.map((e) => e === 0));
    });

    const check = async (expr: string) => {
      try {
        can_input.value = false;
        var expre: Expression = { expression: expr };
        var { data } = await apis.postExpressionRandomExpressionRandomSeedPost(
          seed.value,
          expre
        );
        can_input.value = true;
        return data.check;
      } catch (e) {
        console.log(e);
        can_input.value = true;
        return [];
      }
    };

    const judge = async (left: string, right: string) => {
      const expr = left + "=" + right;
      try {
        const c = await check(expr);
        const res = [];
        for (let i = 0; i < LEFT_LEN.value + RIGHT_LEN.value; i++) {
          res.push(c[i]);
        }
        return res;
      } catch (e) {
        console.log(e);
        return [];
      }
    };

    // 入力に応じて`lines`を更新して、"enter"が押されたらジャッジをする。
    const update = async (char: string) => {
      if (char === "⌫") {
        // col_idx.value === 0 な時、まだ何も入力されていないのでスキップ
        if (col_idx.value === 0) {
          return;
        }
        if (col_idx.value - 1 > LEFT_LEN.value - 1) {
          lines.value[row_idx.value].right[
            col_idx.value - (LEFT_LEN.value + 1)
          ] = "";
        } else {
          lines.value[row_idx.value].left[col_idx.value - 1] = "";
        }
        col_idx.value--;
      } else if (char === "⏎") {
        // 入力しきっていない場合はalertを出す
        if (col_idx.value !== LEFT_LEN.value + RIGHT_LEN.value) {
          toast.error("please input all");
          return;
        }

        const left = lines.value[row_idx.value].left.join("");
        const right = lines.value[row_idx.value].right.join("");
        try {
          if (eval(left) !== eval(right)) {
            toast.error("Enter the correct equation");
            return;
          }
        } catch (e) {
          return;
        }

        // ジャッジする
        results.value[row_idx.value] = await judge(left, right);

        // ジャッジ結果をresult_by_valueに代入していく。
        for (let i = 0; i < LEFT_LEN.value; i++) {
          const v = lines.value[row_idx.value].left[i];
          if (v === "+") {
            result_by_value.value[10] = Math.max(result_by_value.value[10], results.value[row_idx.value][i]);
          } else if (v === "-") {
            result_by_value.value[11] = Math.max(result_by_value.value[11], results.value[row_idx.value][i]);
          } else if (v === "*") {
            result_by_value.value[12] = Math.max(result_by_value.value[12], results.value[row_idx.value][i]);
          } else if (v === "/") {
            result_by_value.value[13] = Math.max(result_by_value.value[13], results.value[row_idx.value][i]);
          } else {
            result_by_value.value[parseInt(v)] =
              Math.max(result_by_value.value[parseInt(v)], results.value[row_idx.value][i]);
          }
        }

        for (let i = 0; i < RIGHT_LEN.value; i++) {
          const v = lines.value[row_idx.value].right[i];
          if (v === "+") {
            result_by_value.value[10] =
              Math.max(result_by_value.value[10], results.value[row_idx.value][i + LEFT_LEN.value]);
          } else if (v === "-") {
            result_by_value.value[11] =
              Math.max(result_by_value.value[11], results.value[row_idx.value][i + LEFT_LEN.value]);
          } else if (v === "*") {
            result_by_value.value[12] =
              Math.max(result_by_value.value[12], results.value[row_idx.value][i + LEFT_LEN.value]);
          } else if (v === "/") {
            result_by_value.value[13] =
              Math.max(result_by_value.value[13], results.value[row_idx.value][i + LEFT_LEN.value]);
          } else {
            result_by_value.value[parseInt(v)] =
              Math.max(result_by_value.value[parseInt(v)], results.value[row_idx.value][i + LEFT_LEN.value]);
          }
        }

        // 終了判定
        const is_finished = check_finished(results.value[row_idx.value]);
        if (is_finished || row_idx.value === N_ROW - 1) {
          showModal.value = true;
          row_idx.value = 100;
          can_input.value = false;
        }

        row_idx.value++;
        col_idx.value = 0;
      } else if (col_idx.value > LEFT_LEN.value + RIGHT_LEN.value - 1) {
        // すでに入力しきっているのにさらに入力が来た場合。 なのでスキップ
        return;
      } else {
        // 正しい入力
        if (col_idx.value > LEFT_LEN.value - 1) {
          lines.value[row_idx.value].right[col_idx.value - LEFT_LEN.value] =
            char;
        } else {
          lines.value[row_idx.value].left[col_idx.value] = char;
        }
        col_idx.value++;
      }
    };

    return {
      lines,
      update,
      row_idx,
      col_idx,
      results,
      isCorrect,
      isHalfCorrect,
      isNotCorrect,
      result_by_value,
      isCorrect_by_value,
      isHalfCorrect_by_value,
      isNotCorrect_by_value,
      LEFT_LEN,
      RIGHT_LEN,
      EXPR_LEN,
      N_ROW,
      showModal,
      transSymbol,
      seed,
    };
  },
  components: {
    Key,
    ResultModal,
  },
});
</script>

<template>
  <div class="board">
    <div class="row" v-for="(row, i) in lines" :key="i">
      <div
        class="tile"
        v-bind:class="{
          current_input: row_idx === i && col_idx === j,
          correct: isCorrect[i][j],
          half: isHalfCorrect[i][j],
          notCorrect: isNotCorrect[i][j],
        }"
        v-for="(element, j) in row.left"
        :key="j"
      >
        {{ transSymbol(element) }}
      </div>
      <div class="equal">=</div>
      <div
        class="tile"
        v-bind:class="{
          current_input: row_idx === i && col_idx === j + LEFT_LEN,
          correct: isCorrect[i][j + LEFT_LEN],
          half: isHalfCorrect[i][j + LEFT_LEN],
          notCorrect: isNotCorrect[i][j + LEFT_LEN],
        }"
        v-for="(element, j) in row.right"
        :key="j"
      >
        {{ transSymbol(element) }}
      </div>
    </div>
  </div>

  <div class="keyboard">
    <div class="numbers">
      <Key
        char="0"
        v-bind:class="{
          correct: isCorrect_by_value[0],
          half: isHalfCorrect_by_value[0],
          notCorrect: isNotCorrect_by_value[0],
        }"
        :input="update"
      ></Key>
      <Key
        char="1"
        v-bind:class="{
          correct: isCorrect_by_value[1],
          half: isHalfCorrect_by_value[1],
          notCorrect: isNotCorrect_by_value[1],
        }"
        :input="update"
      ></Key>
      <Key
        char="2"
        v-bind:class="{
          correct: isCorrect_by_value[2],
          half: isHalfCorrect_by_value[2],
          notCorrect: isNotCorrect_by_value[2],
        }"
        :input="update"
      ></Key>
      <Key
        char="3"
        v-bind:class="{
          correct: isCorrect_by_value[3],
          half: isHalfCorrect_by_value[3],
          notCorrect: isNotCorrect_by_value[3],
        }"
        :input="update"
      ></Key>
      <Key
        char="4"
        v-bind:class="{
          correct: isCorrect_by_value[4],
          half: isHalfCorrect_by_value[4],
          notCorrect: isNotCorrect_by_value[4],
        }"
        :input="update"
      ></Key>
      <Key
        char="5"
        v-bind:class="{
          correct: isCorrect_by_value[5],
          half: isHalfCorrect_by_value[5],
          notCorrect: isNotCorrect_by_value[5],
        }"
        :input="update"
      ></Key>
      <Key
        char="6"
        v-bind:class="{
          correct: isCorrect_by_value[6],
          half: isHalfCorrect_by_value[6],
          notCorrect: isNotCorrect_by_value[6],
        }"
        :input="update"
      ></Key>
      <Key
        char="7"
        v-bind:class="{
          correct: isCorrect_by_value[7],
          half: isHalfCorrect_by_value[7],
          notCorrect: isNotCorrect_by_value[7],
        }"
        :input="update"
      ></Key>
      <Key
        char="8"
        v-bind:class="{
          correct: isCorrect_by_value[8],
          half: isHalfCorrect_by_value[8],
          notCorrect: isNotCorrect_by_value[8],
        }"
        :input="update"
      ></Key>
      <Key
        char="9"
        v-bind:class="{
          correct: isCorrect_by_value[9],
          half: isHalfCorrect_by_value[9],
          notCorrect: isNotCorrect_by_value[9],
        }"
        :input="update"
      ></Key>
    </div>
    <div class="operator">
      <Key
        char="+"
        v-bind:class="{
          correct: isCorrect_by_value[10],
          half: isHalfCorrect_by_value[10],
          notCorrect: isNotCorrect_by_value[10],
        }"
        :input="update"
      ></Key>
      <Key
        char="-"
        v-bind:class="{
          correct: isCorrect_by_value[11],
          half: isHalfCorrect_by_value[11],
          notCorrect: isNotCorrect_by_value[11],
        }"
        :input="update"
      ></Key>
      <Key
        char="*"
        v-bind:class="{
          correct: isCorrect_by_value[12],
          half: isHalfCorrect_by_value[12],
          notCorrect: isNotCorrect_by_value[12],
        }"
        :input="update"
      ></Key>
      <Key
        char="/"
        v-bind:class="{
          correct: isCorrect_by_value[13],
          half: isHalfCorrect_by_value[13],
          notCorrect: isNotCorrect_by_value[13],
        }"
        :input="update"
      ></Key>
    </div>
    <div class="special">
      <Key char="⌫" :input="update"></Key>
      <Key char="⏎" :input="update"></Key>
    </div>
  </div>
  <Teleport to="body">
    <ResultModal
      :show="showModal"
      :seed="seed"
      :rand="true"
      :resl="results"
      :equl="LEFT_LEN"
      @close="showModal = false"
    ></ResultModal>
  </Teleport>
</template>

<style scoped>
.row {
  display: grid;
  grid-template-columns: repeat(v-bind(EXPR_LEN), 1fr);
  grid-gap: 5px;
  justify-content: center;
}

.board {
  display: grid;
  grid-template-rows: repeat(v-bind(N_ROW), 1fr);
  margin-top: 50px;
  grid-gap: 10px;
  height: 400px;
  width: 560px;
  margin-inline: auto;
}

.keyboard {
  margin-top: 20px;
  margin-bottom: 40px;
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
  border-radius: 5px;
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

.notCorrect {
  background-color: rgb(110, 108, 108) !important;
}

.current_input {
  border: 5px solid rgb(40, 40, 40);
}
</style>

<style>
.Vue-Toastification__toast-body {
  text-align: center !important;
}
</style>
