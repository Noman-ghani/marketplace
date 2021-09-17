<template>
    <div class="container mt-5">
        <h2 class="m-0 text-center mt-0 mb-4 main-heading" v-show="$screen.width >= 768">Locations</h2>
        <BranchesListTemplate :data="branches" :loader="branches_loader"/>
    </div>
</template>
<script>
export default {
    data() {
        return {
            branches: [],
            branches_loader: true,
            form:{
                business_slug: null,
                country_id: this.$auth.$storage.getLocalStorage("user_country"),
                city_id: this.$auth.$storage.getLocalStorage("user_city"),
            }
        }
    },
    created: function(){
        this.getBranchBySlug(this.$route.params.business_slug);
    },
    methods: {
        async getBranchBySlug(slug){
            this.form.business_slug = slug;
            const branches = await this.$axios.get('/branch',{params:this.form});
            if(branches.data.length == 1){
                this.$router.push(this.$route.params.business_slug+'/'+branches.data[0].slug)
            }
            this.branches = branches.data;
            this.branches_loader = false
        }
    }
}
</script>
<style lang="scss" scoped>
.main-heading{
    font-weight: bold;
    color: #000;
    font-size: 3vw;
    text-transform: capitalize;
}
</style>