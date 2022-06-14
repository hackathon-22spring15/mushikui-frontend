<script>
const zeroPadding=(num,digit)=>{
  return (Array(digit).join("0")+num).slice(-digit)
}
export default {
  props: {
    show: Boolean
  },
  data(){
    return {
      date: new Date(),
    }
  },
  computed:{
    hours() {
      return zeroPadding(23-this.date.getHours(), 2)
    },
    minutes() {
      return zeroPadding(59-this.date.getMinutes(), 2)
    },
    seconds() {
      return zeroPadding(59-this.date.getSeconds(), 2)
    },
  },
  mounted() {
    this.setDate()
    setInterval(() => this.setDate(), 1000)
  },
  methods: {
    setDate() {
      this.date = new Date()
    },
  },
}
</script>
<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <button
              class="modal-default-button"
              @click="$emit('close')"
            >x</button>
          </div>

          <div class="modal-body">
            <div name="body">次の問題まで</div>
            <div class="timer">
              {{hours}}:{{minutes}}:{{seconds}}
            </div>
          </div>

          <div class="modal-footer">
            <div name="footer">
              
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
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

.modal-default-button {
  float: right;
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
