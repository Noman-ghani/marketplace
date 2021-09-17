<template>
    <div class="w-100">
        <div class="submit-img" v-if="showSubmitImg">
            <img src="/images/check.gif"/>
            <p>Appointment Confirmed</p>
        </div>
        <div class="w-100 p-4 booking-notes-text" v-if="$auth.user.phone_number">
            <p class="w-100"> 
                Add booking notes
            </p>
            <span>Include comments or requests about your booking</span>
            <textarea class="w-100" v-model="form.notes">
            </textarea>
        </div>
        <div class="w-100 p-4 booking-notes-text" v-else>
            <ValidationObserver ref="form" v-slot="{handleSubmit, invalid}">
            <b-form @submit.prevent="handleSubmit(onSubmit)" autocomplete="off">
                <b-row>
                    <b-col md="12">
                        <b-form-group label="Phone number *" label-for="phone_number">
                            <b-overlay :show="countries.loader" rounded variant="transparent">
                                <b-input-group class="phone">
                                    <b-input-group-prepend>
                                        <b-input-group-text class="p-0">
                                            <div class="select-wrap flag-wrap">
                                                <div class="flag-code">
                                                    <span v-html="country.flag"></span>
                                                    <span class="pl-2">{{country.phone_code}}</span>
                                                </div>
                                                <b-form-select v-model="form_phone.phone_country_id" class="b-0">
                                                    <b-form-select-option v-for="country in countries.items" v-bind:key="country.id" :value="country.id" v-html="country.name + ' ' + country.flag + ' +' + country.phone_code" />
                                                </b-form-select>
                                                <span class="select-icon">
                                                    <b-icon icon="chevron-down" font-scale=".9"></b-icon>
                                                </span>
                                            </div>
                                        </b-input-group-text>
                                    </b-input-group-prepend>
                                    <ValidationProvider vid="phone_number" name="Phone number" :rules="{required: true, min:11}" v-slot="{errors}">
                                        <b-form-input @keyup="($event.target.value[0] === '0') ? form_phone.phone_number = $event.target.value.substring(1) : ''" v-model="form_phone.phone_number" v-mask="country.phone_mask" :placeholder="country.phone_mask"/>
                                        <b-form-invalid-feedback v-if="errors[0]" v-html="errors[0]"></b-form-invalid-feedback>
                                    </ValidationProvider>
                                </b-input-group>
                            </b-overlay>
                        </b-form-group>
                    </b-col>
                    <b-col md="12">
                        <b-form-group class="mb-0">
                            <b-button type="submit" class="btn-block w-100" variant="primary" :disabled="invalid || isSubmitted" >Add Phone Number</b-button>
                        </b-form-group>
                    </b-col>
                </b-row>
            </b-form>
            </ValidationObserver>
        </div>
        <div class="footer-area bg-white p-3 border-top position-fixed">
            <div class="container">
                <div class="d-flex justify-content-between">
                    <div>
                        <div v-if="$store.state.checkout.cart.data" class="footer-services">
                            <p class="m-0 services-count">
                                {{$store.state.checkout.cart.data.length}} Service<span v-if="$store.state.checkout.cart.data.length> 1">s</span> 
                            </p>
                            <p class="total m-0">
                                {{$store.state.business.list.country.currency}} {{$auth.$storage.getLocalStorage('total') | currency}}
                            </p>
                        </div>
                    </div>
                    <b-button variant="primary" @click="sheduleAppointment()">Confirm Now</b-button>
                </div>
            </div>
        </div>
    </div>

