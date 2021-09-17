<template>
    <b-overlay :show="showLoader" class="login">
        <template v-if="!showLoader">
            <h2 class="mb-2">Reset your password</h2>
            <p>Set your new password here. Make sure to set a strong password.</p>
            <ValidationObserver ref="form" v-slot="{handleSubmit, invalid}">
                <b-form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
                    <ValidationProvider vid="password" name="Password" :rules="{required: true, min: 7}" v-slot="{errors}">
                        <b-form-group label="Password *" label-for="password">
                            <b-input-group>
                                <b-form-input :type="showNewPassword ? 'text' : 'password'" ref="password" v-model="form.new_password" :class="{'is-invalid': errors[0]}" />
                                <b-input-group-append>
                                    <b-input-group-text style="cursor: pointer;" @click="showNewPassword = !showNewPassword">
                                        <b-icon-eye-slash-fill v-if="!showNewPassword"></b-icon-eye-slash-fill>
                                        <b-icon-eye-fill v-else></b-icon-eye-fill>
                                    </b-input-group-text>
                                </b-input-group-append>
                                <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                            </b-input-group>
                        </b-form-group>
                    </ValidationProvider>
                    <ValidationProvider vid="confirm_password" name="Confirm Password" :rules="{required: true, confirmed: 'password'}" v-slot="{errors}">
                        <b-form-group label="Confirm Password *" label-for="confirm_password">
                            <b-input-group>
                                <b-form-input :type="showConfirmPassword ? 'text' : 'password'" v-model="form.confirm_password" :class="{'is-invalid': errors[0]}" />
                                <b-input-group-append>
                                    <b-input-group-text style="cursor: pointer;" @click="showConfirmPassword = !showConfirmPassword">
                                        <b-icon-eye-slash-fill v-if="!showConfirmPassword"></b-icon-eye-slash-fill>
                                        <b-icon-eye-fill v-else></b-icon-eye-fill>
                                    </b-input-group-text>
                                </b-input-group-append>
                                <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                            </b-input-group>
                        </b-form-group>
                    </ValidationProvider>
                    <div class="form-group">
                        <form-button type="submit" class="btn-block w-100" :disabled="invalid || isSubmitted" :isSubmitted="isSubmitted">Reset Password</form-button>
                    </div>
                </b-form>
            </ValidationObserver>
        </template>
    </b-overlay>
</template>
<script>

export default {
        data: function () {
            return {
                showLoader: true,
                showNewPassword: false,
                showConfirmPassword: false,
                form: {
                    token: this.$route.query.token,
                    new_password: null,
                    confirm_password: null
                },
                isSubmitted: false
            }
        },
        created: function () {
            this.$axios.get("auth/check-token-expiry/reset-password/" + this.$route.query.token)
            .then(response => {
                this.showLoader = false
                if (!response.data.success) {
                    this.errorToast(response.data.message,{title: "danger"})
                    this.$router.push({name: "login"})
                }
            })
        },
        methods: {
            onSubmit: function () {
                this.isSubmitted = true
                this.$axios.post("auth/reset-password/" + this.$route.query.token, this.form)
                .then(response => {
                    this.isSubmitted = false
                    if (response.data.success) {
                        this.successToast(response.data.message,{title: "success"})
                        this.$router.push({name: "login"})
                    }
                })
                .catch(() => {
                    this.isSubmitted = false
                    this.$router.push({name: "login"})
                })
            }
        }
    }
</script>