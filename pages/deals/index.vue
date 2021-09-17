<template>
    <div class="deals-listing">
        <div class="container">
            <div class="heading pl-3 pr-3 mt-4 top d-flex align-items-center justify-content-between">
                <div class="flex-grow-0 deals-filter">
                    
                    <b-button variant="outline-dark" v-if="$screen.width <= 768" @click="showFilterBox">
                        Filter
                        <b-icon-chevron-down font-scale="1.1" />
                    </b-button>
                    <div id="filter-wrap" v-show="$screen.width > 768">
                        <div id="filter-header" class="d-flex" v-if="$screen.width <= 768">
                            <span @click="onReset()">Cancel</span>
                            <h2 class="flex-grow-1 text-center">Filter</h2>
                            <b-icon-x font-scale="2" @click="close()"/>
                        </div>
                        <div class="category-row">
                            <b-dropdown id="filter-category" block variant="transparent" no-caret>
                                <template #button-content >
                                    <span v-b-toggle.filter-category class="d-flex acc-title align-items-center justify-content-between">
                                        Category
                                        <b-icon-chevron-down font-scale="0.8"/>
                                    </span>
                                </template>
                                <b-dropdown-item @click="onReset">All</b-dropdown-item>
                                <template v-for="(category,index) in categories.data">
                                    <b-dropdown-form  
                                    :key="index"
                                    @mouseover="toogleItem(index)"
                                    @mouseout="toogleItem(index)"
                                    @click="toggleOnMobile(index)"
                                    >
                                        <span> 
                                            {{category.label}}
                                            <b-icon-chevron-down font-scale="0.8" v-if="category.options.length > 0"/>
                                        </span>
                                            <div v-if="category.options" class="sub-menu" v-show="category.showSubMenu">
                                                <template v-for="(opt,op_idx) in category.options">
                                                    <b-dropdown-item :key="'opt-'+op_idx" @click="sortFilterDeals(opt.value)">{{opt.text}}</b-dropdown-item>
                                                </template> 
                                            </div>
                                    </b-dropdown-form> 
                                </template>            
                            </b-dropdown>
                        </div>
                        <div class="price-row" v-if="this.pricelist.length && 1 == 2" hidden>
                            <div v-b-toggle.filter-price class="d-flex acc-title align-items-center justify-content-between">
                                <p class="m-0">Price</p>
                                <b-icon-chevron-down />
                            </div>
                            <b-collapse id="filter-price" accordion="my-accordion">
                                <ul class="main-ul">
                                    <li v-for="(price, idx) in pricelist" :key="'p-'+idx">
                                        <b-form-checkbox 
                                        v-model="form.filterPrice"
                                        @change="sortFilterDeals()" 
                                        :value="price.min+'-'+price.max">
                                            {{price.min}} to {{price.max}}
                                        </b-form-checkbox>
                                    </li>
                                </ul>
                            </b-collapse>
                        </div>
                    </div>
                </div>
                <div>
                    <h2 class="m-0 text-center" v-show="$screen.width >= 768">Deals</h2>
                </div>
                <div class="flex-grow-0 d-flex align-items-center justify-content-end deals-sort">
                    <p class="subtitle mb-0" v-if="deals.length">{{deals.length}} Deals</p>
                    <b-dropdown id="deal-sort-wrap" text="Sort" ref="sortdropdown" class="ml-2 mr-2">
                        
                        <b-dropdown-header id="sort-header" v-if="$screen.width <= 768">
                            <div class="d-flex align-items-center justify-content-between">
                                <a href="javascript:;" @click="onReset()" class="reset">Reset</a>
                                <div>
                                    <h3 class="flex-grow-1 text-center">Sort By</h3>
                                    <p class="deals-num" v-if="deals.length">{{deals.length}} Deals</p>
                                </div>
                                <a href="javascript:;" @click="sortPopup()" class="done">Done</a>
                            </div>
                        <b-dropdown-divider></b-dropdown-divider>
                        </b-dropdown-header>
                        <b-dropdown-form>
                            <b-form-radio v-model="form.selectedSort" @change="sortFilterDeals()" value="" class="pt-3 pb-3" size="lg">Default</b-form-radio>
                            <b-form-radio v-model="form.selectedSort" @change="sortFilterDeals()" value="lth" class="pt-3 pb-3" size="lg">Price: Low to High</b-form-radio>
                            <b-form-radio v-model="form.selectedSort" @change="sortFilterDeals()" value="htl" class="pt-3 pb-3" size="lg">Price: High to Low</b-form-radio>
                            <b-form-radio v-model="form.selectedSort" @change="sortFilterDeals()" value="recent" class="pt-3 pb-3" size="lg">Recent to Oldest</b-form-radio>
                            <b-form-radio v-model="form.selectedSort" @change="sortFilterDeals()" value="closesoon" class="pt-3 pb-3" size="lg">Deals Soon End</b-form-radio>
                        </b-dropdown-form>
                    </b-dropdown>
                    <div class="overlay" v-if="showPopup"></div>
                </div>
            </div>
        </div>
        <div class="p-3">
            <div class="container">
                <DealsListTemplate :data="deals" :loader="deals_loader"/>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            deals: [],
            deals_loader: true,
            categories: {
                data: [],
                loader: true,
            },
            pricelist: [],
            form:{
                category: "",
                selectedSort: "",
                filterPrice: []
            },
            isDropdown2Visible: false,
            showPopup: false
        }
    },
    mounted: function(){
        this.$root.$on('bv::dropdown::show', bvEvent => {
            this.showPopup = true
            if(bvEvent.componentId === 'filter-category') {
                this.isDropdown2Visible = true;
            }
        })
        this.$root.$on('bv::dropdown::hide', bvEvent => {
            this.showPopup = false
            
            if(bvEvent.componentId === 'filter-category') {
                this.isDropdown2Visible = false;
            }
            if(this.isDropdown2Visible) {
                bvEvent.preventDefault()
            }
            
        })
       

        this.filterPIceList();
        this.sortFilterDeals();
        this.gettreatmentTypes();
    },
    watch:{
        'categories.data': function(val){
            this.categories.data = val;
        }
    },
    methods:{
        toogleItem(index){
            if(this.categories.data[index].options && this.$screen.width >= 768){
                if(!this.categories.data[index].showSubMenu){
                    this.categories.data[index].showSubMenu = true
                } else {
                    this.categories.data[index].showSubMenu = false
                }
            }
        },
        toggleOnMobile(index){
            this.categories.data = this.categories.data.filter(res => {
                res.showSubMenu = false
                return res;
            });
            
            if(this.$screen.width < 768 && this.categories.data[index].options){
                if(!this.categories.data[index].showSubMenu){
                    this.categories.data[index].showSubMenu = true
                } else {
                    this.categories.data[index].showSubMenu = false
                }
            }
        },
        gettreatmentTypes: function (){
            let data = null;
            this.$axios.get('utilities/treatment-types?filter-wiith-service', {genericApi: true})
            .then(res => {
                this.categories.data = res.data;
                this.categories.loader = false
            })
        
        },
        filterPIceList: function(){
            this.$axios.get('deals/filter/price-list')
            .then(res => {
                this.pricelist = res.data;
            }).catch(err => {

            })
        },
        async sortPopup() {
            this.showPopup = false
            this.$refs.sortdropdown.hide(true)
        },
        async onReset(){
                this.form.category = "";
                this.form.selectedSort = "";
                this.form.filterPrice = [];
            let deals = await this.$axios.get('deals',{params: this.form });
            this.deals = deals.data;
            this.deals_loader = false;
            if(this.$screen.width < 768){
                document.querySelector("#filter-wrap").style.display = "none";
            }
        },
        async close(){
            document.querySelector("#filter-wrap").style.display = "none";
        },
        async sortFilterDeals(category = null){
            if(category){
                this.form.category = category
            }
            let deals = await this.$axios.get('deals',{params: this.form });
            this.deals = deals.data;
            this.deals_loader = false;

            if(this.$screen.width <= 768){
                document.querySelector("#filter-wrap").style.display = "none";
            }

        },
        async showFilterBox(){
            document.querySelector("#filter-wrap").style.display = "flex";
        }
    }
}
</script>
<style lang="scss">
#deal-sort-wrap{
    .dropdown-menu{
        bottom: auto;
        left: auto !important;
        right: 0;
        top: 50px !important;
        transform: translateY(100%) !important;
        transition: 0.3s ease all;
        z-index: 2;
        
        &.show{
            transform: translateY(0) !important;
            transition: 0.3s ease all;
            @media (max-width:767px) {
                min-height: 40vh;
                display: block;
                position: fixed !important;
                bottom: 0;
                top: auto !important;    
            }
        }
        .custom-control {
            padding: 8px 0 !important;
        }
        #sort-header {
            .reset {
                font-size: 15px;
                font-weight: 700;
                color: rgba(0, 0, 0, 0.5);
            }
            .done {
                font-size: 15px;
                font-weight: 700;
                color: #0C56C9;
            }
            h3 {
                font-size: 20px;
                font-weight: 800;
                color: #000;
                margin-bottom: 0;
            }
            p {
                font-size: 15px;
                color: #000;
                font-weight: 400;
                margin-bottom: 0;
                text-align: center;
            }
        }
    }
}
.deals-sort {
    // position: absolute;
    // top: 0;
    // right: 0;
    @media (max-width:768px) {
        position: relative;
        order: -1;
        width: 83%;
        justify-content: space-between !important;
    }
    .subtitle {
        color: rgba(0, 0, 0, 0.5);
        font-size: 17px;
        font-weight: 700;
        @media (max-width:768px) {
            padding-left: 10px;
            width: 80%;
        }
    }
}
.deals-listing{
    #deal-sort-wrap {
        width: 100px;
        @media (max-width:768px) {
            width: 110px;
        }
        .dropdown-toggle {
            background-color: transparent;
            color: #000;
            font-size: 18px;
            font-weight: 700;
            height: 40px;
            border: 1px solid rgba(38, 57, 87, 0.15);
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-radius: 5px;
            &:focus {box-shadow: none;}
            @media (max-width:768px) {
                height: 39px;
                z-index: 0;
            }
        }
        .dropdown-menu {
            border: none;
            box-shadow: 0 2px 8px 0 rgb(0 0 0 / 20%);
            width: max-content;
             @media (max-width:768px) {
                 width: 100%;
             }
            form {
                padding: 0 15px;
                @media (max-width:768px) {
                    padding: 0 25px;
                }
            }
        }
    }
}
.deals-listing .custom-radio .custom-control-label {
                width: 100%;
                font-size: 15px;
                color: rgba(0, 0, 0, 0.5);
                font-weight: 600;
                padding: 4px 40px 0 0;
                }
