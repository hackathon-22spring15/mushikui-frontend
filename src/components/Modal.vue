<script lang="ts">
import { computed, defineComponent, onMounted, PropType, ref } from "vue";
import apis, { Expression } from "../lib/apis";
import { useToast } from "vue-toastification";

const zeroPadding = (num: number, digit: number) => {
  return (Array(digit).join("0") + num).slice(-digit);
};

export default defineComponent({
  name: "modal",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    seed: {
      type: Number,
      default: 0,
    },
    resl: {
      type: Array as PropType<Array<Array<Number>>>,
      default: [[]],
    },
    equl: {
      type: Number,
      default: 0,
    },
    rand: {
      type: Boolean,
      default: false,
    },
  },

  setup({ seed, rand }) {
    const date = ref(new Date());
    const answer = ref("");
    const toast = useToast();

    const hours = computed(() => {
      return zeroPadding(23 - date.value.getHours(), 2);
    });
    const minutes = computed(() => {
      return zeroPadding(59 - date.value.getMinutes(), 2);
    });
    const seconds = computed(() => {
      return zeroPadding(59 - date.value.getSeconds(), 2);
    });

    const setDate = () => {
      date.value = new Date();
    };

    const getAnswer = async () => {
      try {
        if (rand) {
          ShareTextURL = "https://mushikui.trasta.dev/random/" + seed;
          const { data } =
            await apis.getEqualRandomExpressionRandomSeedAnswerGet(seed);
          answer.value = data.expression.replaceAll("/", "÷").replaceAll("*", "×");
        } else {
          const { data } = await apis.getEqualDailyExpressionDateAnswerGet(
            seed
          );
          answer.value = data.expression.replaceAll("/", "÷").replaceAll("*", "×");
        }
      } catch (e) {
        console.log(e);
      }
    };

    onMounted(() => {
      setDate();
      setInterval(setDate, 1000);
      getAnswer();
    });
    const TwitterBaseUrl = "https://twitter.com/intent/tweet?";
    const ShareTextBody = ref("");
    let ShareTextURL = "https://mushikui.trasta.dev";
    const twittersharebutton = () => {
      window.open(
        TwitterBaseUrl.concat(
          "text=",
          ShareTextBody.value,
          "&url=",
          ShareTextURL
        ),
        "twitter"
      );
    };
    const copysharebutton = async () => {
      try {
        await navigator.clipboard.writeText(ShareTextBody.value + ShareTextURL);
        toast.success("copied!");
      } catch (e) {
        toast.error("cannot copy");
      }
    };
    const makesharebody = (equl: Number, resl: Number[][], ent: string, rand: boolean, seed: number) => {
      ShareTextBody.value = "Mushikui";
      
      const seedTxt = seed.toString();
      const probDate = new Date(parseInt(seedTxt.substring(0, 4)), parseInt(seedTxt.substring(4, 6)) - 1, parseInt(seedTxt.substring(6, 8)));
      const startData = new Date(2022, 5, 19);
      const days = Math.floor((probDate.getTime() - startData.getTime()) / (1000 * 60 * 60 * 24));

      if (!rand) {
        ShareTextBody.value += " " + days;
      }

      const compNum = (resl.length < 5) ? resl.length.toString() : (resl[4].every(x => x === 2)) ? "5" : "x";
      ShareTextBody.value += " " + compNum + "/5";

      ShareTextBody.value += ent;
      let flg = false;
      console.log(resl);
      resl.forEach((resl2) => {
        flg = true;
        resl2.forEach((resl3, ind) => {
          if (resl3 === 2) {
            if (ind === equl) ShareTextBody.value += "=";
            ShareTextBody.value += "🟩";
          } else if (resl3 === 1) {
            if (ind === equl) ShareTextBody.value += "=";
            ShareTextBody.value += "🟨";
          } else if (resl3 === 0) {
            if (ind === equl) ShareTextBody.value += "=";
            ShareTextBody.value += "⬜";
          } else {
            flg = false;
          }
        });
        if (flg) ShareTextBody.value += ent;
      });
    };

    return {
      hours,
      minutes,
      seconds,
      twittersharebutton,
      answer,
      makesharebody,
      copysharebutton,
    };
  },
});
</script>

<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <button class="modal-close-button" @click="$emit('close')">
              ×
            </button>
          </div>
          <div class="modal-body">
            <div class="answer-container">{{ answer }}</div>
            <div class="second-container">
              <div v-if="rand" class="timer">
                <a class="tonext" href="/random">次の問題</a>
              </div>
              <div v-else class="timer">
                <div>次の問題まで</div>
                <div class="timer">{{ hours }}:{{ minutes }}:{{ seconds }}</div>
              </div>
              <img
                src="../assets/copylogo.svg"
                class="modal-share-button"
                @click="
                  makesharebody(equl, resl, '\n', rand, seed);
                  copysharebutton();
                "
              />
              <img
                src="../assets/twitterlogo.svg"
                class="modal-tweet-button"
                @click="
                  makesharebody(equl, resl, '%0a', rand, seed);
                  twittersharebutton();
                "
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.second-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.timer {
  font-size: 1.5rem;
  font-weight: bold;
  margin: auto;
}

.tonext {
  text-decoration: none;
  color: #42b983;
}

.answer-container {
  font-size: 3em;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 350px;
  margin: 0px auto;
  padding: 10px 10px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 30px 30px;
}

.modal-close-button {
  font-size: 1.5rem;
  width: 30px;
  height: 30px;
  border: 1px;
  background-color: #fff;
  float: right;
}

.modal-share-button {
  width: 40px;
  float: center;
  margin: auto;
}

.modal-tweet-button {
  width: 40px;
  float: center;
  margin: auto;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
