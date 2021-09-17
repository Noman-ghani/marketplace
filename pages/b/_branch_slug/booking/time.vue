<template>
    <div class="w-100 branch_time" v-if="$store.state.business.branch.timings.length">
        <div class="categories-list calender-area p-3">
            <p class="bg-white m-0 position-absolute month" style="z-index:1"> 
                <strong class="pl-1">{{month}}</strong>
            </p>
            <VueSlickCarousel v-if="calendarData && calendarData.length > 0" ref="slick" v-bind="slickSettings" @beforeChange="handleBeforeChange" class="day-list d-flex align-items-center">
                <template #prevArrow="arrowOption">
                    <div class="custom-arrow mt-4">
                        <b-icon-arrow-left class="mt-2" :data-arrow="arrowOption" font-scale="1.2"/>
                    </div>
                </template>
                <div class="list-item" v-for="(data,idx) in calendarData" :key="idx">
                    <strong class="position-absolute top-0" v-if="data.date == 1">
                        {{data.month}}
                    </strong>
                    <button @click="getTimeSlots(data.fullDate,idx)" ref="box" :class="'box '+ (data.is_closed ? 'disabled' : '') + (idx == 0 ? ' active' : '')" >
                        <!-- <p class="day">{{data.getDay() | uppercase_first_each}}</p> -->
                        <p class="day">{{data.day}}</p>
                        <p class="date">{{data.date}}</p>
                    </button>
                </div>
                <template #nextArrow="arrowOption">
                    <div class="custom-arrow mt-4">
                        <b-icon-arrow-right class="mt-2" :data-arrow="arrowOption" font-scale="1.2"/>
                    </div>
                </template>
            </VueSlickCarousel>
        </div>
        <div class="d-flex flex-wrap w-100 timings-list">
            <b-overlay :show="time_loader" class="w-100" variant="transparent">
                <template v-if="timeSlots && timeSlots.length > 0">
                    <div class="cursor-pointer d-flex w-100 m-0" @click="checkoutUrl(data.value)" :ref="data.value" v-for="(data,idx) in timeSlots" :key="idx">
                        <b-card class="shadow-none w-100 rounded-0 border-0 cursor-pointer" no-body>
                            <b-card-body class="p-4 border-bottom">
                                    <div class="d-flex align-items-between">
                                        <div class="flex-grow-1 d-flex">
                                            <div class="full-name d-flex align-content-center flex-wrap flex-grow-1">
                                                <p class="name m-0 w-100" :data-value="data.value">{{data.text}}</p>
                                            </div>
                                        </div>
                                        <div class="next d-flex align-content-center flex-wrap">
                                            <b-icon-chevron-right font-scale="1.1" />
                                        </div>
                                    </div>
                            </b-card-body>
                        </b-card>
                    </div>
                </template>
                <div v-else>
                    <div v-if="emptyStaffSlots && !time_loader" class="d-flex w-100 close-box flex-column align-items-center">
                        <svg class="close-icon" viewBox="0 0 73 71"><g fill="none" fill-rule="evenodd"><path fill="#F2F2F7" d="M7 25h66v46H7z"></path><path fill="#111" fill-rule="nonzero" d="M35.264.8a5.635 5.635 0 015.27 7.636L55.587 18.54h12.941a1.2 1.2 0 011.194 1.078l.006.123v46.57a1.2 1.2 0 01-1.2 1.2H2a1.2 1.2 0 01-1.2-1.2V19.74a1.2 1.2 0 011.2-1.2l12.94-.001L29.994 8.436a5.613 5.613 0 01-.36-1.78l-.005-.22A5.635 5.635 0 0135.264.8zm32.064 20.14H3.2v44.17h64.128V20.94zM13.187 37.742c1 0 2.004.243 3.012.725l-.704 1.774c-.385-.183-.77-.342-1.16-.479a3.452 3.452 0 00-1.147-.203c-.82 0-1.456.308-1.907.925-.452.618-.676 1.477-.676 2.58 0 2.295.86 3.441 2.583 3.441.723 0 1.598-.18 2.625-.542v1.83c-.844.352-1.787.528-2.83.528-1.496 0-2.641-.453-3.434-1.362-.793-.907-1.189-2.211-1.189-3.909 0-1.07.194-2.008.583-2.812.39-.804.948-1.421 1.679-1.852.73-.429 1.586-.644 2.565-.644zM30.6 37.73c1.583 0 2.792.454 3.628 1.364.839.911 1.258 2.22 1.258 3.93 0 1.701-.423 3.012-1.268 3.926-.845.915-2.055 1.372-3.63 1.372-1.577 0-2.788-.457-3.632-1.372-.845-.914-1.268-2.23-1.268-3.942 0-1.712.424-3.02 1.271-3.923.847-.904 2.06-1.355 3.641-1.355zm9.99.014c.534 0 1.044.065 1.53.191s.994.305 1.524.534l-.704 1.696a10.335 10.335 0 00-1.362-.471 4.343 4.343 0 00-1.06-.134c-.412 0-.729.096-.95.289a.956.956 0 00-.33.754c0 .192.044.359.133.502.09.143.232.282.427.416.195.133.655.375 1.383.72.96.46 1.62.92 1.978 1.383.354.463.534 1.03.534 1.7 0 .93-.335 1.661-1.003 2.195-.669.535-1.598.803-2.791.803-1.098 0-2.07-.206-2.914-.62v-2.025c.694.309 1.282.529 1.763.654.481.127.921.19 1.32.19.478 0 .845-.09 1.1-.274.255-.182.385-.455.385-.817a.901.901 0 00-.168-.537 1.89 1.89 0 00-.497-.454c-.217-.145-.663-.378-1.333-.697-.629-.295-1.101-.578-1.415-.852a3.22 3.22 0 01-.753-.95c-.188-.36-.281-.783-.281-1.267 0-.91.307-1.626.924-2.147.618-.521 1.47-.782 2.56-.782zm16.271.149c1.68 0 2.984.442 3.913 1.33.93.885 1.394 2.124 1.394 3.716 0 1.693-.482 2.99-1.446 3.892-.965.9-2.357 1.352-4.178 1.352H53.63v-10.29h3.231zm-36.677-.001v8.488h4.175v1.801h-6.357V37.89h2.182zm31.3 0v1.787h-3.745v2.259h3.484v1.788h-3.484v2.654h3.745v1.801h-5.927V37.89h5.927zM30.6 39.544c-.867 0-1.522.293-1.963.877-.44.584-.661 1.451-.661 2.601 0 1.149.218 2.014.654 2.597.438.582 1.089.873 1.958.873 1.74 0 2.61-1.157 2.61-3.47 0-2.318-.865-3.478-2.598-3.478zm26.374.135h-1.162v6.7h.937c2.101 0 3.154-1.128 3.154-3.384 0-2.211-.977-3.316-2.929-3.316zM39.222 10.446a5.617 5.617 0 01-3.958 1.624c-1.543 0-2.94-.62-3.958-1.624L19.247 18.54H51.28zM35.264 3.2a3.235 3.235 0 100 6.47 3.235 3.235 0 000-6.47z"></path></g></svg>
                        <p class="close-title">
                            <span>{{this.staff.first_name+' '+this.staff.last_name}}</span> have no time slot for this day.
                        </p>
                        <p class="close-msg">
                            but you can book for {{nextDate.format('DD MMMM')}}
                        </p>
                    </div>
                    <div v-else-if="closedBranch && !time_loader" class="d-flex w-100 close-box flex-column align-items-center">
                        <svg class="close-icon" viewBox="0 0 73 71"><g fill="none" fill-rule="evenodd"><path fill="#F2F2F7" d="M7 25h66v46H7z"></path><path fill="#111" fill-rule="nonzero" d="M35.264.8a5.635 5.635 0 015.27 7.636L55.587 18.54h12.941a1.2 1.2 0 011.194 1.078l.006.123v46.57a1.2 1.2 0 01-1.2 1.2H2a1.2 1.2 0 01-1.2-1.2V19.74a1.2 1.2 0 011.2-1.2l12.94-.001L29.994 8.436a5.613 5.613 0 01-.36-1.78l-.005-.22A5.635 5.635 0 0135.264.8zm32.064 20.14H3.2v44.17h64.128V20.94zM13.187 37.742c1 0 2.004.243 3.012.725l-.704 1.774c-.385-.183-.77-.342-1.16-.479a3.452 3.452 0 00-1.147-.203c-.82 0-1.456.308-1.907.925-.452.618-.676 1.477-.676 2.58 0 2.295.86 3.441 2.583 3.441.723 0 1.598-.18 2.625-.542v1.83c-.844.352-1.787.528-2.83.528-1.496 0-2.641-.453-3.434-1.362-.793-.907-1.189-2.211-1.189-3.909 0-1.07.194-2.008.583-2.812.39-.804.948-1.421 1.679-1.852.73-.429 1.586-.644 2.565-.644zM30.6 37.73c1.583 0 2.792.454 3.628 1.364.839.911 1.258 2.22 1.258 3.93 0 1.701-.423 3.012-1.268 3.926-.845.915-2.055 1.372-3.63 1.372-1.577 0-2.788-.457-3.632-1.372-.845-.914-1.268-2.23-1.268-3.942 0-1.712.424-3.02 1.271-3.923.847-.904 2.06-1.355 3.641-1.355zm9.99.014c.534 0 1.044.065 1.53.191s.994.305 1.524.534l-.704 1.696a10.335 10.335 0 00-1.362-.471 4.343 4.343 0 00-1.06-.134c-.412 0-.729.096-.95.289a.956.956 0 00-.33.754c0 .192.044.359.133.502.09.143.232.282.427.416.195.133.655.375 1.383.72.96.46 1.62.92 1.978 1.383.354.463.534 1.03.534 1.7 0 .93-.335 1.661-1.003 2.195-.669.535-1.598.803-2.791.803-1.098 0-2.07-.206-2.914-.62v-2.025c.694.309 1.282.529 1.763.654.481.127.921.19 1.32.19.478 0 .845-.09 1.1-.274.255-.182.385-.455.385-.817a.901.901 0 00-.168-.537 1.89 1.89 0 00-.497-.454c-.217-.145-.663-.378-1.333-.697-.629-.295-1.101-.578-1.415-.852a3.22 3.22 0 01-.753-.95c-.188-.36-.281-.783-.281-1.267 0-.91.307-1.626.924-2.147.618-.521 1.47-.782 2.56-.782zm16.271.149c1.68 0 2.984.442 3.913 1.33.93.885 1.394 2.124 1.394 3.716 0 1.693-.482 2.99-1.446 3.892-.965.9-2.357 1.352-4.178 1.352H53.63v-10.29h3.231zm-36.677-.001v8.488h4.175v1.801h-6.357V37.89h2.182zm31.3 0v1.787h-3.745v2.259h3.484v1.788h-3.484v2.654h3.745v1.801h-5.927V37.89h5.927zM30.6 39.544c-.867 0-1.522.293-1.963.877-.44.584-.661 1.451-.661 2.601 0 1.149.218 2.014.654 2.597.438.582 1.089.873 1.958.873 1.74 0 2.61-1.157 2.61-3.47 0-2.318-.865-3.478-2.598-3.478zm26.374.135h-1.162v6.7h.937c2.101 0 3.154-1.128 3.154-3.384 0-2.211-.977-3.316-2.929-3.316zM39.222 10.446a5.617 5.617 0 01-3.958 1.624c-1.543 0-2.94-.62-3.958-1.624L19.247 18.54H51.28zM35.264 3.2a3.235 3.235 0 100 6.47 3.235 3.235 0 000-6.47z"></path></g></svg>
                        <p class="close-title">
                            <span>{{$store.state.business.branch.name}}</span> is closed on this day
                        </p>
                        <p class="close-msg">
                            but you can book for {{nextDate.format('DD MMMM')}}
                        </p>
                        <b-button variant="transparent">Go to {{nextDate.format('dddd, DD MMMM')}}</b-button>
                    </div>
                </div>
            </b-overlay>
        </div>
    </div>
    <div class="w-100 categories-list p-4 justify-content-center" v-else>
        <h3 class="mt-4 mb-4">Timmings Not Added for this Branch</h3>
    </div>
