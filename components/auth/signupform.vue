<template>
    <div>
         <h3 v-if="$route.name == 'signup'">
            <nuxt-link to="/signup">
                <b-icon-arrow-left />
            </nuxt-link>
            Sign up with email
        </h3>
        <ValidationObserver ref="form" v-slot="{handleSubmit, invalid}">
        <b-form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
                <b-row>
                    <b-col md="6">
                        <ValidationProvider vid="first_name" name="First name" :rules="{required: true}" v-slot="{errors}">
                            <b-form-group label="First name *" label-for="first_name">
                                <b-form-input v-model="form.first_name" :class="{'is-invalid': errors[0]}" />
                                <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                            </b-form-group>        
                        </ValidationProvider>
                    </b-col>
                    <b-col md="6">
                        <ValidationProvider vid="last_name" name="Last name" :rules="{required: true}" v-slot="{errors}">
                            <b-form-group label="Last name *" label-for="last_name">
                                <b-form-input v-model="form.last_name" :class="{'is-invalid': errors[0]}" />
                                <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                            </b-form-group>
                        </ValidationProvider>
                    </b-col>
                    <b-col md="6">
                        <b-form-group label="Phone number *" label-for="phone_number">
                            <overlay :show="countries.loader" is-field>
                                <b-input-group class="phone">
                                    <b-input-group-prepend>
                                        <b-input-group-text class="p-0">
                                            <div class="select-wrap flag-wrap">
                                                <div class="flag-code">
                                                    <span v-html="country.flag"></span>
                                                    <span class="pl-2">{{country.phone_code}}</span>
                                                </div>
                                                <b-form-select v-model="form.phone_country_id" class="b-0">
                                                    <b-form-select-option v-for="country in countries.items" v-bind:key="country.id" :value="country.id" v-html="country.name + ' ' + country.flag + ' +' + country.phone_code" />
                                                </b-form-select>
                                                <span class="select-icon">
                                                    <b-icon icon="chevron-down" font-scale=".9"></b-icon>
                                                </span>
                                            </div>
                                        </b-input-group-text>
                                    </b-input-group-prepend>
                                    <ValidationProvider vid="phone_number" name="Phone number" :rules="{required: true, min:11}" v-slot="{errors}">
                                        <b-form-input @keyup="($event.target.value[0] === '0') ? form.phone_number = $event.target.value.substring(1) : ''" v-model="form.phone_number" v-mask="country.phone_mask" :placeholder="country.phone_mask" :class="{'is-invalid': errors[0]}" />
                                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                    </ValidationProvider>
                                </b-input-group>
                            </overlay>
                        </b-form-group>
                    </b-col>
                    <b-col md="6">
                        <ValidationProvider vid="email" name="Email" :rules="{required: true}" v-slot="{errors}">
                            <b-form-group label="E-mail address *" label-for="email">
                                <b-form-input v-model="form.email" :class="{'is-invalid': errors[0]}" />
                                <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                            </b-form-group>
                        </ValidationProvider>
                    </b-col>
                    <b-col md="6">
                        <ValidationProvider vid="birthday" name="Date of birth" :rules="{required: false}" v-slot="{errors}">
                            <b-form-group
                            label="Date of birth"
                            label-for="birthday">
                                <b-form-datepicker id="birthday" v-model="form.birthday" :class="{'is-invalid': errors[0]}"></b-form-datepicker>
                                <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                            </b-form-group>
                        </ValidationProvider>
                    </b-col>
                    <b-col md="6">
                        <ValidationProvider vid="gender" name="Gender" :rules="{required: false}" v-slot="{errors}">
                        <b-form-group
                        label="Gender" 
                        label-for="gender">
                            <div class="select-wrap flag-wrap form-control p-0 h-auto" :class="{'is-invalid': errors[0]}">
                                <b-form-select v-model="form.gender" id="gender">
                                    <b-form-select-option value="">Select Gender</b-form-select-option>
                                    <b-form-select-option value="male">Male</b-form-select-option>
                                    <b-form-select-option value="female">Female</b-form-select-option>
                                </b-form-select>
                                <span class="select-icon">
                                    <b-icon icon="chevron-down" font-scale=".9"></b-icon>
                                </span>
                            </div>
                            <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                        </b-form-group>
                        </ValidationProvider>
                    </b-col>
                    <b-col md="6">
                        <ValidationProvider vid="password" name="Password" :rules="{required: true, min: 7, one_number: true, one_uppercase: true, one_lowercase: true}" v-slot="{errors}">
                            <b-form-group label="Password *" label-for="password">
                                <b-input-group>
                                    <b-form-input :type="showPassword ? 'text' : 'password'" ref="password" v-model="form.password" :class="{'is-invalid': errors[0]}"/>
                                    <b-input-group-append>
                                        <b-input-group-text style="cursor: pointer;" @click="showPassword = !showPassword">
                                            <b-icon-eye-slash-fill v-if="!showPassword" />
                                            <b-icon-eye-fill v-else />
                                        </b-input-group-text>
                                    </b-input-group-append>
                                    <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                </b-input-group>
                            </b-form-group>
                        </ValidationProvider>
                    </b-col>
                    <b-col md="6">
                        <ValidationProvider vid="confirm_password" name="Confirm Password" :rules="{required: true, confirmed: 'password'}" v-slot="{errors}">
                            <b-form-group label="Confirm Password *" label-for="confirm_password">
                                <b-input-group>
                                    <b-form-input :type="showConfirmPassword ? 'text' : 'password'" ref="confirm_password" v-model="form.confirm_password" :class="{'is-invalid': errors[0]}"/>
                                    <b-input-group-append>
                                        <b-input-group-text style="cursor: pointer;" @click="showConfirmPassword = !showConfirmPassword">
                                            <b-icon-eye-slash-fill v-if="!showConfirmPassword" />
                                            <b-icon-eye-fill v-else />
                                        </b-input-group-text>
                                    </b-input-group-append>
                                    <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                </b-input-group>
                            </b-form-group>
                        </ValidationProvider>
                    </b-col>
                    <b-col md="12">
                    <ValidationProvider vid="privacy_policy" name="Privacy Policy" :rules="{required: true}" v-slot="{errors}">
                      <b-form-checkbox v-model="form.privacy_policy" value="1" unchecked-value="" >
                          I agree to the <a href="https://servuapp.com/privacy-policy" target="_blank">privacy policy</a> and <a href="https://servuapp.com/terms-conditions" target="_blank">terms</a>
                      </b-form-checkbox>
                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                    </ValidationProvider>
                    </b-col>
                    <b-col md="12" class="mt-3">
                        <b-form-group class="mb-0">
                            <b-button type="submit" class="btn-block w-100" variant="primary" :disabled="invalid || isSubmitted">Sign up</b-button>
                        </b-form-group>
                    </b-col>
                </b-row>
        </b-form>
        </ValidationObserver>
    </div>
