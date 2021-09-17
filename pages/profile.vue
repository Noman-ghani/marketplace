<template>
<div class="profile pt-5 pb-5">
    <div class="container"> 
        <b-overlay :show="loader" rounded variant="transparent">
            <b-row>
                <b-col md="4" class="p-2">
                    <b-card body-class="p-4" footer-tag="footer" footer-class="w-100 p-3 bg-white d-flex align-items-center justify-content-center" class="d-flex align-items-center justify-content-center flex-wrap">
                        <div v-if="!form.profile_image" class="with-image">
                            <div class="border rounded-circle img d-flex justify-content-center align-items-center">
                                {{form.first_name.charAt(0)}}{{form.last_name.charAt(0)}}
                            </div>
                            <div class="bi-pencil-wrapper rounded-circle d-flex justify-content-center align-items-center flex-grow-1">
                                <b-form-file accept="image/*" @change="onUpload($event)" plain></b-form-file>
                                <b-icon-camera-fill font-scale="1" />
                            </div>
                        </div>
                        <div v-else class="with-image">
                            <b-img-lazy class="border rounded-circle" :src="form.profile_image" width="209" height="215"></b-img-lazy>
                            <div class="border bi-pencil-wrapper d-flex align-items-center rounded-circle">
                                <b-form-file accept="image/*" @change="onUpload($event)" plain></b-form-file>
                                <b-icon-pencil font-scale="0.9"/>
                            </div>
                        </div>
                        <h2 class="user_name">{{$auth.user.first_name +' '+$auth.user.last_name }}</h2>
                        <template #footer>
                            <span class="logout p-1 pl-4 pr-4" @click="logout">Logout</span>
                        </template>
                    </b-card>
                </b-col>
                <b-col md="8" class="p-2 edit-wrap">
                    <ValidationObserver ref="form" v-slot="{handleSubmit, invalid}">
                    <b-form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
                        <b-card body-class="p-4" footer-tag="footer" footer-class="w-100 bg-white p-2">
                            <h2 class="m-0 text-center mt-2 mb-3">Edit Profile</h2>
                            <b-row>
                                <b-col md="6">
                                    <ValidationProvider vid="first_name" name="First name" :rules="{required: true}" v-slot="{errors}">
                                    <b-form-group label="First name *" label-for="first_name">
                                        <b-form-input v-model="form.first_name" :class="{'is-invalid': errors[0]}"/>
                                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                    </b-form-group>
                                    </ValidationProvider>
                                </b-col>
                                <b-col md="6">
                                    <ValidationProvider vid="last_name" name="Last name" :rules="{required: true}" v-slot="{errors}">
                                    <b-form-group label="Last name *" label-for="last_name">
                                        <b-form-input v-model="form.last_name" :class="{'is-invalid': errors[0]}"/>
                                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                    </b-form-group>
                                    </ValidationProvider>
                                </b-col>
                                <b-col md="6">
                                    <b-form-group label="Phone number *" label-for="phone_number">
                                            <b-input-group class="phone">
                                                <b-input-group-prepend>
                                                    <b-input-group-text class="p-0">
                                                        <div class="select-wrap flag-wrap">
                                                            <div class="flag-code">
                                                                <span v-html="country.flag"></span>
                                                                <span class="pl-1 pt-1">{{country.phone_code}}</span>
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
                                                    <b-form-input :class="{'is-invalid': errors[0]}" @keyup="($event.target.value[0] === '0') ? form.phone_number = $event.target.value.substring(1) : ''" v-model="form.phone_number" v-mask="country.phone_mask" :placeholder="country.phone_mask"/>
                                                    <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                                </ValidationProvider>
                                            </b-input-group>
                                    </b-form-group>
                                </b-col>
                                <b-col md="6">
                                    <b-form-group label="E-mail address *" label-for="email">
                                        <ValidationProvider vid="email" name="Email" :rules="{required: true}" v-slot="{errors}">
                                        <b-form-input v-model="form.email" disabled :class="{'is-invalid': errors[0]}"/>
                                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                        </ValidationProvider>
                                    </b-form-group>
                                </b-col>
                                <b-col md="6">
                                    <ValidationProvider vid="birthday" name="Date of birth" :rules="{required: false}" v-slot="{errors}">
                                        <b-form-group
                                        label="Date of birth"
                                        label-for="birthday"
                                        description="We need this data for promotions and discounts"
                                        >

                                            <!-- <b-form-datepicker id="birthday" v-model="form.birthday" :class="{'is-invalid': errors[0]}"></b-form-datepicker> -->

                                       <date-range-picker single-date-picker show-dropdowns id="birthday" v-model="form.birthday" :class="{'is-invalid': errors[0]}"></date-range-picker>


                                            <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                            


                                        </b-form-group>
                                    </ValidationProvider>
                                </b-col>
                                <b-col md="6">
                                    <ValidationProvider vid="gender" name="Gender" :rules="{required: true}" v-slot="{errors}">
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
                            </b-row>
                            <template #footer >
                                <b-form-group class="float-right m-0 p-2">
                                    <b-button type="submit" class="btn-block p-1 pl-4 pr-4" variant="primary" :disabled="invalid || isSubmitted" >Update</b-button>
                                </b-form-group>
                            </template>
                        </b-card>
                    </b-form>
                    </ValidationObserver>
                </b-col>
            </b-row>
            <b-modal ref="profile-photo-modal" no-close-on-esc no-close-on-backdrop title="Resize / Crop Image" ok-only ok-title="Apply" @ok="onCroppedOrResized($event)">
                <clipper-basic :src="profileImageURL" ref="clipper"></clipper-basic>
            </b-modal>
        </b-overlay>
    </div>
