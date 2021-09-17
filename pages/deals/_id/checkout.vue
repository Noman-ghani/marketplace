<template>
    <b-overlay :show="page_loader" variant="white" :opacity="1" :style="'height:'+(page_loader ? '100vh': 'auto')">
        <div v-if="!page_loader">
            <div class="top-area">
                <div class="container">
                    <div class="steps m-0 d-flex justify-content-between">
                        <!-- {{backData}} -->
                        <p class="m-0">
                            Only 1 Step to Purchase Deals
                        </p>
                        <nuxt-link :to="{name: 'deals-id'}" class="back">
                            <b-icon-x class="text-white" font-scale="2"/>
                        </nuxt-link>
                    </div>
                    <h2 class="mb-4">Review &amp; Confirm</h2>
                </div>
            </div>
            <div class="body-area">
                <div class="container">
                    <div class="booking-grid">
                        <div class="left" size="5">
                            <div class="categories-list flex-wrap p-0">
                                <NuxtChild v-on:subTotalWithTax="subTotalWithTax"/>
                            </div>
                        </div>
                        <div class="right" size="3">
                                <div class="cart-servu">
                                    <div class="cart-top">
                                        <nuxt-link :to="'/b/'" class="branch">
                                            <div class="branch-img" :style="'background-image:url('+deal.profile_image+');'"></div>
                                        </nuxt-link>
                                        <div class="branch-detail text-center w-100">
                                            <p class="title">{{deal.name}}</p>
                                            <!-- <p class="address">Deal description</p> -->
                                        </div>
                                    </div>
                                    <ul class="cart-items">
                                            <template v-for="(inc,idx) in deal.inclusions">
                                                <li class="item d-flex flex-row tax" :key="idx" v-if="inc.service">
                                                    <div class="d-flex flex-column flex-grow-0">
                                                        <p class="m-0 item-name dark-grey">{{inc.service.title}}</p>
                                                        <p class="m-0 item-detail">
                                                            <span>{{inc.service.description}}</span>
                                                        </p>
                                                    </div>
                                                    <div class="d-flex price flex-column flex-grow-1">
                                                        <p class="m-0 dark-grey" style="font-size:12px">{{inc.quantity}} x {{deal.business.country.currency}} {{inc.quantity * inc.price | currency}}</p>
                                                    </div>    
                                                </li>
                                                <li class="item d-flex flex-row tax" :key="idx" v-if="inc.product">
                                                    <div class="d-flex flex-column flex-grow-0">
                                                        <p class="m-0 item-name dark-grey">{{inc.product.name}}</p>
                                                        <p class="m-0 item-detail">
                                                            <span>{{inc.product.description}}</span>
                                                        </p>
                                                    </div>
                                                    <div class="d-flex price flex-column flex-grow-1">
                                                        <p class="m-0 dark-grey" style="font-size:12px">{{inc.quantity}} x {{deal.business.country.currency}} {{inc.quantity * inc.price | currency}}</p>
                                                    </div>    
                                                </li>
                                            </template>
                                    </ul>
                                    <ul class="cart-bottom" v-if="deal.business">
                                        <b-overlay :show="grandTotal.data && loader" variant="transparent">
                                            <li v-if="subTotal.data" class="d-flex tax">
                                                    <p class="flex-grow-1">Price</p>
                                                    <p>{{deal.business.country.currency}} {{subTotal.data | currency}}</p>
                                            </li>
                                            <li v-if="taxes.data" class="d-flex tax">
                                                    <p class="flex-grow-1">Taxes</p>
                                                    <p>{{deal.business.country.currency}} {{taxes.data | currency}}</p>
                                            </li>
                                            <li class="d-flex" v-if="grandTotal.data && taxes.data">
                                                <p class="flex-grow-1">Grand Total</p>
                                                <p class="m-0 dark-grey">{{deal.business.country.currency}} {{grandTotal.data | currency}}</p>
                                            </li>
                                        </b-overlay>
                                    </ul>
                                    <div class="wav-border">
                                        <div class="wav-pattern"></div>
                                    </div>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </b-overlay>
</template>
<script>
export default {
    layout: 'bookingWidget',
    data(){
        return{
            deal: [],
            page_loader: true,
            loader: true,
            taxes: {
                data: null
            },
            subTotal: {
                data: null
            },
            grandTotal: {
                data: null
            },
            cartDeal: null
        }
    },
    created: function () {
        this.$axios.get('deals/'+this.$route.params.id)
        .then(res => {
            this.deal = res.data.deal;
            
            let business_expire_date = res.data.deal.business.subscription_expires_at;
            let current_date = new Date();    
            if (current_date > business_expire_date) {    
                this.errorToast("This deal is not active any more in servU please search for another one.", {title: "Not Found"})
                this.$router.push({path: "/"})
            } 

            if(!res.data.purchase){
                this.errorToast("this deal has expired and not purchasable.", {title: "Deal Expired."})
                this.$router.push({name: "deals-id"})
            }
            this.page_loader = false
        })
        .catch(err => {
            if(err.response.status == 404){
                this.page_loader = true
                this.$router.push({path: '/'});
                this.errorToast("This deal is not active any more in servU please search for another one.", {title: "Not Found"})
            }
        });
    },
    methods:{
        subTotalWithTax: function(value){
            this.loader = true
            this.taxes.data = value.taxes;
            this.subTotal.data = value.subTotal;
            this.grandTotal.data = value.grandTotal;

            setTimeout(() => {
                this.loader = false;
            }, 500);
        },
    }
}
</script>

<style lang="scss" scoped>
.body-area .booking-grid .right .cart-items .item{
    padding: 10px 25px;
}
@media (max-width:767px) {
    .body-area {
        .booking-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 0;
            .left {
                width: 100%;
                .categories-list {
                    box-shadow: none;
                    position: static;
                }
            }
            .right {
                order: -1;
                padding-top: 32px;
                position: relative;
                display: block !important;
                z-index: 0;
                background: transparent;
                .cart-servu {
                    background: rgba(12, 86, 201, 0.07);
                    padding: 30px;
                    width: 100%;
                    box-shadow: none;
                    .cart-top {
                        align-items: center;
                        background-color: transparent;
                        padding: 0 0 20px;
                        border: none;
                        .branch {
                            margin: 0 30px 0 0;
                            position: static;
                            transform: translateX(0%) translateY(0%);
                        }
                        .branch-detail {
                            text-align: left !important;
                        }
                    }
                    .cart-items {
                        background-color: transparent;
                        .item {
                            padding: 10px 0;
                            .item-name {
                                font-size: 18px;
                                color: #263957;
                            }
                            .item-detail {
                                font-size: 13px;
                                padding-top: 5px;
                            }
                        }
                    }
                    .cart-bottom {
                        background-color: transparent;
                        padding: 24px 0;
                        border-top: 1px solid rgba(38, 57, 87, 0.1);
                    }
                }
            }
        }
    }
}
.body-area .booking-grid .right  .cart-items {
    .item {
        .item-detail {
            font-size: 13px;
        }
    }
}
</style>