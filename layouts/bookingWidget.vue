<template>
  <div class="booking-widget">
    <Nuxt />
  </div>
</template>
<script>
export default {
    beforeCreate: function(){
      let user_country = this.$auth.$storage.getLocalStorage("user_country");
      let user_city = this.$auth.$storage.getLocalStorage("user_city");
      if(user_country == null || user_city == null){
        this.$router.push({path:'/'})
      }
    }
}
</script>
