<script>
    export let value = ''
</script>

<style lang="scss">
  @import url("https://fonts.googleapis.com/css?family=Inconsolata:700");

  .container {
    position: absolute;
    left: 50%;
    right: 0;
    bottom: 100px;
    width: 300px;
    height: 100px;
    margin-left: -150px;
    .search {
      position: absolute;
      margin: auto;
      right: 0;
      bottom: 0;
      left: 0;
      width: 80px;
      height: 80px;
      background: #2185d0;
      border-radius: 50%;
      transition: all 1s;
      z-index: 4;
      box-shadow: 0 0 25px 0 rgba(0, 0, 0, 0.4);
      bottom: 10px;
      // box-shadow: 0 0 25px 0 crimson;
      &:hover {
        cursor: pointer;
      }
      &::before {
        content: "";
        position: absolute;
        margin: auto;
        top: 22px;
        right: 0;
        bottom: 0;
        left: 22px;
        width: 12px;
        height: 2px;
        background: white;
        transform: rotate(45deg);
        transition: all 0.5s;
      }
      &::after {
        content: "";
        position: absolute;
        margin: auto;
        top: -5px;
        right: 0;
        bottom: 0;
        left: -5px;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        border: 2px solid white;
        transition: all 0.5s;
      }
    }
    input {
      font-family: "Inconsolata", monospace;
      position: absolute;
      margin: auto;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 50px;
      height: 50px;
      outline: none;
      border: none;
      // border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      background: #2185d0;
      color: white;
      text-shadow: 0 0 10px #2185d0;
      padding: 0 80px 0 20px;
      border-radius: 30px;
      box-shadow: 0 0 25px 0 #2185d0, 0 20px 25px 0 rgba(0, 0, 0, 0.2);
      // box-shadow: inset 0 0 25px 0 rgba(0, 0, 0, 0.5);
      transition: all 1s;
      opacity: 0;
      z-index: 5;
      font-weight: bolder;
      letter-spacing: 0.1em;
      &:hover {
        cursor: pointer;
      }
      &:focus {
        width: 300px;
        opacity: 1;
        cursor: text;
      }
      &:focus ~ .search {
        right: -250px;
        background: #151515;
        z-index: 6;
        &::before {
          top: 0;
          left: 0;
          width: 25px;
        }
        &::after {
          top: 0;
          left: 0;
          width: 25px;
          height: 2px;
          border: none;
          background: white;
          border-radius: 0%;
          transform: rotate(-45deg);
        }
      }
      &::placeholder {
        color: white;
        opacity: 0.5;
        font-weight: bolder;
      }
    }
  }
</style>

<div class="container">
  <input
    type="text"
    placeholder="Chercher..."
    on:blur
    on:focus
    on:keydown
    on:keypress
    on:keyup
    on:change
    on:input 
    bind:value />
  <div class="search" />
</div>
