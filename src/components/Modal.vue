<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import apis, { Expression } from "../lib/apis";

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
    rand: {
      type: Boolean,
      default: false,
    },
  },
  setup({ seed, rand }) {
    const date = ref(new Date());
    const answer = ref("");

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
          const { data } =
            await apis.getEqualRandomExpressionRandomSeedAnswerGet(seed);
          answer.value = data.expression.replace("/", "÷").replace("*", "×");
        } else {
          const { data } = await apis.getEqualDailyExpressionDateAnswerGet(
            seed
          );
          answer.value = data.expression.replace("/", "÷").replace("*", "×");
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
    const ShareTextBody = ref("いい感じのコメント");
    const ShareTextURL = "https://trap.jp";
    const twittersharebutton = () => {
      window.open(
        TwitterBaseUrl.concat(
          "text=",
          ShareTextBody.value,
          "%0a",
          "&url=",
          ShareTextURL
        ),
        "twitter"
      );
    };

    return {
      hours,
      minutes,
      seconds,
      twittersharebutton,
      answer,
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
              x
            </button>
          </div>
          <div class="modal-body">
            <div class="answer-container">{{ answer }}</div>
            <div class="second-container">
              <div class="timer">
                <div>次の問題まで</div>
                <div class="timer">{{ hours }}:{{ minutes }}:{{ seconds }}</div>
              </div>
              <button class="modal-share-button" @click="twittersharebutton">
                share
              </button>
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
  width: 300px;
  margin: 0px auto;
  padding: 20px 30px;
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
  margin: 20px 0;
}

.modal-close-button {
  float: right;
}

.modal-share-button {
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
