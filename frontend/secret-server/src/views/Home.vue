<template>
  <div class="home">
    <img alt="secret server task" src="../assets/logo.png">
    <HelloWorld msg="Secret Server Task"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  }
}
</script>
