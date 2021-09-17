<template>
    <div class="w-100">
        <div class="w-100 p-4" v-if="$auth.user.phone_number">
            <b-form  v-if="$screen.width >= 768 && branches.length > 0">
                <b-form-group
                :label="branches.length == 1 ? 'Branch Name*' : 'Select Your branch to continue checkout*'"
                label-for="branch-select"
                >
                    <b-form-select v-model="form.branch_id" id="branch-select" class="mb-3" @change="onSelectBranch(form.branch_id)" :disabled="branches.length == 1">
                        <b-form-select-option :value="data.branch.id" v-for="(data,idx) in branches" :key="idx">{{data.branch.name}}</b-form-select-option>
                    </b-form-select>
                </b-form-group>
            </b-form>

            <!-- <PaymentsEasyPaisa 
            :url="iframe.url"
            :show="iframe.loader"
             /> -->

            <p class="w-100"  v-if="$screen.width >= 768"> 
                <strong>Add booking notes</strong>
            </p>
            <textarea class="w-100 textarea" v-model="form.notes"  v-if="$screen.width >= 768">
            </textarea>
            <!-- <template v-if="paymentMethods && paymentMethods.length > 0">
                <b-button variant="transparent" v-for="(pay,idx) in paymentMethods" :key="idx" @click="paymentNow(pay)" :disabled="(form.branch_id == '') ? true : false" class="w-100 payment-btn">
                    <img :src="pay.image" :alt="pay.title">
                </b-button>
            </template> -->
            <payment-methods
                :amount="deal.price"
                :order-reference="selectedPackage.order_reference"
                order-type="sms-manager-portal"
            ></payment-methods>
            
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
                            <b-button type="submit" class="btn-block w-100" variant="primary" :disabled="invalid || isSubmitted">Add Phone Number</b-button>
                        </b-form-group>
                    </b-col>
                </b-row>
            </b-form>
            </ValidationObserver>
        </div>
    </div>
