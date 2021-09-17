<template>
    <b-overlay :show="deals_loader" variant="transparent">
        <div v-if="deal">
            <div class="container p-0">
                <b-card no-body class="deals-detail">
                    <b-row no-gutters>
                        <div class="detail-text">
                            <b-card-text class="pl-4 pr-4">
                                <h2 class="title">{{deal.name}}</h2>
                                <ins class="price"> <span v-if="deal.business">{{deal.business.country.currency}}</span> {{deal.price | currency}}/-</ins>
                                <del>{{deal.business.country.currency}} {{totalInclusionsPrice(deal) | currency}}</del><span class="off">{{calculateOffInDeal(totalInclusionsPrice(deal),deal.price)}}</span>
                                <!-- <p>4.0 <span>165 Ratings</span></p> -->
                                <nuxt-link :to="this.$route.params.id+'/checkout/payment'" class="btn btn-primary" v-if="purchaseable">Buy Now</nuxt-link>
                            </b-card-text>
                        </div>
                        <div class="detail-img">
                            <b-overlay :show="!purchaseable" class="offline-overlay">
                                <b-card-img :src="deal.profile_image" v-if="deal" :alt="deal.name" class="rounded-0"></b-card-img>
                                <template #overlay>
                                    <div class="d-flex align-items-center justify-content-center flex-column bg-white text-center p-4" style="width:calc(100% - 40px - 40px)">
                                        <svg class="Icon-c98r68-0 dZbhoG Icon-c98r68-1 flJfTH" viewBox="0 0 92 97" width="42px" height="47px"><defs><path d="M56.94 64.06a1.5 1.5 0 00-2.121 0L46 72.88l-8.819-8.819a1.5 1.5 0 10-2.12 2.121L43.878 75l-8.819 8.819a1.5 1.5 0 102.121 2.12L46 77.121l8.819 8.819a1.5 1.5 0 102.12-2.121L48.122 75l8.819-8.819a1.5 1.5 0 000-2.12z" id="a"></path></defs><g fill="none" fill-rule="evenodd"><path d="M87 0a5 5 0 015 5v66a5 5 0 01-5 5H5a5 5 0 01-5-5V5a5 5 0 015-5h82zM26.706 21.5H3V71a2 2 0 002 2l22.09.001A1.494 1.494 0 0126.707 72l-.001-50.5zM89 21.5H29.706V72c0 .385-.144.736-.382 1.001L87 73a2 2 0 002-2V21.5zM87 3H5a2 2 0 00-2 2v13.5h86V5a2 2 0 00-2-2zM13.38 8c1.637 0 2.965 1.343 2.965 3s-1.328 3-2.966 3c-1.637 0-2.965-1.343-2.965-3s1.328-3 2.965-3zM25.24 8c1.638 0 2.966 1.343 2.966 3s-1.328 3-2.966 3c-1.637 0-2.965-1.343-2.965-3s1.328-3 2.965-3z" fill="#101928"></path><circle fill="#adcdff" cx="46" cy="74" r="20"></circle><path d="M46 51c12.703 0 23 10.297 23 23S58.703 97 46 97 23 86.703 23 74s10.297-23 23-23zm0 3c-11.046 0-20 8.954-20 20s8.954 20 20 20 20-8.954 20-20-8.954-20-20-20z" fill="#101928"></path><use fill="#000" xlink:href="#a"></use></g></svg>
                                        <h2>Deal Has Expire</h2>
                                        <p>{{deal.name}} has expire and not valid on ServU anymore.</p>
                                    </div>
                                </template>
                            </b-overlay>
                            <b-card-img :src="deal.profile_image" class="rounded-0"></b-card-img>
                        </div>
                        
                    </b-row>
                </b-card>

                <div class="about-detail flex-column">
                    <div>
                        <h3>About This Deal</h3>
                        <p v-if="deal.description">{{deal.description}}</p>
                        <p v-else>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                    </div>
                    <b-row class="description-row">
                        <b-col md="6" class="pb-0 ds-col">
                            <div>
                                <h3>Services</h3>
                            </div>
                            <template v-for="(inc,idx) in deal.inclusions">
                                <div v-if="inc.service" :key="'s-'+idx" class="d-flex align-items-start description-list">
                                    <div class="w-100 description d-flex justify-content-between align-items-center">
                                        <div>
                                            <h4>{{inc.service.title}}</h4>
                                            <p>Duration: 1hr 30Mins</p>
                                        </div>
                                        <div class="d-flex flex-column align-items-end">
                                            <p>Quantity : {{inc.quantity}}</p>
                                            <p v-if="inc.quantity > 1">Price : {{deal.business.country.currency}} {{inc.price | currency}}</p>
                                            <ins>{{deal.business.country.currency}} {{inc.quantity * inc.price | currency}}</ins>
                                        </div>
                                    </div>
                                </div>
                                <div class="w-100 description" v-if="!inc_have_services && idx == 0" :key="idx" style="text-align:center;">
                                    <img src="/images/not-found.png" alt="Not Found" style="max-width:120px;margin-bottom:20px"/>
                                    <p>There are no Services in this deal.</p>
                                </div>
                            </template>
                        </b-col>
                        <b-col md="6" class="pb-0 dp-col">
                            <div>
                            <h3>Products</h3>
                            </div>
                            <template v-for="(inc,idx) in deal.inclusions">
                                <div v-if="inc.product" :key="'p-'+idx" class="d-flex align-items-start description-list ">
                                    <div class="w-100 description d-flex justify-content-between align-items-center">
                                        <div>
                                            <h4>{{inc.product.name}}</h4>
                                            <p>{{inc.product.description}}</p>
                                        </div>
                                        <div class="d-flex flex-column align-items-end">
                                            <p>Quantity : {{inc.quantity}}</p>
                                            <p v-if="inc.quantity > 1">Price : {{deal.business.country.currency}} {{inc.price | currency}}</p>
                                            <ins>{{deal.business.country.currency}} {{inc.quantity * inc.price | currency}}</ins>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="w-100 description" v-if="!inc_have_products && idx == 0" :key="idx" style="text-align:center;">
                                    <!-- <img src="/images/not-found.png" alt="Not Found" style="max-width:120px;margin-bottom:20px"/> -->
                                    <p>Non Included</p>
                                </div>
                            </template>
                        </b-col>
                    </b-row>
                    <div class="pt-3 pb-2" v-if="deal.business">
                        <div v-if="deal.business.description">
                            <h3>About {{deal.business.name}}</h3>
                            <p>{{deal.business.description}}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="related-deals deals-sec">
                <div class="container">
                    <h2>Similar Deals to Consider</h2>    
                </div>
                <DealsListTemplate :slider="true" :data="similarDeals" :loader="deals_loader"/>
                <nuxt-link to="/deals" class="va-btn" v-if="$screen.width >= 768">View All</nuxt-link>
            </div>
        </div>
    </b-overlay>