</div>
</template>
<script>


import DateRangePicker from "vue2-daterange-picker"; 

export default { 
    
    components: { DateRangePicker }, 
    name: "FilterProductList", 
    
  
    data: function(){
        return {
            form: {
                profile_image: null,
                first_name: this.$auth.user.first_name,
                last_name: this.$auth.user.last_name,
                email: this.$auth.user.email,
                phone_number: this.$auth.user.phone_number,
                phone_country_id: null,
                birthday: {
                    startDate: this.$auth.user.birthday,
                },
                gender: this.$auth.user.gender ? this.$auth.user.gender : "",
            },
            loader:false,
            profileImageURL: null,
            phoneNumbers: [],
            countries: {
                loader: true,
                items: []
            },
            timezones: {
                loader: true,
                items: []
            },
            isSubmitted: false,

        }
    },
    created: function(){
        if(!this.$auth.loggedIn){
            this.$router.push({path: '/'});
        }else{
            this.form.profile_image = this.$auth.user.profile_image
            this.getCountriesWithTimezone();
        }
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
    methods:{
        logout: function(){
            this.$auth.logout();
            this.successToast("Logout Success.", {title: "Logout."})
        },
        getCountriesWithTimezone: function(){
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
        onUpload: function ($event) {
            if ($event.target.files.length !== 0) {
                if (this.profileImageURL) URL.revokeObjectURL(this.profileImageURL)
                this.profileImageURL = window.URL.createObjectURL($event.target.files[0])
                this.$refs["profile-photo-modal"].show();
            }
        },
        onCroppedOrResized: function () {
            this.form.profile_image = this.$refs.clipper.clip().toDataURL("image/jpeg", 1)
            this.profileImageURL = null
            this.$refs["profile-photo-modal"].hide()

            this.$axios.put('customers/image/'+this.$auth.user.id,this.form)
            .then(res => {
                this.loader = false
                this.successToast(res.data.message, {title: "Image Updated."})
            }).catch(err => {
                if (!err.response) return;
                this.errorToast(err.response.data.message, {title: "Image Not Updated."})
            });
        },
        onSubmit: function () {
          
            this.$axios.put('/customers/'+this.$auth.user.id, this.form)
            .then(res => {
                this.successToast(res.data.message, {title: "Profile Updated."})
                this.$auth.setUser(res.data.user)
                this.$auth.fetchUser();
            })
            .catch(err => {
                if (!err.response) return;
                this.isSubmitted = false
                this.$refs.form.setErrors(errors.response.data)
                this.errorToast("Something went wrong profile not updated.", {title: "Profile Not Updated."})
            });
      }
    }
}
</script>
<style lang="scss" scoped>
.profile{
    background: #f2f2f7;
    .container{
        max-width: 976px;
    }
    .with-image,.no-image{
        position: relative;
        width: 120px;
        height: 120px;
        margin: 0 auto 10px;
        img,.img{
            width: 100%;
            height: 100%;
            object-fit: cover;
            font-size: 32px;
            font-weight: 700;
        }
        .bi-pencil-wrapper{
            position: absolute;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            cursor: pointer;
            background-color: #037aff;
            border: 2px solid #fff;
            right: 0;
            bottom: 10px;
            svg{color:#FFF}
            .form-control-file{
                position: absolute;
                font-size: 0;
                height: 100%;
                width: 100%;
                opacity: 0;
                cursor: pointer;
            }
        }
    }
    .user_name{
        font-size: 24px;
        font-weight: 800;
        line-height: 32px;
        text-align: center;
        color: #000;
        margin-bottom: 0;
    }
    .card{
        box-shadow: 0 2px 8px 0 rgb(0 0 0 / 15%);
        border-radius: 7px;
    }
.btn{
    text-transform: capitalize;
    font-size: 18px;
    font-weight: bold;
    background-color: #263957;
    border: none;
    height: 40px;
    &:hover, &:active, &:focus {
        box-shadow: none !important;
        background-color: #263957;
    }
}
.logout{
    font-size: 17px;
    font-weight: 400;
    line-height: 24px;
    color: #da2346;
    cursor: pointer;
}
.edit-wrap {
    .col-md-6 {
        padding: 0 10px;
    }
    h2 {
        font-size: 22px;
        color: #000;
    }
    .form-group {
        margin-bottom: 12px;
        label {
            margin-bottom: 5px;
        }
        .select-wrap {
            border-radius: 5px;
            border-color: #ced4da !important;
            &.flag-wrap {
                select {
                    max-height: 40px;
                }
                .flag-code {
                    span {
                        color: rgba(0, 0, 0, 0.5);
                        font-size: 14px;
                        &:first-child {
                            font-size: 18px;
                        }
                    }
                }
            }
            .select-icon {
                svg {
                    color: #000;
                }
            }
        }
        input, select {
            color: rgba(0, 0, 0, 0.5) !important;
            font-size: 14px;
            font-weight: 500;
            max-height: 44px;
            &:focus {
                border-color: #ced4da !important;
            }
        }
        #birthday__outer_ {
            color: rgba(0, 0, 0, 0.5) !important;
            font-size: 14px;
            font-weight: 600;
            .btn {
                svg {
                    color: #000;
                }
            }
        }
    }
}
}
</style>