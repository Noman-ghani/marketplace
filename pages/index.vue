<template>
  <b-overlay variant="white" :show="home_loader" :opacity="1" :style="'height:'+(home_loader ? '100vh': 'auto')">
    <template v-if="!home_loader">
      <section class="home-banner">
        <div class="container">
          <div class="banner-col">
            <b-jumbotron header="Search Book Enjoy">
              <p>Instantly buy deals and book hair, beauty and wellness experiences.</p>
              <div class="banner-search" v-if="$screen.width >= 768">
                <HeaderSearch :homebanner="true"/>
              </div>
            </b-jumbotron>
          </div>
        </div>
      </section>
      <section class="search d-sm-block d-md-none" v-if="$screen.width < 768">
        <HeaderSearch />
      </section>
      <section class="bussiness-sec" v-if="branches.length > 0">
        <div class="container">
          <div class="heading">
            <h2>Popular Business</h2>
            <nuxt-link to="/b" class="sa-btn"  v-if="$screen.width < 768 && branches.length > 0">See All ></nuxt-link>
          </div>
        </div>
          <BranchesListTemplate :slider="true" :data="branches" :loader="branches_loader"/>
          <nuxt-link to="/b" class="vm-btn" v-if="$screen.width >= 768 && branches.length > 0">View More</nuxt-link>
      </section>
      <section class="deals-sec" v-if="deals.length > 0">
        <div class="container">
          <div class="heading">
            <h2>Recent Deals</h2>
            <nuxt-link to="/deals" class="sa-btn" v-if="$screen.width < 768 && deals.length > 0">See All ></nuxt-link>
          </div>
        </div>
          <DealsListTemplate :slider="true" :data="deals" :loader="deals_loader"/>
        <nuxt-link to="/deals" class="vm-btn" v-if="$screen.width >= 768 && deals.length > 0">View More</nuxt-link>
      </section>
      <section class="categories">
        <div class="container">
          <div class="heading">
            <h2>What You Are Looking For</h2>
          </div>
          <DealsCategories />
        </div>
      </section>
      <section class="contact-sec">
        <div class="container">
          <FormContactform />
        </div>
      </section>
      </template>
  </b-overlay>
</template>

<script>
export default {
  name: 'home',
  data(){
    return{
      home_loader: true,
      deals: [],
      deals_loader: true,
      branches: [],
      branches_loader: true,
      form: {
        country_id: this.$auth.$storage.getLocalStorage("user_country"),
        city_id: this.$auth.$storage.getLocalStorage("user_city"),
      }
    }
  },
  methods:{
    getFeaturedBracnhes() {
      this.$axios.get('/branch/all',{params: this.form})
      .then(branch => {
        this.branches = branch.data;
        this.branches_loader = false
        this.home_loader = false;
      }).catch(err => {
        this.home_loader = true;
      })
    },
    getDeals(){
      this.$axios.get('deals?limit=10',{params: this.form})
      .then(searchDeals => {
        this.deals = searchDeals.data;
        this.deals_loader = false
        this.home_loader = false;
      }).catch(err => {
        this.home_loader = true;
      })
    },
    handleSCroll (event) {
      
      let searchBar = document.querySelector(".home-banner .banner-search");
      if(searchBar){
        if (window.scrollY > 350) {
          searchBar.style.display = "none";
                      
        } 
        else if (window.scrollY < 200) {
            searchBar.removeAttribute("style")
        }
      }
    }
  },
  beforeCreate: async function(){
      if(this.$route.query.login){
          let token = this.$route.query.token;
          let token_type = this.$route.query.token_type;
          let expires_in = this.$route.query.expires_in;
          let auth = this.$auth;
          // alert(123);
          auth.setToken('local', token_type + token);
          auth.setStrategy('local');
          await auth.fetchUser();
          let url = this.$auth.$storage.getLocalStorage("redirect_url");
          if(url){
              window.location.href = url;
          }else{
              this.$router.replace({query: []})
          }
          this.home_loader = false;
      }
  },
  created () {
    this.getFeaturedBracnhes();
    this.getDeals();
    window.addEventListener('scroll', this.handleSCroll);
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleSCroll);
  }
}
</script>
