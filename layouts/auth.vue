<template>
  <div class="centralized auth-page">
      <div class="top">
          <nuxt-link to="/">
            <b-icon-arrow-left font-scale="1.5"/>
          </nuxt-link>
          <div class="logo">
            <Logo/>
          </div>
      </div>
    <Nuxt />
  </div>
</template>
<script>
  export default {
      loader: true,
      middleware: 'login',
      beforeCreate: function(){
        let user_country = this.$auth.$storage.getLocalStorage("user_country");
        let user_city = this.$auth.$storage.getLocalStorage("user_city");
        if(user_country == null || user_city == null){
          this.$router.push({path:'/'})
        }
      }
  }
</script>

<style lang="scss" scoped>
.auth-page{
    background: #f2f2f7;
    min-height: 100vh;
    .top{
        position: relative;
        width: 100%;
        margin: 20px auto 0;
        display: flex;
        -webkit-box-align: center;
        align-items: center;
        max-width: 456px;
        .logo{
            position: relative;
            left: 0px;
            right: 0px;
            margin: 0px auto;
            top:0;
            width: 185px;
        }
        svg{
            color:#000;
        }
    }
}
</style>
