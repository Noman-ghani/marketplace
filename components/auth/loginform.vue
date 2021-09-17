<template>
    <div>
        <h3 v-if="$route.name == 'login'">
            <nuxt-link to="/login">
                <b-icon-arrow-left />
            </nuxt-link>
            Log in with email
        </h3>
        <ValidationObserver ref="form" v-slot="{handleSubmit, invalid}">
        <b-form @submit.prevent="handleSubmit(localLogin)" autocomplete="off" class="mt-4">
                <ValidationProvider vid="email" name="E-mail address" :rules="{required: true, email: true}" v-slot="{errors}">
                    <b-form-group label="E-mail address *" label-for="email">
                        <b-form-input v-model="form.email" :class="{'is-invalid': errors[0]}" />
                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]" />
                    </b-form-group>
                </ValidationProvider>
                <ValidationProvider vid="password" name="Password" :rules="{required: true}" v-slot="{errors}">
                    <b-form-group label="Password *" label-for="password">
                        <b-input-group>
                            <b-form-input :type="showPassword ? 'text' : 'password'" v-model="form.password" :class="{'is-invalid': errors[0]}" />
                            <b-input-group-append>
                                <b-input-group-text style="cursor: pointer;" @click="showPassword = !showPassword">
                                    <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash-fill" viewBox="0 0 16 16">
                                        <path d="M10.79 12.912l-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.027 7.027 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.088z"/>
                                        <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708l-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6l-12-12 .708-.708 12 12-.708.707z"/>
                                    </svg>
                                    <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                                        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                                        <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                                    </svg>
                                </b-input-group-text>
                            </b-input-group-append>
                            <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]" />
                        </b-input-group>
                        <nuxt-link :to="{name: 'login-forgot-password'}" class="forgot-password" v-if="$route.name == 'login-form'">Forgot Password</nuxt-link>
                    </b-form-group>
                </ValidationProvider>
                <div class="form-group mt-4">
                    <form-button type="submit" class="btn-block w-100" :disabled="invalid || isSubmitted" :isSubmitted=isSubmitted>Log In</form-button>
                </div>
        </b-form>
        </ValidationObserver>
    </div>
</template>
<script>

export default {
    name : 'loginform',
    data: function () {
            return {
                form: {
                    email: "",
                    password: ""
                },
                showPassword: false,
                isSubmitted: false
            }
        },
        methods: {
            localLogin() {
               
                this.isSubmitted = true
                this.error = null;
                    this.$auth.loginWith('local', { data: this.form })
                    .then(res => {
                        this.isSubmitted = false;
                        let url = this.$auth.$storage.getLocalStorage("redirect_url");
                        if(url){
                            this.$router.replace(url);
                        }else{
                            this.$router.push('/');
                        }
                        this.successToast("Login Success.", {title: "Login."})
                    })
                    .catch(err => {
                        
                        if (!err.response) return;
                        switch (err.response.status) {
                                case 403:
                                case 401:
                                    this.error = 'Incorrect username/password';
                                    break;
                                case 417:
                                    this.error = 'Unauthorized.'
                                    break;
                                default:
                                    this.error = err.response.data; // Will still keep this for now.
                                break;
                        }

                        this.errorToast(this.error, {title: "Login Credentials"})
                        this.isSubmitted = false
                    })
            }
        }
}
</script>
<style lang="scss" scoped>
.forgot-password {
    font-size: 15px;
    font-weight: 400;
    margin: 6px 0 0;
    display: inline-block;
    &:hover{
        border-color:inherit;
    }
}
</style>