</template>
<script>

export default {
    name : 'signupform',
    data() {
      return {
        form: {
          first_name: null,
          last_name: null,
          birthday: null,
          email: null,
          gender: "",
          password: null,
          phone_country_id: null,
          phone_number: null,
          privacy_policy: ""
        },
        showPassword: false,
        showConfirmPassword: false,
        phoneNumbers: [],
        countries: {
            loader: true,
            items: []
        },
        timezones: {
            loader: true,
            items: []
        },
        isSubmitted: false
      }
    },
    created: function () {
      this.$axios.get("utilities/countries?withcites",{genericApi: true}).then((countries) => {
          this.countries.items = countries.data
          this.phoneNumbers = countries.data.map((country) => {
            
              return {
                  value: country.phone_code,
                  text: "(" + country.phone_code + ") " + country.name
              }
          })
          

          this.$axios.get("utilities/timezones",{genericApi: true}).then((timezones) => {
                this.timezones.items = timezones.data.map((timezone) => {
                    return {
                        value: timezone.id,
                        text: "(GMT " + timezone.offset + ") " + timezone.timezone
                    }
                })

                this.$axios.get("locale",{genericApi: true})
                .then(locale => {
                    const country_row = this.countries.items.filter((row) => {
                        if (row.name == locale.data.country) {
                            return row
                        }
                    })
                    
                    const timezone = timezones.data.filter((row) => {
                        if (row.timezone == locale.data.timezone) {
                            return row
                        }
                    })
                    
                    this.form.phone_country_id = country_row[0].id
                    this.form.country_id = country_row[0].id
                    this.form.timezone = timezone[0].id

                    this.countries.loader = false
                    this.timezones.loader = false
                })
            })
      })
    },
    computed: {
        country: function () {
            if (this.form.phone_country_id) {
                const country_row = this.countries.items.filter((row) => {
                    if (row.id == this.form.phone_country_id) {
                        return row
                    }
                })
                return country_row[0]
            }
            return ''
        }
    },
    methods: {
      onSubmit() {
            this.$axios.post('/customers', this.form)
            .then(res => {
                let url = this.$auth.$storage.getLocalStorage("redirect_url");
                if(url){
                    this.$router.replace(url);
                }else{
                    this.$router.push('/login');
                }
                this.successToast("Signup Success. Go to your email and verify your registration.", {title: "Signup."})
            })
            .catch(err => {
                console.log(err.response);
                if (!err.response) return;
                this.isSubmitted = false
                this.$refs.form.setErrors(err.response.data)
                if(err.response.data.email){
                    this.$refs.form.setErrors(err.response.data.email)
                }
                this.errorToast("Something went wrong please check or try again.", {title: "Signup Failed."})
            });
      }
    }
}
</script>
