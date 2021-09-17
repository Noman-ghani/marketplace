<template>
    <div class="container search-results">
        <h2 class="m-0 text-center mt-4 mb-4 main-heading" v-if="results.length">{{results.length}} results for <span v-if="$route.query.business">{{$route.query.business}}</span><span v-if="$route.query.tName">{{$route.query.tName}}</span></h2>
        <BranchesListTemplate :data="results" :loader="results_loader" v-if="results.length > 0"/>
        <div v-else>
            <div v-if="!results_loader" class="d-flex flex-column justify-content-center align-items-center">
                <img src="images/not-found.png" alt="Not Found" class="mt-4 mb-4" style="max-width:180px;">
                <h3>No results found</h3> 
            </div>
        </div>  
    </div>
</template>

<script>
export default {
    data(){
        return {
            form: {
                business: this.$route.query.business ? this.$route.query.business : '',
                typeId: this.$route.query.typeId ? this.$route.query.typeId : '',
                country_id: this.$auth.$storage.getLocalStorage("user_country"),
                city_id: this.$auth.$storage.getLocalStorage("user_city"),
            },
            selected_treatment_type: null,
            results: [],
            results_loader: true,
        }
    },
    created: function(){
        this.getResults();
    },
    watch: {
        $route: {
            handler: function (route) {
                if (route.query.business) {
                    this.form.typeId = '';
                    this.form.business = route.query.business;
                    this.getResults();
                }
                if (route.query.typeId) {
                    this.form.business = '';
                    this.form.typeId = route.query.typeId;
                    this.getResults();
                }
            }
        }
    },
    methods:{
        async getResults(){
           const branch = await this.$axios.get('/branch/all',{params: this.form});
           this.results = [];
           branch.data.forEach(res => {
               if(res.business){
                   this.results.push(res);
               }
           });
           this.results_loader = false
        }
    }
}
</script>
<style lang="scss" scoped>
.main-heading{
    text-transform: capitalize;
}
</style>