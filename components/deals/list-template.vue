<template>
    <div class="deals">
        <b-overlay :show="loader" rounded class="loader" variant="transparent">
            <div class="deal-row" v-if="!loader">
                <VueSlickCarousel ref="slick" v-bind="settings" v-if="deals.length > 0" class="row">
                    <div :class="'deals-col '+ (!slider ? 'col-sm-3': '') " v-for="(deal,idx) in deals" :key="idx">
                        <div class="deals-img">
                            <nuxt-link :to="{path: '/deals/'+deal.slug }">
                                <img :src="deal.profile_image" alt="deals">
                            </nuxt-link>
                        </div>
                        <div class="deals-text">
                            <h3>
                                <nuxt-link :to="{path: '/deals/'+deal.slug }">
                                    {{deal.name}}
                                </nuxt-link>
                            </h3>
                            <!-- <div class="rating">
                                <p class="star">4.3</p>
                                <p>- Willesden Lane</p>
                            </div> -->
                            <p class="description">{{deal.description}}</p>
                            <div class="price" >
                                <del>{{deal.business.country.currency}} {{totalInclusionsPrice(deal) | currency}}</del>
                                <ins> {{deal.business.country.currency}}{{deal.price | currency}}/-</ins>
                                <p class="off">{{calculateOffInDeal(totalInclusionsPrice(deal),deal.price)}}</p>
                            </div>
                            
                        </div>
                    </div>
                </VueSlickCarousel>
            </div>
            <div v-else>
                <div v-if="!loader" class="d-flex flex-column justify-content-center align-items-center">
                    <img src="/images/not-found.png" alt="Not Found" class="mt-4 mb-4" style="max-width:180px;">
                    <h3>No Deals found</h3> 
                </div>
            </div>
        </b-overlay>
    </div>
</template>
<script>
export default {
    props: {
        slider: {
            type: Boolean,
            default: false
        },
        data: {
            type: Array,
            default: []
        },
        loader: {
           type: Boolean,
            default: true 
        }
    },
    data() {
      return {
        settings: {
            slidesToScroll: 4,
            infinte: false,
            variableWidth: true,
            // centerMode: true,
            // draggable: false,
            "responsive": [
                {
                "breakpoint": 40960,
                "settings": {
                    // slidesToShow: 6,
                    slidesToScroll: 4,
                    }
                },
                // {
                // "breakpoint": 2420,
                // "settings": {
                //     slidesToShow: 5,
                //     slidesToScroll: 5,
                //     }
                // },
                {
                "breakpoint": 1280,
                "settings": {
                    // slidesToShow: 4,
                    slidesToScroll: 4,
                    }
                },
                {
                "breakpoint": 1025,
                "settings": {
                    // slidesToShow: 3,
                    slidesToScroll: 3,
                    }
                },
                {
                "breakpoint": 767,
                "settings": {
                    // slidesToShow: 2,
                    slidesToScroll: 2,
                }
                },
                {
                "breakpoint": 480,
                "settings": {
                    // slidesToShow: 1,
                    slidesToScroll: 1
                    
                }
                }
            ]
        }
      }
    },
    computed:{
        deals: function(){
            let deals = this.data;
            return deals;
        }
    },
    created: function(){
        if(!this.slider){
            this.settings.responsive.forEach(res => {
                if(res.breakpoint <= 40960){
                    res.settings = "unslick"
                }
            });
        }
    },
}
</script>
<style lang="scss" scoped>

</style>