</template>
<script>
import moment, { weekdays } from "moment"
export default {
    layout: 'bookingWidget',
    data() {
        return {
            slickSettings: {
                variableWidth: true,
                arrows: true,
                infinite: false, 
                // lazyLoad: true,
                slidesToShow:7,
                slidesToScroll:7,
                dots:false,
                "responsive": [
                    {
                    "breakpoint": 880,
                    "settings": {
                        slidesToShow: 5,
                        slidesToScroll: 5,
                        }
                    },
                    {
                    "breakpoint": 420,
                    "settings": {
                        slidesToShow: 3,
                        slidesToScroll: 5,
                        }
                    },
                ]
            },
            staff : null,
            month : '',
            showMonthsPopup: false,
            monthOptions: moment.months(),
            selectedMonth: null,
            showTime: false,
            time_loader: true,
            data: {
                name: 'b-branch_slug-booking-staff',
                step: 3,
                title: 'Select time for Services'
            },
            form: {
                date: null,
                business_id: null,
                business: null,
                branch_id: null
            },
            calendarData: null,
            timeSlots: [],
            emptyStaffSlots: false,
            closedBranch: false,
        }
    },
    created: function () {
    
        this.getStoreItemFromLocalStorage();

        if(this.$store.state.checkout.staff.data){
            this.staff = this.$store.state.checkout.staff.data;
            this.data.title = 'Select time with '+this.staff.first_name+' '+this.staff.last_name
        }

        this.form.business_id = this.$auth.$storage.getLocalStorage('branch').business_id
        this.form.branch_id = this.$auth.$storage.getLocalStorage('branch').id
        
        this.form.date = moment(new Date()).format("YYYY-MM-DD")

        this.getTimeSlots();
    
        this.getDaysInMonths();
    },
    mounted: function(){
        this.$store.commit("checkout/step/add",this.data);
        let step = this.$store.state.checkout.step.data;
        this.$auth.$storage.setLocalStorage("step",step);
    },
    computed:{
        nextDate: function() {
            let date = this.form.date;
            date = moment(date).add(1, "day");
            return date;
        }
    },
    methods: {
        getDaysInMonths(changeMonth = null) {

            var startDate = moment(new Date());
            var endDate = moment(new Date()).endOf('year');
            //Get disabled days array fro week
            let disabledDays = [];
            this.$auth.$storage.getLocalStorage('branch').timings.forEach(data => {
               if(data.is_closed){
                   disabledDays.push(data.day_of_week);
               }
           });

            var now = startDate, dates = [];
            
            this.month = now.format('MMM');

            while (now.isSameOrBefore(endDate) && endDate.year() == moment().year()) {
                let Tmp_date = {
                    'date': now.format('DD'), 
                        'month': now.format('MMM'),
                        'day': now.format('ddd'),
                        'fullDate': now.format("YYYY-MM-DD"),
                        'is_closed': 0
                    };
                if(disabledDays.includes(+now.format('d'))){
                    Tmp_date.is_closed = 1
                }
                dates.push(Tmp_date);
                now.add(1, 'days');
            }

            this.calendarData = dates;
        },
        // Events listeners
        handleBeforeChange(event, slick, currentSlide) {
            if(this.month != this.calendarData[slick].month){
                setTimeout(() => {
                    this.month = this.calendarData[slick].month;
                }, 100);
            }
        },
        getTimeSlots: function (dateRange,index = 0) {
                if(this.$refs.box){
                    var box = document.querySelectorAll(".box");
                    box.forEach.call(box, function(el,idx) {
                        el.classList.remove("active");
                        if(index == idx){
                            el.classList.add("active");
                        }
                    });
                }

                if (dateRange !== undefined) {
                    this.form.date = dateRange;
                }

                if(this.$auth.$storage.getLocalStorage('branch').timings.length){
                    const weekday = moment(this.form.date).weekday()
                    
                    this.form.staff_id = this.staff.id;
                    this.form.day_of_week = weekday;
                    this.timeSlots = [];
                    this.emptyStaffSlots = false;
                    this.closedBranch = false;
                    this.time_loader = true;
                    this.$axios.get('staff/shifts',{params: this.form})
                    .then(res => {
                        
                        if(res.data.empty){
                            this.emptyStaffSlots = true
                        }
                        
                        if(res.data.close){
                            this.closedBranch = true
                        }

                        this.timeSlots = res.data.data;
                        this.time_loader = false
                    })
                    .catch(err => {
                        this.timeSlots = [];
                        this.errorToast(err.responce.data, {title: "Time not fetched"})
                    })
                }
        },
        checkoutUrl: function(date) {
            let checkout = 'checkout';
            
            this.$auth.$storage.setLocalStorage('booking_date',moment(date).format("YYYY-MM-DD"));
            this.$auth.$storage.setLocalStorage('booking_Time',moment(date).format("HH:mm:ss"));

            if(!this.$auth.loggedIn){
                checkout = 'auth';
                this.$auth.$storage.setLocalStorage("redirect_url", this.$route.path.replace('time','checkout'));
            }
            let cartData = this.$store.state.checkout.cart.data;
            if(cartData){
                let start_time = moment(date).format("HH:mm:ss");
                cartData = cartData.filter((res) => {
                    
                    res.start_time = start_time;
                    date = moment(date).add(res.duration,'minutes');
                    start_time = date.format("HH:mm:ss");

                    return res;
                });
                this.$auth.$storage.setLocalStorage('cart',cartData);
            }
            
            this.getStoreItemFromLocalStorage();
            this.setBookingDetails();
            this.$router.push(checkout);
        },
        setBookingDetails: function(){
            let details = null;
            let total_duration = 0;
            let booking_date = this.$auth.$storage.getLocalStorage("booking_date");
            let booking_time = this.$auth.$storage.getLocalStorage("booking_Time");
            let business = this.$auth.$storage.getLocalStorage("business");
            let cartData = this.$store.state.checkout.cart.data;
            
            if(cartData && (booking_date && booking_time)){
                cartData.forEach(item => {
                    total_duration += item.duration;
                });
                details = {
                    booking_date: moment(booking_date).format("dddd DD MMM, YYYY"),
                    booking_time: moment(booking_date + ' ' +booking_time).format(this.timeFormat(business)),
                    duration: total_duration
                }
            }

            this.$root.$emit('booking_details', details);
        }
    }
}
</script>

