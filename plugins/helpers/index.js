import Vue from 'vue'
import Store from "../../store"
import moment from "moment"
import VueRx from "vue-rx"
import VuejsClipper from "vuejs-clipper"
Vue.use(VueRx)
Vue.use(VuejsClipper)

//Caculate Tax
Vue.prototype.calculateTax = (rate, price) => {
    let taxAmount = (rate / 100) * price
    // if ($nuxt.$store.state.business.list) {
    //     if($nuxt.$store.state.business.list.is_tax_inclusive){
    //         taxAmount = taxAmount / (1 + (rate / 100))
    //     }
    // }
    

    return taxAmount
}

//Succes Toast
Vue.prototype.successToast = (message, config = {}) => {
    $nuxt.$bvToast.toast(message, {
        title: config.title ? config.title : "Success",
        variant: "success",
        autoHideDelay: 4000,
        solid: true
    });
}

//Error Toast
Vue.prototype.errorToast = (message, config = {}) => {
    $nuxt.$bvToast.toast(message, {
        title: config.title ? config.title : "Error",
        variant: "danger",
        autoHideDelay: 4000,
        solid: true
    });
}

const formatAsCurrency = (value) => parseFloat(value).toFixed(0).replace(/\d(?=(\d{3})+\.)/g, '$&,')

Vue.filter("uppercase_first_each", (value) => {
    if (value) {
        return value[0].toUpperCase() + value.substring(1)
    }

    return ""
})

Vue.filter("currency", (value) => {
    if (value) return formatAsCurrency(value)

    return value
})

Vue.filter("uppercase", (value) => {
    if (value) {
        return value.toUpperCase()
    }

    return ""
})

Vue.mixin({
    methods:{
        formatAsCurrency,
        formatDate: function(date, format) {
            if (format === undefined) {
                format = "dddd DD MMM, YYYY"
            }

            return moment(date).format(format)
        },
        formatTime: function(date, format, applyTimeZone = true) {
            if (format === undefined) {
                format = "HH:mm"

                if($nuxt.$store.state.business.list){
                    if ($nuxt.$store.state.business.list.time_format === "12h") {
                        format = "hh:mma"
                    }
                }
            }

            if (applyTimeZone) {
                const offset = $nuxt.$auth.user.timezone.offset
                const [hours, minutes] = offset.substring(1).split(':')

                if (offset[0] === '+') {
                    return moment(date).add(hours, "hours").add(minutes, "minutes").format(format)
                }

                return moment(date).subtract(hours, "hours").subtract(minutes, "minutes").format(format)
            }

            return moment(date).format(format)
        },
        timeFormat: function(business) {
            let format = " hh:mma"
            
            if(business && business.time_format === "24h"){
                format = " HH:mm"
            }

            return format;
        },
        formatDateTime: function(date, time = null, business = null, format) {
            if (format === undefined) {
                format = "dddd DD MMM, YYYY"
            }

            if(time){
                format += this.timeFormat(business)
            }

            return moment(date+' '+time).format(format)
        },
        getTimeSlots: function(from_date_time, to_date_time, interval = 15) {
            let default_from_date_time = "2021-04-26 09:00:00"
            let default_to_date_time = "2021-04-26 18:00:00"

            if (from_date_time !== undefined) {
                default_from_date_time = from_date_time
            }

            if (to_date_time !== undefined) {
                default_to_date_time = to_date_time
            }

            let from = moment(default_from_date_time).toDate()
            let to = moment(default_to_date_time).toDate()
            let slots = []

            while (from <= to) {
                slots.push({ value: moment(from).format("HH:mm:ss"), text: moment(from).format(this.timeFormat()) })
                from = moment(from).add(interval, "minutes").toDate()
            }

            return slots
        },
        convertToHoursAndMinutes: function(time) {
            time = moment.utc(moment.duration(time, "minutes").asMilliseconds())
            const minutes = time.minutes()
            const hours = time.hours()
            const hourFormatStr = hours === 1 ? "hour" : "hours";
            const minuteFormatStr = minutes === 1 ? "minute" : "minutes";
            if (!time.minutes()) {
                return time.format(`h [${hourFormatStr}]`)
            }
            return time.format(`h [${hourFormatStr}] mm [${minuteFormatStr}]`)
        },
        getStoreItemFromLocalStorage: function () {
            let business = this.$auth.$storage.getLocalStorage('business');
            if(business){
                let business_expire_date = new Date(business.subscription_expires_at);    
                let current_date = new Date();    
                if (current_date > business_expire_date) {    
                    this.$router.push({path: '/'});
                    this.errorToast("Booking is not active any more for this location in servU please search for another one.", {title: "Not Found"})
                }

                this.$store.commit("business/addBusiness",business);
                
                let branch = this.$auth.$storage.getLocalStorage('branch');
                if(branch){
                    this.$store.commit("business/addBranch",branch);
                }
                
                let settings = this.$auth.$storage.getLocalStorage('settings');
                if(settings){
                    this.$store.commit("business/addSettings",settings);
                }
                
                let staff = this.$auth.$storage.getLocalStorage('staff');
                if(staff){
                    this.$store.commit("checkout/staff/add",staff);
                }
                
                let cart = this.$auth.$storage.getLocalStorage('cart');
                
                if(cart){
                    this.$store.commit("checkout/cart/add",cart);
                }
            }else{
                this.$auth.$storage.removeLocalStorage('branch');
                this.$auth.$storage.removeLocalStorage('settings');
                this.$auth.$storage.removeLocalStorage('staff');
                this.$auth.$storage.removeLocalStorage('cart');
                this.$auth.$storage.removeLocalStorage('step');
            }
        },
        totalInclusionsPrice: function (deal) {
            let totalInclusionPrice = 0;
            if(deal){
                deal.inclusions.forEach(dealRow => {
                    totalInclusionPrice += parseFloat(dealRow.price) * dealRow.quantity
                })
            }
            return totalInclusionPrice
        },
        calculateOffInDeal(a, b) {
            //a = Services total price
            //b = Deal price

            if (isNaN(+a) || isNaN(+b)){
               return console.warn('<b class="warn">input error</b> (a=',a,' b=',b,')');
            }
            let percentage = a-b === 0 ? 0 : (100 * Math.abs( ( a - b ) / b  )).toFixed(0) +  '% OFF'
            return percentage;
        }
    }
})