.deals-listing .custom-radio .custom-control-input:checked ~ .custom-control-label::after {
    width: 10px;
    height: 10px;
    background-color: #0C56C9;
    border-radius: 33px;
    position: absolute;
    left: auto;
    right: 4px;
    top: 9px;
    background-image: none;
}
.deals-listing .sub-menu-wrap .custom-radio .custom-control-input:checked ~ .custom-control-label::after {
    top: 8px;
}
.deals-listing .custom-radio .custom-control-input:checked ~ .custom-control-label::before {
    border-color: #0C56C9;
}
.deals-listing .custom-radio .custom-control-label::before {
    border: 1px solid #A1A1A1;
    border-radius: 33px;
    width: 18px;
    height: 18px;
    position: absolute;
    left: auto;
    right: 0;
    background-color: transparent;
}
.deals-listing .price-row .custom-checkbox label::before {display: none;}
.deals-listing .custom-radio.b-custom-control-lg, .input-group-lg .custom-radio {padding-left: 0;}
.custom-checkbox .custom-control-input:checked ~ .custom-control-label::after {background-color: #0C56C9;left:-1.8rem;}
@media (max-width:768px) {
    .deals-listing .custom-radio .custom-control-label::before {width: 25px;height: 25px;}
    .deals-listing .custom-radio .custom-control-input:checked ~ .custom-control-label::after {width: 15px;height: 15px;top: 10px;right: 5px;}
    .custom-checkbox .custom-control-input:checked ~ .custom-control-label::after {
        width: 25px;
        height: 25px;
    }
    .deals-listing .custom-radio .custom-control-label {color: rgba(0, 0, 0, 0.5);font-weight: 400;}
    .deals-listing .custom-radio .custom-control-input:checked ~ .custom-control-label {color: #0C56C9;font-weight: 700;}
    .deals-listing .sub-menu-wrap .custom-radio .custom-control-input:checked ~ .custom-control-label::after {
        top: 9px;
    }
}
#filter-category > .btn{
    padding: 0;
}
.sub-menu{
  position: absolute;            
    min-width: 10rem;
    padding: .5rem 0;
    margin: .125rem 0 0;
    font-size: 1rem;
    color: #212529;
    text-align: left;
    list-style: none;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid rgba(0,0,0,.15);
    border-radius: .25rem;
}

.category-row {
    #filter-category {
        .dropdown-toggle {
            &:active, &:focus {box-shadow: none !important;} 
        }
        .dropdown-menu {
            box-shadow: 0 2px 8px 0 rgb(0 0 0 / 20%);
            border: none;
            margin-top: 10px;
            top: auto !important;
            padding: 0;
            transform: translate3d(0px, 0px, 0px) !important;
            @media (max-width:767px) {
                box-shadow: none;
                width: 100%;
                margin-top: 0;
                border-radius: 0;
            }
            li {
                .dropdown-item ,.b-dropdown-form{
                    padding: 10px 15px;
                    position: relative;
                    span {
                        font-size: 15px;
                        color: rgba(0, 0, 0, 0.5);
                        line-height: 19px;
                        font-weight: 600;
                        svg {
                            position: absolute;
                            right: 15px;
                            top: 17px;
                            left: auto;
                            color: rgba(0, 0, 0, 0.5);
                            transform: rotate(270deg);
                            @media (max-width:767px) {
                                transform: rotate(360deg);
                            }
                        }
                    }
                    .sub-menu {
                        width: max-content !important;
                        left: 100%;
                        box-shadow: 0 2px 8px 0 rgb(0 0 0 / 20%);
                        border: none;
                        top: 0;
                        padding: 0;
                        @media (max-width:767px) {
                            position: static;
                            box-shadow: none;
                            z-index: 9;
                            width: 100% !important;
                            transition: all .3s ease-in;
                        }
                        li {
                            a {
                            font-size: 15px;
                            color: rgba(0, 0, 0, 0.5);
                            line-height: 19px;
                            font-weight: 600;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>


<style lang="scss" scoped >
@media (max-width: 768px) {
    .overlay{
        content: "";
        background: rgba(0, 0, 0, 0.6);
        height: 100vh;
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1;
    }
    #filter-wrap{
        display: flex;
        @media (max-width: 768px){
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background: #FFF;
            z-index: 11;
            flex-wrap: wrap;
            align-content: flex-start;
        }
        #filter-header{
            width: 100%;
            border-bottom: 1px solid #dfdfdf;
            padding: 20px;
            align-items: center;
            span {
                font-size: 15px;
                color: #0C56C9;
                font-weight: 700;
            }
            h2 {
                font-size: 20px;
                color: #000;
                font-weight: 800;
            }
            svg {
                color: #000;
            }
        }
        .category-row{
            @media (max-width: 768px){
                width: 100%;
            }
        }
        .price-row{
            @media (max-width: 768px){
                width: 100%;
            }
        }
    }
}

.deals-listing {
    h2 {
            font-weight: bold;
            color: #000;
            font-size: 3vw;
    }
    .heading {
        position: relative;
        @media (max-width:768px) {
            padding-top: 40px;
            padding-bottom: 20px;
        }
        .deals-filter {
            @media (max-width:768px) {
                width: 110px;
            }
            button {
                background-color: transparent;
                color: #000;
                font-size: 18px;
                font-weight: 700;
                height: 39px;
                border: 1px solid rgba(38, 57, 87, 0.15);
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-radius: 5px;
                width: 100%;
                svg {width: 12px;}
            }
        }
        
        #filter-wrap {
            display: flex;
            .category-row , .price-row {
                width: 130px;
                @media (max-width:768px) {
                    width: 100%;
                }
                .acc-title {
                    background-color: transparent;
                    color: #000;
                    font-size: 18px;
                    font-weight: 700;
                    border: 1px solid rgba(38, 57, 87, 0.15);
                    padding: 0 10px;
                    border-radius: 5px;
                    height: 40px;
                    @media (max-width:768px) {
                        border-bottom: 1px solid rgba(38, 57, 87, 0.15) !important;
                        border-radius: 0;
                        padding: 10px;
                        border: none;
                        font-size: 16px;
                        padding: 0 30px;
                        height: 70px;
                    }
                    p {line-height: 0;}
                    svg {color: #000;width: 12px;}
                }
            }
            .category-row {
                margin-right: 20px;
                @media (max-width:768px) {
                    margin-right: 0;
                }
                #filter-category {
                    border: none;
                    margin-top: 10px;
                    border-radius: 5px;
                    width: 100%;
                    @media (max-width:768px) {
                        box-shadow: none;
                    }
                    @media(min-width: 769px){
                        position: relative;
                        z-index: 1;
                        background: #FFF;
                        width: 100%;
                        
                    }
                    .main-ul{
                        margin-bottom: 0;
                        li{
                            position: relative;
                            padding: 6px 15px 6px 20px;
                            // border-bottom: 1px solid rgba(38, 57, 87, 0.15);
                            color: rgba(38, 57, 87, 0.6);
                            min-width: 200px;
                            font-size: 15px;
                            font-weight: 600;
                            svg{
                                margin-left: 20px;
                                color: rgba(38, 57, 87, 0.6);
                            }
                            &:last-child {border: none;}
                            &:hover {
                                background-color: #0C56C9;
                                color: white;
                                @media (max-width:768px) {
                                    background-color: white;
                                    color: #263957;
                                }
                                svg {
                                    color: white;
                                    @media (max-width:768px) {
                                        color: #263957;
                                    }
                                }
                                .sub-menu-wrap {
                                    li {
                                        label {
                                            cursor: pointer;
                                            color: rgba(38, 57, 87, 0.6);
                                        }
                                    }
                                }
                            }
                            @media (max-width:768px) {
                                border-bottom: none;
                            }
                            span{
                                width: 100%;
                            }
                            .sub-menu-wrap {
                                max-height: 90vw;overflow: auto;
                                li {
                                    padding: 6px 0;
                                    &:hover {
                                        background-color: white;
                                        label {
                                            background-color: white;
                                            @media (max-width:768px) {
                                                color: rgba(38, 57, 87, 0.6);
                                            }   
                                        }
                                    }
                                }
                            }
                            @media (min-width:769px) {
                                .sub-menu-wrap{
                                    position: absolute;
                                    top: 0;
                                    background: #FFF;
                                    z-index: 2;
                                    width: max-content !important;
                                    left: 100%;
                                    box-shadow: 0 2px 8px 0 rgb(0 0 0 / 20%);
                                    // column-count: 2;
                                    // padding-bottom: 10px;
                                    transition: none;
                                    @media (max-width:980px) {
                                        column-count: 1;
                                    }
                                }
                            }
                            .custom-radio {padding-right: 20px;}
                            label {
                                font-size: 15px;
                                color: rgba(38, 57, 87, 0.6);
                                font-weight: 600;
                                padding: 0;
                                @media (max-width:768px) {
                                    color: #263957;
                                    font-weight: 400;
                                }
                                &::before {
                                    visibility: hidden;
                                    @media (max-width:768px) {
                                        visibility: visible;
                                    }
                                }
                                &::after {
                                    visibility: hidden;
                                    top: 8px;
                                    @media (max-width:768px) {
                                        visibility: visible;
                                        top: 9px;
                                        right: 5px;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            .price-row {
                position: relative;
                #filter-price {
                    border: none;
                    box-shadow: 0 2px 8px 0 rgb(0 0 0 / 20%);
                    margin-top: 10px;
                    border-radius: 5px;
                    width: 100%;
                    padding: 20px;
                    @media (max-width:768px) {
                        box-shadow: none;
                        padding: 20px 40px;
                    }
                    @media(min-width: 769px){
                        position: absolute;
                        z-index: 1;
                        background: #FFF;
                        min-width: max-content;
                    }
                    .main-ul {
                        margin-bottom: 0;
                        li {
                            padding: 6px 0;
                            .custom-checkbox {
                                padding-left: 0;
                                label {
                                    font-size: 15px;
                                    color: rgba(38, 57, 87, 0.6);
                                    font-weight: 600;
                                    width: 100%;
                                    &::before {
                                        border: 1px solid #A1A1A1;
                                        background-color: transparent;
                                        border-radius: 0;
                                        left: auto;
                                        right: 0;
                                        display: none;
                                        @media (max-width:768px) {
                                            width: 25px;
                                            height: 25px;
                                        }
                                    }
                                    &::after {
                                        left: auto;
                                        right: 0;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    .p-3 {
        @media (max-width:768px) {
            border-top: 1px solid rgba(38, 57, 87, 0.15);
        }
        .deals {
            margin-bottom: 0;
            .slick-track {
                @media (max-width:980px) {
                    display: flex;
                    flex-wrap: wrap;
                }
                .slick-slide {
                    @media (max-width:980px) {
                        width: 50% !important;
                    }
                }
            }
        }
    }
    
}


</style>