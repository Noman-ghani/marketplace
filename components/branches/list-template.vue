<template>
    <div class="deals">
        <b-overlay :show="loader" rounded class="loader" variant="transparent">
            <div class="deal-row" v-if="!loader">
                <VueSlickCarousel v-bind="settings" class="row" v-if="branches.length > 0">
                    <div :class="'deals-col '+ (!slider ? 'col-sm-3': '') " v-for="(branch,idx) in branches" :key="idx">
                        <div class="deals-img">
                            <nuxt-link :to="'/b/'+branch.slug">
                                <img :src="branch.profile_image" alt="deals">
                            </nuxt-link>
                        </div>
                        <div class="deals-text d-flex flex-column justify-content-center">
                            <h3>
                                <nuxt-link :to="'/b/'+branch.slug">
                                    {{branch.name}}
                                </nuxt-link>
                            </h3>   
                            <p class="description">{{branch.address}} <span v-if="branch.state">, {{branch.state.name}}</span>  <span v-if="branch.city">, {{branch.city.name}}</span></p>
                            <ul class="business-types d-flex flex-wrap">
                            <li v-if="branch.business_type_1" class="type btn btn-outline-primary">
                                <nuxt-link :to="'/search?business='+branch.business_type_1">
                                    {{branch.business_type_1.replace('-', ' ')}}
                                </nuxt-link>
                            </li>  
                            <li v-if="branch.business_type_2" class="type btn btn-outline-primary">
                                <nuxt-link :to="'/search?business='+branch.business_type_2">
                                    {{branch.business_type_2.replace('-', ' ')}}
                                </nuxt-link>
                            </li>  
                            <li v-if="branch.business_type_3" class="type btn btn-outline-primary">
                                <nuxt-link :to="'/search?business='+branch.business_type_3">
                                    {{branch.business_type_3.replace('-', ' ')}}
                                </nuxt-link>
                            </li>  
                            </ul>
                            
                        </div>
                    </div>
                </VueSlickCarousel>
            </div>
            <div v-else>
                <div v-if="!loader" class="d-flex flex-column justify-content-center align-items-center">
                    <img src="/images/not-found.png" alt="Not Found" class="mt-4 mb-4" style="max-width:180px;">
                    <h3>No Branches found</h3> 
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
            // adaptiveHeight: true,
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
                //     // slidesToShow: 5,
                //     slidesToScroll: 5,
                //     }
                // },
                {
                "breakpoint": 1280,
                "settings": {
                    // slidesToShow: 4,
                    slidesToScroll: 3,
                    }
                },
                {
                "breakpoint": 1024,
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
        branches: function(){
            let branches = this.data;
            return branches;
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
    }
}
</script>
<style lang="scss" scoped>
// .deals-img{
//     @media (max-width:767px) {
//         max-width: 32vw;
//     }
//     margin-right: 4vw;

//     a {
//         @media (max-width:500px) {
//             height: 100px !important;
//         }
//     }
// }
.business-types{
    .type{
        padding: 3px 5px;
        margin-right: 5px;
        margin-bottom: 5px;
        border-color: #e6e5e5;
        border-radius: 3px;
        margin-top: 0;
        line-height: 0;
        text-transform: capitalize;
        // @media (max-width: 767px) {
        //     margin-right: 1vw;
        //     margin-bottom: 1vw;
        //     padding: 5px 10px 5px;
        // }
        // @media (max-width: 520px) {
        //     padding: 2px 5px 2px;
        // }
        &:last-child{
            margin-right:0;
        }
        &:hover {
            background-color: #0C56C9;
            border-color: transparent;
            a {
                color: white;
            }
        }
        a{
            font-size: 13px;
            padding: 0;
            font-weight: 600;
            line-height: 16px;
            color: #8c8f94;
            @media (max-width: 768px) {
                font-size: 12px;
            }
        }
    }
}
// .deals {
//     .deal-row {
//         .deals-col {
//             @media (max-width:980px) {
//                 flex: 0 0 33%;
//                 max-width: 33%;
//             }
//             @media (max-width:767px) {
//                 padding: 10px;
//                 display: flex !important;
//                 max-width: 100%;
//                 flex: 100%;
//             }
//         }
//     }
// }

</style>