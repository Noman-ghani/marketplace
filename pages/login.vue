<template>
    <div class="login-bg">
        <div class="box" v-if="$route.name == 'login'">
            <h3>Login for bookers</h3>
        
            <nuxt-link to="/login/form" class="btn btn-primary">Log in with email</nuxt-link>

            <AuthSocial />

        </div>
        <div class="box" v-else>

            <nuxt-child />

        </div>

        <div class="signup-footer text-center">
            Don't have a booker account? <br />
            <nuxt-link to="/signup">Sign up now</nuxt-link>
        </div>
    </div>
</template>
<script>
    export default {
        layout: 'auth',
    }
</script>

<style lang="scss" scoped>
    h1 {
        font-size:52px;
        font-weight: 800;
    }
    .intro-text {
            color: #878c93;
            margin-bottom: 24px;
    }
    
    @media only screen and (max-width: 640px) {
        h1 {
            font-size: 1.2rem;
        }
        .intro-text {
            font-size: 0.8rem;
        }
    }
</style>