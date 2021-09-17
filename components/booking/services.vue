<template>
    <b-overlay :show="loader" variant="transparent" class="loader-height-wrap">
    <div v-if="$store.state.business.list" class="services-list">
        <VueSlickCarousel  @afterChange="handleAftereChange" :variableWidth="true"  :arrows="true" :focusOnSelect="true" :infinite="false" :dots="false" v-if="categories" class="categories-list has-sticky">
            <template #prevArrow="arrowOption">
                <div class="custom-arrow">
                    <b-icon-arrow-left />
                </div>
            </template>
            <template v-for="(category,cat_idx) in categories">
                <div v-if="category.services.length" :key="cat_idx" v-scroll-to="{el: '#element-'+cat_idx,offset: -230}" class="cat-slide">
                    <p class="sl-cat-title" :class="{active : category.id == selected}">{{category.title}}</p>
                </div>
            </template>
            <template #nextArrow="arrowOption">
                <div class="custom-arrow">
                    <b-icon-arrow-right font-scale="1.2"/>
                </div>
            </template>
        </VueSlickCarousel>
        <div class="service-list w-100">
            <template v-for="(category,idx) in categories">
                <div :id="'element-'+idx" class="services p-0 border-bottom-0 scrollElem" :key="idx" v-if="category.services.length">
                    <h2 class="mt-5 mb-4">{{category.title}}</h2>
                    <ul class="main-list">
                        <template v-for="(service,serv_idx) in category.services">
                            <li :key="serv_idx" class="d-flex align-items-center flex-wrap" v-if="service.enable_online_booking">
                                <template v-if="service.pricings.length > 1">
                                    <b-icon-three-dots v-b-toggle="'collapse-'+idx" class="cursor-pointer"/>
                                    <p class="service-title cursor-pointer m-0">{{service.title}}</p>
                                    <b-collapse :id="'collapse-'+idx" v-if="service.pricings.length > 1" class="w-100" animation="slide-next">
                                            <ul class="pl-5 inner-list">
                                                <template v-for="(price, idx) in service.pricings">
                                                    <li :key="idx" class="services-inner">
                                                        <div @click="getSelectedService(service.id,idx)" class="d-flex align-items-center text-dark">
                                                            <b-icon-check2 class="cursor-pointer p-1 bg-primary text-white" v-if="service.selected && idx == service.priceIdx"/>
                                                            <b-icon-blank class="cursor-pointer" v-else/>
                                                            <div class="mb-0 flex-grow-1 d-flex justify-content-between align-items-center changeDirInMob">
                                                                <p class="title cursor-pointer m-0">{{price.name}}</p>
                                                                <div class="d-flex flex-column align-items-end flex-bs-95">
                                                                    <div class="font-weight-bold">
                                                                        <span v-if="+price.special_price"> {{$store.state.business.list.country.currency}} {{price.special_price | currency}}</span>
                                                                        <span v-else> {{$store.state.business.list.country.currency}} {{price.price | currency}}</span>
                                                                    </div>
                                                                    <del v-if="+price.special_price">{{$store.state.business.list.country.currency}} {{price.price | currency}}</del>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </template>
                                            </ul>
                                    </b-collapse>
                                </template>
                                <div @click="getSelectedService(service.id)" v-else class="d-flex align-items-center m-0 flex-grow-1">
                                    <b-icon-check2 class="cursor-pointer p-1 bg-primary text-white" v-if="service.selected"/>
                                    <b-icon-blank class="cursor-pointer" v-else/>
                                    <div class="mb-0 flex-grow-1 d-flex justify-content-between align-items-center">
                                        <p class="title cursor-pointer m-0">{{service.title}}</p>
                                        <div class="d-flex flex-column align-items-end flex-bs-95">
                                            <div class="font-weight-bold">
                                                <span v-if="+service.pricings[0].special_price"> {{$store.state.business.list.country.currency}} {{service.pricings[0].special_price | currency}}</span>
                                                <span v-else> {{$store.state.business.list.country.currency}} {{service.pricings[0].price | currency}}</span>
                                            </div>
                                            <del v-if="+service.pricings[0].special_price">{{$store.state.business.list.country.currency}} {{service.pricings[0].price | currency}}</del>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </template>
                    </ul>
                </div>
            </template>
        </div>
    </div>
    </b-overlay>
