<template>
  <div v-if="show">
    <header-TopNav />
    <main>
      <Nuxt />
    </main>
    <footer-bottom />
  </div>
  <div v-else>
    <div class="get-info">
      <div class="inner">
        <img src="/images/servu-logo.svg" alt="logo" >
        <HeaderCountryCityForm />
      </div>
    </div>
  </div>
</template>

<script>

export default{
  data(){
    return{
      show: false
    }
  },
  created: function(){
    this.showModal();
  },
  methods: {
      showModal() {
        let user_country = this.$auth.$storage.getLocalStorage("user_country");
        let user_city = this.$auth.$storage.getLocalStorage("user_city");
        if(user_country != null || user_city != null){
          this.show = true
        }else{
          this.$router.push({path:'/'})
        }
      }
  }

  
}
</script>
<style lang="scss" scoped>
.get-info{
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .inner{
    max-width: 620px;
  }
}
</style>