<style lang="scss" scoped>
.branch_time {
    box-shadow: 0px 4px 30px rgb(0 0 0 / 10%);
}
.calender-area{
    width: 100%;
    margin: auto;
    display: block !important;
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
    z-index: 1;
    p {
        color: #000;
        font-size: 20px;
    }
    .month {
        padding-left: 50px;
        @media (max-width:767px) {
            padding-left: 0;
        }
    }
    .day-list{
        .list-item{
            padding: 35px 5px 0;
            @media (max-width:1080px) {
                padding: 35px 6px 0;
            }
            @media (max-width:1080px) {
                padding: 35px 6px 0;
            }
            strong {
                font-size: 20px;
                color: #000;
            }
            .box{
                display: flex;
                flex-direction: column;
                -webkit-box-pack: center;
                justify-content: center;
                -webkit-box-align: center;
                align-items: center;
                outline: none;
                background: none;
                border: 1px solid rgba(0, 0, 0, 0.2);
                border-radius: 3px;
                height: 47px;
                width: 47px;
                padding: 10px 5px;
                cursor: pointer;
                transition: background-color 300ms ease 0s;
                @media (max-width:1080px) {
                    height: 43px;
                    width: 43px;
                }
                @media (max-width:940px) {
                    height: 38px;
                    width: 38px;
                }
                @media (max-width:767px) {
                    height: 64px;
                    width: 64px;
                }
                &:hover,&.active{
                    transition: background-color 300ms ease 0s, border-color 300ms ease 0s;
                    border-color: #0C56C9;
                    background-color: #0C56C9;
                    .date {
                        color: white;
                    }
                    .day {
                        color: white;
                    }
                }
                &.disabled{
                    background: #F2F2F7;
                    .date {
                        color: rgba(38, 57, 87, 0.6);
                    }
                    .day {
                        color: rgba(38, 57, 87, 0.6);
                    }
                }
                &.disabled:hover{
                    // border-color:rgb(213, 215, 218);
                    border: none;
                    .date {
                        color: rgba(38, 57, 87, 0.6);
                    }
                    .day {
                        color: rgba(38, 57, 87, 0.6);
                    }
                }
                .day{
                    letter-spacing: 0px;
                    margin: 0px;
                    min-width: 0px;
                    font-size: 15px;
                    font-weight: 700;
                    line-height: 21px;
                    color: rgba(0, 0, 0, 0.5);
                    @media (max-width:1080px) {
                        font-size: 12px;
                        line-height: 15px;
                    }
                    @media (max-width:767px) {
                        font-size: 12px;
                        line-height: 15px;
                    }
                }
                .date{
                    letter-spacing: 0px;
                    margin: 0px;
                    min-width: 0px;
                    font-size: 15px;
                    font-weight: 600;
                    line-height: 20px;
                    color: rgba(0, 0, 0, 0.5);
                    @media (max-width:1080px) {
                        font-size: 12px;
                        line-height: 20px;
                    }
                    @media (max-width:767px) {
                        font-size: 16px;
                        line-height: 20px;
                    }
                }
            }
        }
    }
}
.timings-list {
    .b-overlay-wrap {
        min-height: 350px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
    }
    @media (max-width:767px) {
        padding-top: 30px;
    }
    .full-name{
        .name{
            letter-spacing: 0px;
            margin: 0px;
            min-width: 0px;
            font-size: 18px;
            font-weight: 600;
            line-height: 24px;
            color: #000;
        }
        .title{
            letter-spacing: 0px;
            margin: 0px;
            min-width: 0px;
            font-size: 15px;
            font-weight: 400;
            line-height: 21px;
            color: rgba(0, 0, 0, 0.5);
        }
    }
    .next {
         svg {
            color: #000;
            }
    }
}
.close-box{
    padding: 12px 8px 48px;
    svg{
        width: 67px;
    }
    .close-title{
        margin: 24px 0px 0px;
        font-size: 20px;
        font-weight: 700;
        line-height: 28px;
    }
    .close-msg{
        letter-spacing: 0px;
        margin: 8px 0px 0px;
        min-width: 0px;
        font-size: 17px;
        font-weight: 400;
        line-height: 24px;
        color: rgb(135, 140, 147);
    }
    .btn{
        margin-top: 24px;
        min-width: 170px;
        font-size: 17px;
        font-weight: 700;
        line-height: 24px;
        display: flex;
        -webkit-box-flex: 1;
        flex-grow: 1;
        -webkit-box-align: center;
        align-items: center;
        -webkit-box-pack: center;
        justify-content: center;
        text-align: center;
        padding: 11px 15px;
        border: 1px solid transparent;
        border-radius: 4px;
        min-height: 48px;
    }
}
</style>