</template>
<script>
    export default {
        props: {
            showCategory: {
                default: true
            }
        },
        data: function () {
            return {
                loader: true,
                business: null,
                branch: null,
                categories: null,
                selected: undefined,
                cart:{
                    data: [],
                    total: 0
                },
                form: {
                    business_id: null,
                    country_id: this.$auth.$storage.getLocalStorage("user_country"),
                    city_id: this.$auth.$storage.getLocalStorage("user_city"),
                    branch_slug: null,
                    'with-timings':1,
                    'with-staff':1,
                }
            }
        },
        created: function() {
            this.getServicesData(this.$route.params.branch_slug);
        },
        mounted: function(){
            const context = this
            this.$root.$on('removedCartItem', function(cart){
                context.$store.commit('checkout/cart/remove',cart);
                let new_cart = this.$store.state.checkout.cart.data;
                context.$auth.$storage.setLocalStorage('cart',new_cart);
                context.selectDeselectService(new_cart);           
            })
        },
        methods: {
            getServicesData: function (branch_slug){
                this.form.branch_slug = branch_slug;

                this.$axios.get('/services',{params: this.form})
                .then(res => {
                    if(!res.data.data){
                        this.$router.push({name:'b-branch_slug'})
                    }
                    this.$auth.$storage.setLocalStorage("business",res.data.branch.business);
                    this.$auth.$storage.setLocalStorage("branch",res.data.branch);
                    this.$auth.$storage.setLocalStorage("settings",res.data.settings);
                    
                    this.getStoreItemFromLocalStorage();
                    
                    this.business = res.data.branch.business;
                    this.branch = res.data.branch;
                    this.categories = res.data.data;
    
                    this.loader = false
                    
                    
                    let cart = this.$auth.$storage.getLocalStorage("cart");
                    if(cart && cart.length > 0){
                        this.selectDeselectService(cart)
                    }else{
                        this.getSelectedService(this.$route.query.service_id,this.$route.query.pindex);
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            getSelectedService: function(service_id,pindex = 0){
                    let tmp_cat = this.categories.filter(cat => {
                        cat.services = cat.services.filter(ser => {
                            if (ser.id == service_id) {
                                if(!this.checkCartItemExist(service_id,pindex)){
                                    ser.selected = true;
                                    ser.priceIdx = +pindex;
                                    this.addToCart(ser,pindex)
                                }else{
                                    ser.selected = false;
                                    ser.priceIdx = 0;
                                }
                                
                            }
                            return ser;
                        });
                        return cat;
                    });
                    
                    this.categories = tmp_cat;
            },
            async addToCart(item,pindex = 0){
                
                    this.cart.data = this.cart.data.filter(d => d.service_id !== item.id);
                    let cart_tmp = {
                        quantity: 1,
                        price: item.pricings[pindex].price,
                        special_price: item.pricings[pindex].special_price,
                        discount_price: 0,
                        tax: item.branches[0].tax,
                        duration: item.pricings[pindex].duration,
                        text: item.title,
                        pricing_name: item.pricings[pindex].name,
                        price_type: item.pricings[pindex].price_type,
                        service_id: item.id,
                        priceIdx: pindex,
                        available_for: item.available_for,
                        hasMultiplePricings: false
                    };

                    if(item.pricings.length > 1){
                        cart_tmp.hasMultiplePricings = true;
                    }

                    this.cart.data.push(cart_tmp);

                    this.$store.commit('checkout/cart/add',this.cart.data);

                    this.$auth.$storage.setLocalStorage("cart",this.cart.data);
            },
            checkCartItemExist: function(id,pindex){
                let match = false;
                let cart_data = this.$store.state.checkout.cart.data;
                // let cart_data = this.$auth.$storage.getLocalStorage("cart");
                
                if(cart_data){
                    let storeCart = cart_data;
                    storeCart = storeCart.filter(cart => {
                        if(id == cart.service_id && cart_data.length){
                            if(cart.priceIdx == pindex){
                                match = true;
                                this.$store.commit('checkout/cart/remove',cart);
                                return false;
                            }
                        }
                        return cart;
                    });
                    this.$auth.$storage.setLocalStorage("cart",storeCart);
                    this.cart.data = cart_data;
                }
                
                return match;
            },
           /* handleBeforeChange: function(event, slick, currentSlide) {
                let titles = document.querySelectorAll(".sl-cat-title");
                if(titles && titles.length > 0){
                    titles.forEach((ele, id) => {
                        ele.classList.remove('active')
                        if(id == slick){
                            ele.click()
                        }
                    });
                }
            },*/

            handleAftereChange: function(index) {
                var element =  document.querySelectorAll('.scrollElem')[index];
                var top = element.offsetTop;
                window.scrollTo({ top: top - 100, behavior: 'smooth' })
            },
            selectDeselectService: function(cart){

                let tmp_cat = this.categories.filter(cat => {
                    cat.services = cat.services.filter(ser => {
                        ser.selected = false
                        cart.forEach(res => {
                            if (ser.id == res.service_id) {
                                ser.selected = true;
                                ser.priceIdx = +res.priceIdx;
                            }
                        });
                        return ser;
                    });
                    return cat;
                })

                this.categories = tmp_cat;
            }
        }
    }
</script>
<style lang="scss" scoped>
.loader-height-wrap{
    min-height: 50vh;
}
.flex-bs-95{
    flex-basis: 95px;
}
@media(max-width:767px){
    .changeDirInMob{
        flex-direction: column;
        align-items: flex-start !important;
        .align-items-end{
            align-items: flex-start !important;
        }
        .flex-bs-95{
            flex-basis: 0;
        }
    }
}
</style>
