<template>
    <div class="flex-grow-1" ref="searchWrap">
        <div class="search-field-wrap" ref="search_input">
            <span class="close-search" @click="close($event)">Cancel</span>
            <b-form class="search-form d-flex flex-wrap" @submit.prevent="">
                <b-icon-search />
                <b-form-input 
                name="search" 
                @keydown.enter.prevent="" 
                class="search-field w-100 "
                placeholder="Search ServU" 
                v-model="search"
                @click="fetchTreatment()"
                :id="homebanner ? 'homeBannerSearch' : 'searchTopField'"
                @keyup="filterResults(search)">
                </b-form-input>
            </b-form>
            <div class="suggestions w-100 position-absolute bg-white" v-if="show == true">
                <div class="close-wrap" @click="hideSuggestions"></div>
                <b-overlay :show="search_loader" class="inner-sug" variant="transparent">
                    <div class="d-flex flex-wrap border-bottom" v-if="!search_loader">
                        <template v-if="filterBusinessTypes.length > 0">
                            <div class="p-2 d-flex flex-wrap w-100" >
                                <nuxt-link :to="'/search?business='+data.icon" v-for="(data,idx) in filterBusinessTypes" :key="idx">
                                    <b-button @click="hideSuggestions" pill variant="btn btn-outline-dark" class="m-1 d-flex justify-content-center align-items-center search-opt-btn">
                                        {{data.title}}
                                    </b-button>
                                </nuxt-link>
                            </div>
                        </template>
                        <template v-if="filterdeals.length > 0">
                            <h2 class="w-100 mt-3 mb-2">Deals</h2>
                            <template v-for="(deal,idx) in filterdeals">
                                <div v-if="idx < 5" :key="'d-'+idx" class="col-sm-6">
                                    <nuxt-link :to="{path: '/deals/'+deal.slug}" class="deal pl-3 pr-3 w-100 cursor-pointer d-flex">
                                        <div class="d-flex flex-column flex-grow-0 branch-img mr-1">
                                            <div class="inner" :style="'background-image:url('+deal.profile_image+');'">
                                            </div>
                                        </div>
                                        <div class="apt-detail">
                                            <p class="branch-name">{{deal.name}}</p>
                                            <p class="services-short-name">{{deal.description}}</p>
                                        </div>
                                    </nuxt-link>
                                </div>
                            </template>
                        </template>
                        <template v-if="filterTreatmentTypes.length > 0">
                            <h2 class="w-100 mt-3 mb-2">Treatments</h2>
                            <div class="d-flex flex-wrap ">
                                <template v-for="(data,idx) in filterTreatmentTypes">
                                    <nuxt-link :to="'/search?typeId='+data.value+'&tName='+data.text" v-if="idx <= 5" :key="'t-'+idx" class="treatment pl-3 pr-3 w-100 cursor-pointer d-flex">
                                        <div class="d-flex flex-column flex-grow-0 branch-img mr-1">
                                            <div class="inner d-flex align-items-center justify-content-center">
                                                <b-icon-search font-scale="1.5" style="color:rgba(38, 57, 87, 0.75);font-size:18px;"/>
                                            </div>
                                        </div>
                                        <div class="apt-detail">
                                            <p class="branch-name">{{data.text}}</p>
                                        </div>
                                    </nuxt-link>
                                </template>
                            </div>
                        </template>
                        <template v-if="filterBranch.length > 0">
                            <h2 class="w-100 mt-3 mb-2">Venues</h2>
                            <template v-for="(data,idx) in filterBranch">
                                <div v-if="idx < 5" :key="'b-'+idx" class="col-sm-6">
                                    <nuxt-link :to="'/b/'+data.slug" class="branch w-100 cursor-pointer d-flex">
                                        <div class="d-flex flex-column flex-grow-0 branch-img mr-1">
                                            <div class="inner" :style="'background-image:url('+data.profile_image+');'">
                                            </div>
                                        </div>
                                        <div class="apt-detail">
                                            <p class="branch-name">{{data.name}}</p>
                                            <p class="services-short-name">{{data.address}}</p>
                                        </div>
                                    </nuxt-link>
                                </div>
                            </template>
                        </template>
                    </div>
                    <div v-if="not_found && !search_loader" class="d-flex flex-column justify-content-center align-items-center">
                        <img src="/images/not-found.png" alt="Not Found" class="mt-4 mb-4" style="max-width:180px;">
                        <h3>No Search Result found</h3> 
                    </div>
                </b-overlay>
            </div>
        </div>
        <div class="current-address">
            <div class="w-100 location d-flex align-items-center">
                <HeaderCountryCityForm showLabels="label-sr-only" :searchRef="$refs"/>
            </div>
        </div>
    </div>