</template>
<script>
export default {
    data() {
        return {
            similarDeals: [],
            deal:null,
            deals_loader: true,
            business_id: null,
            purchaseable: true,
            inc_have_products: false,
            inc_have_services: false,
        }
    },
    created: function(){
        this.get_deal_by_id();
    },
    methods: {
        get_deal_by_id: function (){
            this.$axios.get('deals/'+this.$route.params.id)
            .then(res => {
                this.purchaseable = res.data.purchase;
                this.deal = res.data.deal;
                this.business_id = res.data.deal.business.id;
                this.get_similar_deals();


                res.data.deal.inclusions.forEach(res => {
                    if(res.product && !this.inc_have_products){
                        this.inc_have_products = true;
                    }
                    if(res.service && !this.inc_have_services){
                        this.inc_have_services = true;
                    }
                });
                
                let business_expire_date = res.data.deal.business.subscription_expires_at;
                let current_date = new Date();    
                if (current_date > business_expire_date) {    
                    this.purchaseable = false;
                } 
                
            })
            .catch(err => {
                if(err.response.status == 404){
                    this.$router.push({path: '/'});
                    this.errorToast("This deal is not active any more in servU please search for another one.", {title: "Not Found"})
                }
            });
        },
        get_similar_deals: function(){
            this.$axios.get('deals?business_id='+this.business_id)
            .then(res => {
                this.similarDeals = res.data;
                this.deals_loader = false
            })
        },
        
    }
}
</script>

