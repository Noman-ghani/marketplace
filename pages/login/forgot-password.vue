<template>
    <div class="login">
        <h2 class="mb-2">Reset your password</h2>
        <p class="intro-text mb-4">Enter your registered login email address to receive a secure link to set a new password</p>
        <ValidationObserver ref="form" v-slot="{handleSubmit, invalid}">
            <b-form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
                <ValidationProvider vid="email" name="E-mail address" :rules="{required: true, email: true}" v-slot="{errors}">
                    <b-form-group label="E-mail address *" label-for="email">
                        <b-form-input v-model="form.email" :class="{'is-invalid': errors[0]}" />
                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                    </b-form-group>
                </ValidationProvider>
                <div class="form-group">
                    <form-button type="submit" class="btn-block w-100" :disabled="invalid || isSubmitted" :isSubmitted="isSubmitted">Send Password Reset</form-button>
                </div>
            </b-form>
        </ValidationObserver>
        <div class="text-center">
            <router-link :to="{name: 'login-form'}">Back to Login</router-link>
        </div>
    </div>
</template>
<script>
    export default {
        data: function () {
            return {
                form: {
                    email: null
                },
                isSubmitted: false
            }
        },
        methods: {
            onSubmit: function () {
                this.isSubmitted = true
                this.$axios.post("/auth/forgot-password", this.form)
                .then(res => {
                    this.isSubmitted = false
                    console.log(res);
                    if (res.data.success) {
                        this.successToast(res.data.message,{title: "success"})
                        this.$router.push({name: "login"})
                    } else {
                        this.errorToast(res.data.message,{title: "danger"})
                    }
                })
                .catch(errors => {
                    this.isSubmitted = false
                    this.$refs.form.setErrors(errors.response.data)
                })
            }
        }
    }
</script>