</template>
<script>

export default {
    props:{
        homebanner: {
            type: Boolean,
            default: false
        }
    },
    data(){
        return {
            businessTypes: [],
            filterBusinessTypes: [],
            treatmentTypes: [],
            filterTreatmentTypes: [],
            branch: [],
            filterBranch: [],
            deals: [],
            filterdeals: [],
            search: '',
            show: false,
            search_loader: true,
            not_found: false,
            form: {
                business: this.$route.query.business ? this.$route.query.business : '',
                typeId: this.$route.query.typeId ? this.$route.query.typeId : '',
                country_id: this.$auth.$storage.getLocalStorage("user_country"),
                city_id: this.$auth.$storage.getLocalStorage("user_city"),
            },
        }
    },
    created: function (){
        if(this.$route.query.business){
            this.search = this.$route.query.business;
        }
    },
    watch:{
        $route:function(to,from){
            setTimeout(() => {
                this.hideSuggestions();
            }, 200);
        }
    },
    methods: {
        async logout() {
            this.$auth.logout();
        },
        async fetchTreatment() {
            this.$refs.search_input.classList.add('active');

            if(this.$screen.width < 768){
                this.filterResults('')
            }
            if(this.homebanner){
                window.scrollTo({
                    top: 450,
                    left: 0,
                    behavior: 'smooth'
                });
                
                document.getElementById('searchTopField').click()
            }else{
                this.show = true
            }
            
            if(this.businessTypes.length == 0){
                
                
                let bTypes = await this.$axios.get('utilities/business-types',{genericApi: true});

                this.businessTypes = this.filterBusinessTypes = bTypes.data;
                
                let tTypes = await this.$axios.get('utilities/treatment-types',{genericApi: true});
         
                this.treatmentTypes = tTypes.data;

                this.filterTreatmentTypes = [];

                this.treatmentTypes.forEach(res => {
                    res.options.forEach(data => {
                        this.filterTreatmentTypes.push(data);
                    })
                });

                this.treatmentTypes = this.filterTreatmentTypes;
                /*Fetch Deals*/

                    let searchDeals = await this.$axios.get('deals?limit=5');
    
                    this.deals = this.filterdeals = searchDeals.data;
                

                let branch = await this.$axios.get('/branch/all',{params: this.form});
                
                this.branch = branch.data;
                
            }
            this.search_loader = false
        },
        async filterResults(value){
            value = value.toLowerCase()
            this.$refs['searchWrap'].classList.add('search-wrap');
            
            this.filterBusinessTypes = this.businessTypes.filter(res => {
                let label = res.icon
                if(label.includes(value)){
                    return res;
                }
            });

            this.filterdeals = this.deals.filter(res => {
                let label = res.name.toLowerCase();
                if(label.includes(value)){
                    return res;
                }
            });
            
            if(this.search == ''){
                this.filterBranch = [];
                this.filterTreatmentTypes = [];
                
            }else{
                this.filterTreatmentTypes = this.treatmentTypes;

                this.filterTreatmentTypes = this.filterTreatmentTypes.filter(res => {
                    let tmp_opt = res.text.toLowerCase();
                    if(tmp_opt.includes(value)){
                        return res;
                    }
                });

                this.filterBranch = this.branch.filter(br => {
                let name = br.name.toLowerCase();
                    if(name.includes(value)){
                        return br;
                    } 
                })
            }
            if(this.filterBusinessTypes.length == 0 && this.filterTreatmentTypes.length == 0 && this.filterBranch.length == 0 && this.filterdeals.length == 0){
                this.not_found = true
            }else{
                this.not_found = false
            }
            this.show = true;
            window.scrollTo({ top: 0, behavior: 'smooth' })
        },
        async hideSuggestions(){
            this.show = false;
            this.$refs.search_input.classList.remove('active');
        },
        async close(){
            this.search = '';
            this.$refs['searchWrap'].classList.remove('search-wrap');
        }
    }
}
</script>
<style lang="scss" scoped>
.search-field-wrap {
    flex-basis: 487px;
    transition: flex-basis 400ms ease 0s;
    align-items: flex-start;
    .search-form{
        .search-field{
            border:1px solid rgb(213, 215, 218);
        }
    }
    &.active{
        .search-form{
            svg{
                z-index: 999999;
            }
            .search-field{
                z-index: 99999;
                background: #FFF;
            }
        }
    }
}
.current-address {
    flex-basis: 400px;
}
.suggestions{
    z-index: 9999;
    max-height: calc(100vh - 112px);
    border: none;
    border-radius: 5px;
    overflow: auto;
    transition: all 500ms ease .5s;
    box-shadow: 0px 4px 30px rgb(0 0 0 / 10%);
    margin-top: 10px;
    .inner-sug{
        position: relative;
        min-height: 400px;
        z-index: 1;
        background: #FFF;
    }
    .close-wrap{
        width:100vw;height: 100vh;position: fixed;top: 0;left: 0;
        // background: rgba(0,0,0,0.3);
    }
    .flex-wrap{

        .col-sm-6{
                padding-left: 0;
        }

    }
    .apt-detail {
        .branch-name {
            color: rgba(38, 57, 87, 0.75);
            font-size: 14px;
            font-weight: 700;
            line-height: 18px;
        }
        .services-short-name {
            font-size: 12.5px;
            line-height: 16px;
            color: rgba(38, 57, 87, 0.5);
            font-weight: 600;
        }
    }
    h2{
        font-weight: 700;
        font-size: 18px;
        color: #263957;
        line-height: 23px;
        border-top: 1px solid rgba(38, 57, 87, 0.15);
        padding-top: 25px;
        margin: 0 15px 0 !important;
    }
    .p-2{
            padding-bottom: 0 !important;
    }
    a {
        margin-bottom: 0.4vw;
    }
    .search-opt-btn{
        padding: 0 1vw 0;
        height: 31px;
        font-size: 12.5px;
        overflow: hidden;
        color: rgba(38, 57, 87, 0.6);
        border: 1px solid rgba(38, 57, 87, 0.4);
        line-height: 16px;
        font-weight: 700;
        margin: 0 6px;
        border-radius: 21px !important;
        &:hover {
            background-color: white;
        }
        &:focus {
            box-shadow: none !important;
        }
        @media (max-width:767px) {
            padding: 0 16px 0;
            height: 28px;
            font-size: 12px;
            overflow: hidden;
        }
        .icon{
            max-width: 12vw;
            margin-right: 2vw;
            object-fit: cover;
            transition: 0.3s ease filter;
            height: 100%;
        }
        &:hover{
            .icon{
                -webkit-filter: brightness(30) contrast(20);
                filter: brightness(30) contrast(20);
                transition: 0.3s ease filter;
            }
            }
    }
    .branch,.deal,.treatment{
        &:hover{
            background: white;
        }
    }
    .treatment{
        .branch-img{
            .inner{
                height: 16px;
                width: 23px;
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                svg {
                    top: 4px;
                    position: relative;
                    width: 14px;
                    height: 13px;
                }
            }
        } 
    }
}
.branch-img .inner .bi-search {font-size: 18px !important;}
.inner-page-header{
    .current-address{
        @media (max-width: 768px) {
            display: none;
        }
    }
}
</style>