<style lang="scss" scoped>
::v-deep .offline-overlay{
    height: 100%;
    .b-overlay{
        & > div{
            top:0 !important;
            left: 0 !important;
            right: 0 !important;
            transform:none !important;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            @media(max-width:520px){
                h2{
                    font-size: 1.2rem;
                }
                p{
                    font-size: 12px;
                }
            }
        } 
    }
}
.deals-detail {
    border: none;
    box-shadow: none;
    margin-top: 20px;
    padding: 0 15px;
    @media (max-width:767px) {
        margin-top: 0;
        padding: 0;
    }
    .detail-text {
        width: 43%;
        background-color: #FAFAFA;
        display: flex;
        align-items: center;
        padding: 15px 0;
        @media (max-width:767px) {
            width: 100%;
            background-color: white;
            order: 1;
            padding: 0 15px;
        }
        .card-text {
            width: 100%;
            @media (max-width:767px) {
                padding: 20px 0 0 !important;
            }
            h2 {
                font-size: 50px;
                line-height: 59px;
                color: #000000;
                font-weight: 800;
                margin-bottom: 20px;
                max-height: 120px;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                @media (max-width:1024px) {
                    font-size: 35px;
                    line-height: 42px;
                }
                @media (max-width:767px) {
                    font-size: 20px;
                    margin-bottom: 5px;
                    line-height: 25px;
                }
            }
            ins {
                color: rgba(0, 0, 0, 0.8);
                display: block;
                font-size: 28px;
                font-weight: 800;
                text-decoration: none;
                line-height: 36px;
                margin-bottom: 20px;
                @media (max-width:767px) {
                    font-size: 13px;
                    margin-bottom: 5px;
                    display: initial;
                }
            }
            del {
                font-size: 18px;
                color: rgba(0, 0, 0, 0.3);
                line-height: 23px;
                padding-right: 10px;
                font-weight: 700;
                @media (max-width:767px) {
                    font-size: 12px;
                }
            }
            .off {
                color: rgba(0, 0, 0, 0.5);
                font-size: 14px;
                line-height: 18px;
                font-weight: 700;
                background-color: rgba(12, 86, 201, 0.15);
                padding:5px 25px;
                border-radius: 3px;
                width: 68px;
                margin-top: 10px;
                text-align: center;
                @media (max-width:767px) {
                    font-size: 10px;
                }
            }
            p {
                font-size: 1.7vw;
                color: rgba(38, 57, 87, 0.7);
                font-weight: 800;
                margin-top: 1vw;
                @media (max-width:767px) {
                    font-size: 13px;
                }
                span {
                    color: rgba(38, 57, 87, 0.7);
                    font-size: 1.2vw;
                    font-weight: 600;
                    @media (max-width:767px) {
                        font-size: 12px;
                    }
                }
            }
            a {
                background-color: #0C56C9;
                width: 100%;
                font-size: 18px;
                line-height: 28px;
                margin-top: 45px;
                height: 52px;
                border: none;
                font-weight: 800;
                @media (max-width:767px) {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    z-index: 9;
                    width: 95%;
                    right: 0;
                    margin: auto;
                    margin-bottom: 10px;
                    // box-shadow: 0 10px 10px -5px rgb(0 0 0 / 70%);
                    padding: 10px;
                }
            }
        }
    }
    .detail-img {
        width: 55%;
        margin-left: 2%;
        max-height: 354px;
        overflow: hidden;
        @media (max-width:767px) {
            width: 100%;
            margin-left: 0;
        }
        img {
            height: 100%;
            object-fit: cover;
        }
    }
}
.about-detail {
    border: none;
    box-shadow: none;
    display: flex;
    flex-wrap: wrap;
    padding: 30px 15px 0px;
    @media (max-width:767px) {
        padding-top: 0;
        padding-bottom: 0;
    }
    .card-body {
        padding: 0;
        display: flex;
        flex-wrap: wrap;
    }
    h3 {
        color: #000000;
        font-size: 30px;
        font-weight: 800;
        margin-bottom: 20px;
        line-height: 35px;
        @media (max-width:1024px) {
            font-size: 25px;
        }
        @media (max-width:767px) {
            font-size: 20px;
            padding-top: 18px;
            margin-bottom: 10px;
        }
    }
    p  {
        color: #000000;
        line-height: 28px;
        font-size: 17px;
        font-weight: 400;
        margin-bottom: 40px;
        @media (max-width:767px) {
            font-size: 12px;
            line-height: 20px;
            margin-bottom: 25px;
        }
    }
    .description-row {
        @media (max-width:767px) {
            margin-top: 0 !important;
        }
        h3 {
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            padding-bottom: 18px;
        }
        .ds-col{
            padding-right: 50px;
            @media (max-width:767px) {
                padding-right: 15px;
            }
        }
        .dp-col {
            padding-left: 50px;
            @media (max-width:767px) {
                padding-left: 15px;
            }
        }   
        .description-list {
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            padding-bottom: 18px;
            margin-bottom: 18px;
        }
        .c-icon{
            width: 80px;
            height: 70px;
            background: #f3f6fc;
            border-radius: 10px;
            margin-right: 10px;
            padding: 0;
            svg{
                color: #263957;
            }
        }
        .description {
            h4{
                font-size: 20px;
                line-height: 28px;
                color: #000000;
                font-weight: 700;
                margin-bottom: 5px;
                text-transform: capitalize;
                @media (max-width:767px) {
                    font-size: 15px;
                    margin-bottom: 5px;
                    line-height: 18px;
                }
            }
            ins {
                font-size: 20px;
                color: #000000;
                font-weight: 700;
                line-height: 28px;
                text-decoration: none;
                @media (max-width:767px) {
                    font-size: 15px;
                }
            }
            p {
                color: #000000;
                font-size: 13px;
                line-height: 21px;
                font-weight: 400;
                margin-bottom: 0;
                @media (max-width:767px) {
                    font-size: 12px;
                }
            }
        }
    }
}
.related-deals {
    .deals {
        margin-bottom: 0;
    }  
}

</style>