</template>
<script>
import moment from 'moment'
export default {
    name: 'payment',
    layout: 'bookingWidget',
    data() {
        return {
            iframe: {
                url: 'about:blank',
                loader: true 
            },
            paymentMethods: [],
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
                business_id: '',
                branch_id: '',
                client_id: '',
                subTotal: 0,
                tax: 0,
                grandTotal: 0,
                paymentMethod: '',
                notes: '',
                deal: []
            },
            branches: [],
            deal: null,
            easypay: {
                form: false,
                confirmform: false,
                storeid: '',
                hasKey: '',
                easypayIndexPage: '',
                amount: '',
                postBackURL: '',
                paymentMethod: '',
                orderId: 0,
                expiryDate: '',
                autoRedirect: '',
                submitEasypaisa: false,
                submitEasypaisaConfirm: false,
            }
        }
    },
    created: function(){

        this.getDealsBranches();

        if(this.$route.query.branch){
            this.form.branch_id = this.$route.query.branch
        }
        
        if(!this.$auth.loggedIn){
            this.$auth.$storage.setLocalStorage("redirect_url", this.$route.path);
            
            this.$router.push({name: 'deals-id-checkout-auth'});
        }else{
            this.$auth.$storage.removeLocalStorage("redirect_url");
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
                        });
                    });
                });
        
            if(this.$auth.user.phone_number){
               this.getPaymentMethods(); 
            }
        }

    },
    computed:{
        taxes: function () {
            let taxes = this.form.deal[0].taxes;
            return taxes
        },
        subTotal: function () {
            let subTotal = 0
            subTotal += parseFloat(this.form.deal[0].price * 1);

            if (this.deal.business.is_tax_inclusive) {
                if(this.taxes){
                    this.taxes.forEach(tax => {
                        subTotal -= tax.amount
                    })
                }
            }
            return subTotal
        },
        taxTotal: function () {
            let taxTotal = 0
            if(this.taxes.length > 0){
                this.taxes.forEach(taxRow => {
                    taxTotal += taxRow.amount
                })
            }
            return taxTotal
        },
        grandTotal: function () {
            
           let total = this.subTotal + this.taxTotal;

           if (!this.deal.business.is_tax_inclusive) {
                if(this.taxData){
                    this.taxData.forEach(tax => {
                        total += tax.amount
                    })
                }
            }

            return total;
        },
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
        getDealsBranches: async function (){
            let branches = await this.$axios.get('deals/'+this.$route.params.id)
            this.branches = branches.data.deal.branches;
            this.deal = branches.data.deal;
            if(branches.data.deal.branches.length == 1){
                this.form.branch_id = branches.data.deal.branches[0].branch_id
                this.onSelectBranch(this.form.branch_id);
            }
        },
        onSelectBranch: function (branch_id){
            this.form.branch_id = '';
            let item = this.deal;
            let taxes = [];
            let description = '';
            this.form.deal = [];

            if(item && Object.keys(item).length !== 0){
                
                item.inclusions.forEach(async inclusion => {
                    let taxResponse = null
                    if (inclusion.service_id) {
                        // description += inclusion.service.title + " - (" + inclusion.quantity + ")<br />"
                        taxResponse = await this.$axios.get("taxes/get_by_service?branch_id=" + branch_id + "&service_id=" + inclusion.service_id)
                    } else if (inclusion.product_id) {
                        // description += inclusion.product.name + " - (" + inclusion.quantity + ")<br />"
                        taxResponse = await this.$axios.get("taxes/get_by_product?branch_id=" + branch_id + "&product_id=" + inclusion.product_id)
                    }
                    let taxData = taxResponse.data.tax
                    if (taxData) {
                        if (taxData.rate) {
                            taxes.push({ id: taxData.id, title: taxData.title, rate: taxData.rate, amount: parseFloat(this.calculateTax(taxData.rate, inclusion.price)) })
                        }
                        else {
                            if (taxData.tax_1) {
                                taxes.push({ id: taxData.tax_1.id, title: taxData.tax_1.title, rate: taxData.tax_1.rate, amount: parseFloat(this.calculateTax(taxData.tax_1.rate, inclusion.price)) })
                            }
                            if (taxData.tax_2) {
                                taxes.push({ id: taxData.tax_2.id, title: taxData.tax_2.title, rate: taxData.tax_2.rate, amount: parseFloat(this.calculateTax(taxData.tax_2.rate, inclusion.price)) })
                            }
                            if (taxData.tax_3) {
                                taxes.push({ id: taxData.tax_3.id, title: taxData.tax_3.title, rate: taxData.tax_3.rate, amount: parseFloat(this.calculateTax(taxData.tax_3.rate, inclusion.price)) })
                            }
                        }
                        
                    }else{
                        taxes = [];
                    }
                });

                setTimeout(() => {
                    
                    this.form.deal.push({
                        id: item.id,
                        cart: item,
                        business_id: item.business_id,
                        type: 'deal',
                        title: item.name,
                        description: item.description,
                        quantity: 1,
                        price: item.price,
                        taxes: taxes
                    });

                    let emitDataForParent = {
                        subTotal: this.subTotal,
                        taxes: this.taxTotal,
                        grandTotal: this.grandTotal
                    }

                    this.$emit('subTotalWithTax', emitDataForParent)

                    this.form.branch_id = branch_id
                }, 1200);
            }

        },
        paymentNow: async function(payment){
            const cartItems = {
                    items: this.form.deal,
                    currentUrl: process.env.BASE_URL+this.$route.fullPath+'?confirm=1',
                    business_id: this.form.deal[0].business_id,
                    branch_id: this.form.branch_id,
                    customer: this.$auth.user,
                    notes: this.form.notes,
                    payment_method_id: payment.id,
                    payment_method: '',
                    status: "unpaid",
                    subtotal: this.subTotal,
                    tax: this.taxTotal,
                    grandtotal: this.grandTotal.toFixed(2)
                };

             if (paymentMethod.title.toLowerCase() === "easypaisa") {
                    this.$axios.get("pay/easypaisa/url", {
                        params: {
                            amount: this.amount,
                            order_id: this.orderReference + this.$store.getters.user.business.id,
                            order_type: this.orderType
                        }
                    })
                    .then(response => {
                        window.location.href = response.data
                    })
             }
            // if(payment.title == "EasyPaisa"){

            //     this.$axios.post('pay/easypaisa', cartItems, {genericApi: true})
            //     .then(res => {
                    
            //         let params = {
            //             "storeId": res.data.storeId, 
            //             "orderId": res.data.orderRefNum, 
            //             "transactionAmount": res.data.amount,
            //             "transactionType": res.data.paymentMethod, 
            //             "tokenExpiry": res.data.expiryDate,
            //             "encryptedHashRequest": res.data.merchantHashedReq,
            //             "merchantPaymentMethod": res.data.merchantPaymentMethod,
            //             "mobileAccountNo": "",
            //             "emailAddress": res.data.emailAddress,
            //             "bankIdentificationNumber": "",
            //             "postBackURL": res.data.postBackURL,
            //             "signature": ""
            //         }

            //         if(params.storeId != "" && params.orderId !="") {
                        
            //             let str = Object.keys(params).map(function(k) {
            //                 return encodeURIComponent(k) + '=' + encodeURIComponent(params[k])
            //             }).join('&');

            //             let url = res.data.url+'?'+str;
            //             window.location.href = url;
                        
            //         } 
            //     })
            //     .catch(err => {
            //         if (!err.response) return;
            //         this.errorToast(err.response.data.message, {title: "Deal not purchased."})

            //     })

            // }
        },
        getPaymentMethods: function(){
            this.$axios.get('utilities/payment-methods/'+this.$auth.user.phone_country_id,{genericApi: true})
            .then(methods => {
                this.paymentMethods = methods.data.filter(res => res.id != 1);
            })
            .catch(err => {
                if (!err.response) return;
                this.errorToast(err.response.message, {title: "Payment Not Found."})
            })
        },
        onSubmit() {
            this.$axios.put('/customers/phone/'+this.$auth.user.id, this.form_phone)
            .then(res => {
                this.form.customer = res.data.user;
                this.$auth.setUser(res.data.user)
                this.$auth.fetchUser();
                this.getPaymentMethods(); 
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
.textarea{
    height: 120px;
    resize: none;
    border-color:rgb(213, 215, 218);
    border-radius: 4px;
    background-color: rgb(255, 255, 255);
    padding: 10px 16px;
    &:focus,&:active,&:hover{
        border-color: #0C56C9;
    }
}
p {
    color: #263957;
    font-size: 16px;
    line-height: 25px;
    margin-bottom: 8px;
}
#branch-select {
    color: rgba(38, 57, 87, 0.6);
    text-transform: uppercase;
    option {
        color: rgba(38, 57, 87, 0.6);
    }
    &:disabled{
        color: #000;
        appearance: none;
        background: #FFF;
    }
}
.payment-btn {
    margin: 20px 0 5px;
    border: 3px solid rgba(206, 214, 228, 0.5);
    border-radius: 5px;
    padding:0 10px;
    height: 60px;
    &:hover, &:active, &:focus {border: 3px solid #0C56C9;box-shadow: none;}
    
    img{
        max-height: 55px;
    }
}
.deals-checkout-btn {
    background-color: #263957;
    height: 50px;
    color: white;
    font-size: 20px;
    font-weight: 800;
    margin-top: 20px;
    line-height: 28px;
    width: 100%;
    border-radius: 5px;
}

</style>