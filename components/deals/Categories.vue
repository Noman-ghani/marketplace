<template>
    <b-overlay :show="category_loader" rounded variant="transparent">
        <div class="row" v-if="categories.length > 0">
            <div class="category-col" v-for="(category,idx) in categories" :key="idx">
                <nuxt-link :to="'/search?business='+category.icon">
                    <img :src="category.url" alt="category">
                    <h4>{{category.title}}</h4>
                </nuxt-link>
            </div>
        </div>
    </b-overlay>
</template>
<script>
export default {
    data(){
        return{
            category_loader: true,
            categories: []
        }
    },
    created: function() {
        this.getBusinessTypes();
    },
    methods:{
        async getBusinessTypes(){
           let businessTypes =  await this.$axios.get('/utilities/business-types',{genericApi: true});
            this.categories = businessTypes.data;
            this.category_loader = false
        },
    }
    
}
</script>