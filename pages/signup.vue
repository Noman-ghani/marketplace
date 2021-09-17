<template>
    <div class="login-bg">
        <div class="box" v-if="$route.name == 'signup'">
            <h3>Signup for bookers</h3>
        
            <nuxt-link to="/signup/form" class="btn btn-primary">Sign up with email</nuxt-link>
            <AuthSocial/>
        </div>
        <div class="box form-box" v-else>
            <nuxt-child/>
        </div>

        <div class="signup-footer text-center">
            Already have a booker account?<br />
            <nuxt-link to="/login">Sign in now</nuxt-link>
        </div>
    </div>
</template>

<script>
  export default {
    layout: 'auth',
    beforeCreate: function(){
        if(this.$route.query.fberr){
            this.errorToast("There was a problem signing you in with facebook. Please sign up manually or contact the support team for further queries.", {title: "Facebook Error"});
            this.$router.replace({query: [], hash: ""});
        }
        if(this.$route.query.fbpermissionerr){
            this.errorToast("There was a problem signing you in with facebook. Please sign up manually or Allow permissions on your facebook account..", {title: "Facebook Permission Error"});
            this.$router.replace({query: [], hash: ""});
        }
        
        if(this.$route.query.googleerr){
            this.errorToast("There was a problem signing you in with google. Please sign up manually or contact the support team for further queries.", {title: "Google Error"});
            this.$router.replace({query: [], hash: ""});
        }

        if(this.$route.query.googlepermissionerr){
            this.errorToast("There was a problem signing you in with google. Please sign up manually or Allow permissions on your google account.", {title: "Google Permission Error"});
            this.$router.replace({query: [], hash: ""});
        }
        

    }
  }
</script>