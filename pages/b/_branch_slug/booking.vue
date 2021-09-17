<template>
    <div>
        <div class="top-area">
            <div class="container">
                <div class="steps m-0 d-flex justify-content-between">
                    <!-- {{backData}} -->
                    <p class="m-0">
                        <span class="cursor-pointer go-back" v-if="backData[backData.length - 1].name" @click="$store.commit('checkout/step/remove')">
                            <b-icon-arrow-left style="color:#FFF" />
                        </span>
                        Step {{backData[backData.length - 1].step}} of 4
                    </p>
                
                    <div @click="goBack" class="back cursor-pointer">
                        <b-icon-x class="text-white" font-scale="2"/>
                    </div>
                </div>
                <div class="d-flex justify-content-between">
                    <h2 class="mb-4">{{backData[backData.length - 1].title}}</h2>
                    <div class="icon-cart" @click="showCartOnMobile()" v-show="$screen.width < 768"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart" viewBox="0 0 16 16">
                        <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                    </svg></div>
                </div>
            </div>
        </div>
        <div class="body-area">
            <div class="container">
                <div class="booking-grid">
                    <div class="left" size="5">
                        <BookingServices v-if="$route.name == 'b-branch_slug-booking'"/>
                        <div class=" flex-wrap p-0">
                            <NuxtChild />
                        </div>
                    </div>
                    <div class="right" size="3" ref="cartArea" v-if="$store.state.business.list">
                            <div class="cart-servu">
                                <div class="cart-top">
                                    <nuxt-link :to="'/b/'+$route.params.branch_slug" class="branch">
                                        <div class="branch-img" :style="'background-image:url('+ $store.state.business.branch.profile_image +')'"></div>
                                    </nuxt-link>
                                    <div class="branch-detail text-center w-100">
                                        <p class="title">{{$store.state.business.branch.name}}</p>
                                        <p class="address">{{$store.state.business.branch.address}}</p>
                                    </div>
                                </div>
                                <ul class="cart-bottom pb-0" v-if="bookingDetails">
                                    <li class="item d-flex flex-row">{{bookingDetails.booking_date}} at {{bookingDetails.booking_time}}</li>
                                    <li class="item d-flex flex-row tax">Duration {{$store.state.business.settings.durations.filter(duration => duration.value == bookingDetails.duration)[0].text}}, Stated at {{bookingDetails.booking_time}}</li>
                                </ul>
                                <ul class="cart-items">
                                    <template v-if="cartData && cartData.length > 0">
                                        <li class="item d-flex flex-row tax" v-for="(data,idx) in cartData" :key="idx">
                                            <b-icon-trash v-if="$route.name == 'b-branch_slug-booking'" font-scale="1" class="cursor-pointer remove-item" @click="removeItem(data)"/>
                                            <div class="d-flex flex-column flex-grow-0">
                                                <p class="m-0 item-name dark-grey ">{{data.text}}</p>
                                                <p class="m-0 item-detail">
                                                    {{$store.state.business.settings.durations.filter(duration => duration.value == data.duration)[0].text}}
                                                    <span v-if="data.hasMultiplePricings">{{data.pricing_name}}</span>
                                                    <span v-if="data.available_for">{{data.available_for}} only</span>
                                                </p>
                                            </div>
                                            <div class="d-flex price flex-column flex-grow-1">
                                                <p class="m-0 dark-grey" v-if="+data.special_price != 0">{{$store.state.business.list.country.currency}} {{data.special_price | currency}}</p>
                                                <p class="m-0"><span :class="(+data.special_price != 0) ? 'del' : 'dark-grey'">{{$store.state.business.list.country.currency}} {{data.price | currency}}</span> </p>
                                            </div>    
                                        </li>
                                    </template>
                                    <li v-else class="text-center p-3 text-secondary">
                                        No Services added in Cart
                                    </li>
                                </ul>
                                <ul class="cart-bottom">
                                    <li class="d-flex tax">
                                        <p class="flex-grow-1 tax">Subtotal</p>
                                        <p>{{$store.state.business.list.country.currency}} {{subTotal | currency}}</p>
                                    </li>
                                    <li class="d-flex tax" v-if="totalTaxes">
                                        <p class="flex-grow-1 tax">Taxes</p>
                                        <p>{{$store.state.business.list.country.currency}} {{totalTaxes | currency}}</p>
                                    </li>

                                    <li class="d-flex">
                                        <p class="flex-grow-1">Total</p>
                                        <p>
                                            <span>{{$store.state.business.list.country.currency}} {{grandTotal | currency}}</span>
                                        </p>
                                    </li>
                                </ul>
                                <div class="wav-border">
                                    <div class="wav-pattern"></div>
                                </div>
                            </div>
                            <div class="close-overlay" @click="closeCart">

                            </div>
                    </div>
                </div>
            </div>
        </div>
        <booking-footerBtn v-if="(cartData && cartData.length > 0) && $route.name == 'b-branch_slug-booking'" link="booking/staff"/>
    </div>
