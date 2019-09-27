<template>
  <div class="buttons-change-data" @click="isActive = !isActive">
    <div :class="{ active: isActive}" class="w-50 custom-btn">{{leftText}}</div>
    <div :class="{ active: !isActive}" class="w-50 custom-btn">{{rightText}}</div>
  </div>
</template>

<script>
//This is a styled button component. It changes everytime that is clicked.
export default {
  name: "ToggleButton",
  props: {
    //The leftside text of the button.
    leftText: {
      type: String,
      default: "on"
    },
    //The rightside text of the button.
    rightText: {
      type: String,
      default: "off"
    }
  },
  data() {
    return {
      //It indicates which part of the button is actived.
      isActive: true
    };
  }
};
</script>

<style lang="scss" scoped>
.buttons-change-data {
  border-radius: 0.25rem;
  padding: 3px !important;
  background-color: #333333;

  .custom-btn {
    height: 100% !important;
    text-transform: uppercase;
    word-spacing: 5px;
    display: inline-block;
    font-weight: bold;
    color: white;
    text-align: center;
    vertical-align: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-color: transparent;
    border: 1px solid transparent;
    padding: 0.3rem 0.5rem;
    font-size: 0.8rem;
    line-height: 1.5;
    border-radius: 0.25rem;
    transition: color 0.3s ease-in-out, background-color 0.3s ease-in-out,
      border-color 0.5s ease-in-out, box-shadow 0.5s ease-in-out;
  }
}

.w-50 {
  width: 50%;
}

.active {
  background-color: white !important;
  color: black !important;
}
</style>