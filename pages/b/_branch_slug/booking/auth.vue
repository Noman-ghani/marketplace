<template>
    <div class="w-100 flex-wrap p-0">
        <div class="login-bg">
            <div class="box" v-if="!signupForm && !loginForm">
                <b-button variant="primary" @click="showForm()" class="btn btn-primary">Sign up with email</b-button>
                <AuthSocial/>
            </div>

            <AuthSignupform v-if="signupForm" />
            <AuthLoginform v-if="loginForm" />

            <div class="signup-footer mt-4 text-center">
                {{footer.msg}}<br />
                <span @click="showForm(footer.parm)">{{footer.buttonText}}</span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    layout: 'bookingWidget',
    data() {
        return {
            data: {
                name: 'b-branch_slug-booking-time',
                step: 4,
                title: 'Sign up to continue'
            },
            footer:{
                msg: 'Already have an account?',
                buttonText: 'Log in now',
                parm: 'login'
            },
            loginForm: false,
            signupForm: false,
        }
    },
    created: function () {
        if(this.$auth.loggedIn){
            this.$router.push('checkout');
        }
    },
    methods: {
        showForm: function(path = null){
            if(path == 'login'){
                this.loginForm = true;
                this.signupForm = false;
                this.footer.msg = "Don't have a booker account?";
                this.footer.buttonText = "Sign up now";
                this.footer.parm = null;
            }else{
                this.loginForm = false;
                this.signupForm = true;
                this.footer.msg = "Already have an account?";
                this.footer.buttonText = "Log in now";
                this.footer.parm = "login";
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@media (max-width:767px) {
    .signup-footer {
        position: static;
    }
}
</style>