</template>
<script>
import moment from 'moment';
export default {
    layout: 'bookingWidget',
    data() {
        return {
            cart:{
                total: 0
            },
            bookingDetails: null
            
        }
    },
    mounted: function(){
        this.$root.$on('booking_details', function(val){
            this.bookingDetails = val;
        })
    },
    computed: {
        cartData: function () {
            let cart = this.$store.state.checkout.cart.data;
            return cart;
        },
        totalTaxes: function () {
            let totalTax = 0;
            this.taxData.forEach(res => {
                totalTax += res.amount;
            })
            return totalTax;
        },
        taxData: function () {
            let taxes = []
            if (this.cartData) {
                this.cartData.forEach(cart => {
                    const price = (cart.discount_price > 0 ? cart.discount_price : cart.special_price > 0 ? cart.special_price : cart.price) * cart.quantity
                    if (cart.tax) {
                        if (cart.tax.rate) {
                            
                            let taxRow = taxes.filter(row => row.id == cart.tax.id)
                            
                            if (taxRow.length) {
                                taxRow[0].amount += parseFloat(this.calculateTax(cart.tax.rate, price))
                            } else {
                                taxes.push({id: cart.tax.id, title: cart.tax.title, rate: cart.tax.rate, amount: parseFloat(this.calculateTax(cart.tax.rate, price))})
                            }
                        } else {
                            if (cart.tax.tax_1) {
                                let tmp_tax_1 = taxes.filter(row => row.id == cart.tax.tax_1.id);
                                if(tmp_tax_1.length){
                                    tmp_tax_1[0].amount += parseFloat(this.calculateTax(cart.tax.tax_1.rate, price))
                                }else{
                                    taxes.push({id: cart.tax.tax_1.id, title: cart.tax.tax_1.title, rate: cart.tax.tax_1.rate, amount: parseFloat(((cart.tax.tax_1.rate / 100) * price))})
                                }
                            }
                            
                            if (cart.tax.tax_2) {
                                let tmp_tax_2 = taxes.filter(row => row.id == cart.tax.tax_2.id);
                                if(tmp_tax_2.length){
                                    tmp_tax_2[0].amount += parseFloat(this.calculateTax(cart.tax.tax_2.rate, price))
                                }else{
                                    taxes.push({id: cart.tax.tax_2.id, title: cart.tax.tax_2.title, rate: cart.tax.tax_2.rate, amount: parseFloat(((cart.tax.tax_2.rate / 100) * price))})
                                }
                            }
                            if (cart.tax.tax_3) {
                                let tmp_tax_3 = taxes.filter(row => row.id == cart.tax.tax_3.id);
                                if(tmp_tax_3.length){
                                    tmp_tax_3[0].amount += parseFloat(this.calculateTax(cart.tax.tax_3.rate, price))
                                }else{
                                    taxes.push({id: cart.tax.tax_3.id, title: cart.tax.tax_3.title, rate: cart.tax.tax_3.rate, amount: parseFloat(((cart.tax.tax_3.rate / 100) * price))})
                                }
                            }
                        }
                    }
                })
            }
            return taxes
        },
        subTotal: function() {
            let subTotal = this.cart.total
            if(this.cartData){
                this.cartData.forEach(cart => {
                        if(+cart.special_price){
                            subTotal += parseFloat(cart.special_price);
                        }else{
                            subTotal += parseFloat(cart.price);
                        }
                })
            }
            
            // add tax 
            if (this.$store.state.business.list.is_tax_inclusive) {
                if(this.taxData){
                    this.taxData.forEach(tax => {
                        subTotal -= tax.amount
                    })
                }
            }

            return subTotal
        },
        grandTotal: function () {
            // console.log(this.totalTaxes);
            let total = this.subTotal + this.totalTaxes;
            
            if (!this.$store.state.business.list.is_tax_inclusive) {
                if(this.taxData){
                    this.taxData.forEach(tax => {
                        total += tax.amount
                    })
                }
            }

            this.$auth.$storage.setLocalStorage('total',total);
            return total
        },
        backData: function () {
            // this.$store.commit('checkout/step/remove');
            let data = {
                name : null,
                step: 1,
                title: 'Select Services'
            };
            
            this.$store.commit("checkout/step/add",data);
            
            if(this.$store.state.checkout.step.data){
                data = this.$store.state.checkout.step.data;
            }

            this.$auth.$storage.getLocalStorage("step",data);

            return data;
        },
    },
    methods:{
        goBack: function(){
            this.$auth.$storage.removeLocalStorage("redirect_url");
            this.$auth.$storage.removeLocalStorage("step");
            this.$auth.$storage.removeLocalStorage("booking_date");
            this.$auth.$storage.removeLocalStorage("booking_Time");
            this.$auth.$storage.removeLocalStorage("cart");
            this.$auth.$storage.removeLocalStorage("staff");
            this.$auth.$storage.removeLocalStorage("business");
            this.$auth.$storage.removeLocalStorage("branch");
            this.$auth.$storage.removeLocalStorage("settings");
            this.$store.commit("checkout/cart/removeAll")
            this.$store.commit("checkout/step/removeAll")
            this.$store.commit("checkout/staff/remove")
            
            this.$router.push({name: 'b-branch_slug'})
        },
        showCartOnMobile: function() {
            if(this.$screen.width < 768){
                this.$refs.cartArea.style.display = 'flex'
            }
        },
        closeCart: function() {
            if(this.$screen.width < 768){
                this.$refs.cartArea.style.display = 'none'
            }
        },
        removeItem: function(cart) {
            this.$root.$emit("removedCartItem",cart)
        }
    }
}
</script>
<style lang="scss" scoped>
.body-area .booking-grid {
    .right{
        .cart-items{
            .items{
                padding: 10px 10px 10px 5px;
            }
        }
    }
}
@media (max-width:767px) {  
    .close-overlay {
        // background: rgba(16, 26, 43, 0.4);
        height: 100%;
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
    }
}
</style>