</template>
<script>
export default {
    layout: 'bookingWidget',
    data() {
        return {
            showSubmitImg: false,
            data: {
                name: 'b-branch_slug-booking-time',
                step: 4,
                title: 'Review and Confirm'
            },
            form_phone: {
                phone_country_id: null,
                phone_number: null
            },
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
            form: {
                type:'service',
                items: null,
                business_id: null,
                branch_id: null,
                staff_id: null,
                bookingDate: this.$auth.$storage.getLocalStorage("booking_date") ? this.$auth.$storage.getLocalStorage("booking_date") : null,
                notes: '',
                customer: this.$auth.user ? this.$auth.user : null
            }
        }
    },
    created: function () {
        if(!this.$auth.loggedIn){
            this.$router.push('auth');
        }

        if(this.$auth.loggedIn){
            this.$axios.get("utilities/countries",{genericApi: true}).then((countries) => {
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
                            
                            this.form_phone.phone_country_id = country_row[0].id
                            this.form_phone.country_id = country_row[0].id
                            this.form_phone.timezone = timezone[0].id

                            this.countries.loader = false
                            this.timezones.loader = false
                        })
                });
            });
            
            this.$store.commit("checkout/step/add",this.data);
            let step = this.$store.state.checkout.staff.data;
            this.$auth.$storage.setLocalStorage("step",step);
            this.getStoreItemFromLocalStorage();
            let items = this.$store.state.checkout.cart.data;
            this.form.business_id = this.$store.state.business.branch.business_id;
            this.form.branch_id = this.$store.state.business.branch.id;
            this.form.staff_id = this.$store.state.checkout.staff.data.id;
            this.$auth.$storage.removeLocalStorage("redirect_url");

            if(items && items.length> 0){
                items = items.filter(res => {
                    res.staff_id = this.form.staff_id
                    return res;
                })
            }
            this.form.items = items
            console.log(this.form.items);
        }

    },
    computed: {
        country: function () {
            if (this.form_phone.phone_country_id) {
                const country_row = this.countries.items.filter((row) => {
                    if (row.id == this.form_phone.phone_country_id) {
                        return row
                    }
                })
                return country_row[0]
            }
            return ''
        }
    },
    methods: {
        sheduleAppointment: function(){
            this.showSubmitImg = true;
            this.$axios.post('/appointments',this.form)
            .then(res => {
                this.$auth.$storage.removeLocalStorage("redirect_url");
                this.$auth.$storage.removeLocalStorage("step");
                this.$auth.$storage.removeLocalStorage("booking_date");
                this.$auth.$storage.removeLocalStorage("booking_Time");
                this.$auth.$storage.removeLocalStorage("cart");
                this.$auth.$storage.removeLocalStorage("staff");
                this.$auth.$storage.removeLocalStorage("business");
                this.$auth.$storage.removeLocalStorage("branch");
                this.$auth.$storage.removeLocalStorage("settings");
                setTimeout(() => {
                    this.showSubmitImg = false;
                    this.$router.push('/appointments');
                }, 800);
            })
            .catch(err => {
                    if (!err.response) return;

                    this.errorToast(err.response.data.message, {title: "Checkout Process Not Completed."})

            })
        },
        handleSubmit() {
            
            this.$axios.put('/customers/phone/'+this.$auth.user.id, this.form_phone)
            .then(res => {
                this.form.customer = res.data.user;
                this.$auth.setUser(res.data.user)
                this.$auth.fetchUser();
            })
            .catch(err => {
                if (!err.response) return;
                this.isSubmitted = false
                this.$refs.form.setErrors(errors.response.data)
                this.errorToast(err.response.data.message, {title: "User Not Updated."})

            })
            
        }
    }
}
</script>

<style lang="scss" scoped>
.select-wrap {
        position: relative;
        &.flag-wrap {
            .flag-code {
                position: absolute;
                background: #FFF;
                top: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                padding-right: 20px;
                z-index: 1;
                pointer-events: none;
                width: 100%;
            }
            select {
                min-width: 80px;
                max-width: 90px;
                border: 0;
                max-height: 45px;
            }
        }
        select {
            -moz-appearance: none !important;
            -webkit-appearance: none !important;
            appearance: none !important;
            cursor: pointer;
            padding: 10px 30px 10px 10px;
            outline: none !important;
            border: none;
            position: relative;
            background: transparent;
            option {
                padding-right: 10px;
            }
        }
        .select-icon {
            position: absolute;
            z-index: 1;
            height: 25px;
            width: 16px;
            right: 8px;
            top: 0;
            bottom: 0;
            margin: auto;
            pointer-events: none;
        }
}
.phone {
    flex-wrap: nowrap;
    .input-group-prepend {
        max-height: 49px;
        &~span,
        &~div {
            flex-grow: 1;
            input {
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
            }
        }
    }
}
.booking-notes-text {
    background-color: white;
    z-index: 2;
    position: relative;
    box-shadow: 0px 4px 30px rgb(0 0 0 / 10%);
    border-radius: 10px;
    @media (max-width:767px) {
        top: 20px;
        box-shadow: none;
        border-radius: 0;
    }
    p {
        color: #000;
        font-size: 20px;
        font-weight: 700;
        margin-bottom: 0;
        line-height: 25px;
        margin-bottom: 5px;
    }
    span {
        color: rgba(0, 0, 0, 0.5);
        font-size: 16px;
        font-weight: 600;
        line-height: 20px;
    }
}
textarea{
    margin-top: 20px;
    height: 157px;
    resize: none;
    border: 1px solid rgba(38, 57, 87, 0.4);
    color: rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    background-color: rgb(255, 255, 255);
    padding: 10px 16px;
}
.footer-services{
    .services-count{
        letter-spacing: 0px;
        margin: 0px;
        min-width: 0px;
        font-size: 16px;
        font-weight: 600;
        line-height: 20px;
        color: rgba(0, 0, 0, 0.5);
    }
    .total{
        letter-spacing: 0px;
        margin: 0px;
        min-width: 0px;
        font-size: 20px;
        font-weight: 700;
        line-height: 25px;
        color: #000;
        padding-top: 2px;
    }
}
.submit-img {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 99999;
    width: 100vw;
    height: 100vh;
    text-align: center;
    background-color: #101A2B;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
    align-items: center;
    img {width:150px;}
    p {
        font-size: 35px;
        font-weight: bold;
        color: white;
        padding-top: 20px;
        width: 100%;
    }
}
</style>