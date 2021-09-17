<template>
    <b-form ref="form" @submit.stop.prevent="handleSubmit" class="w-100 align-items-center" v-show="show == true">
        <b-form-group
          label="Select Country"
          label-for="conutry"
          :label-sr-only="showLabels"
          class="mb-0 country">
          <b-overlay :show="country.loader" is-field variant="transparent">
            <div class="select-wrap flag-wrap">
              <div :class="'flag-code '+(!haveSetCountry ? 'bg-transparent' : '') ">
                  <span v-if="country.selected.flag">
                    <img :src="'/images/flags/'+country.selected.flag+'.jpg'" :alt="country.selected.id" class="flag-img">
                  </span>
              </div>
              <b-form-select v-model="country.selected.id" @change="selectCity(country.selected.id)" id="conutry">
                  <b-form-select-option value="">Select Country</b-form-select-option>
                  <b-form-select-option v-for="(options,idx) in country_options" :key="idx" :value="options.value" v-html="options.text" />
              </b-form-select>
              <span class="select-icon">
                  <b-icon icon="chevron-down" font-scale=".9"></b-icon>
              </span>
            </div>
          </b-overlay>
        </b-form-group>

        <b-form-group
          label="Select City"
          label-for="city"
          :label-sr-only="showLabels"
          v-if="country.selected.id"
          class="mb-0 city">
          <b-overlay :show="city.loader" is-field variant="transparent">
            <div class="select-wrap flag-wrap">
              <b-form-select v-model="city.selected" @change="submitForm()" :options="city_options" id="city"></b-form-select>
              <span class="select-icon">
                  <b-icon icon="chevron-down" font-scale=".9"></b-icon>
              </span>
            </div>
          </b-overlay>
        </b-form-group>
        <div class="search-btn-wrap" v-if="haveSetCountry">
          <b-button class="search-btn" variant="primary" @click="showSearchScreen">
            <b-icon-search font-scale="1.1"/>
            Search
          </b-button>
        </div>
    </b-form>
</template>
<script>

export default{

  props: {
    showLabels: {
        type: String,
        default: ''
    },
    searchRef: {
      type: Object,
      default: null
    }
  },
  data(){
    return{
      show: true,

      countries: null,
      country: {
        selected: {
          id: '',
          flag: null
        },
        loader: true
      },
      country_options: [],
      city: {
        selected: null,
        loader: true
      },
      city_options: [{
        value: null, text: "Select Your City"
      }],
      haveSetCountry: true
    }
  },
  created: function(){
      this.$axios.get('utilities/countries?withcites',{genericApi: true})
      .then(res => {

        this.countries = res.data;

        res.data.forEach(country => {
          this.country_options.push({
            value: country.id,
            text: country.name,
            flag: country.flag
          })
        });
        this.country.loader = false;
        
        let country = this.$auth.$storage.getLocalStorage("user_country");
        let city = this.$auth.$storage.getLocalStorage("user_city");

          if(country != null && city != null){
            this.country.selected.id = country;
            this.selectCity(this.country.selected.id);
            this.city.selected = city;
          }else{
            this.haveSetCountry = false
          }
      });
  },
  methods: {
      selectCity(countryID) {
        this.country_options.forEach(res => {
          if(res.value == this.country.selected.id){
            this.country.selected.flag = res.text.toLowerCase();
          }
        })

        this.city.selected = null;

        this.city_options = [{
          value: null, text: "Select Your City"
        }];

        this.countries.forEach(country => {
          if(country.id == countryID){
            country.states.forEach(state => {
                state.cities.forEach(city => {
                  this.city_options.push({
                    value: city.id,
                    text: city.name
                  })
                })
            })
          }
        });
        this.city.loader = false;

      },
      submitForm() {
        let country = this.country.selected.id;
        let city = this.city.selected;

        if(country != null && city != null){
          this.$auth.$storage.setLocalStorage("user_country",country);
          this.$auth.$storage.setLocalStorage("user_city",city);
        }
        this.show = false
        this.$router.go()
      },
      showSearchScreen(){
        this.searchRef['searchWrap'].classList.add('search-wrap');
      }
  }
}
</script>
<style lang="scss" scoped>
.search-btn{
  font-size: 16px;
  padding: 10px;
  .bi-search{
    margin: 0 0 1px;
  }
}
.select-wrap.flag-wrap .bg-transparent{
  background: transparent;
}
</style>