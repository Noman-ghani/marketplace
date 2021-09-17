<template>
    <b-overlay :show="loader" class="container" variant="transparent">
        <div v-if="!loader">
            <div class="appointments" v-if="appointments.length > 0">
                <div class="left-sidebar d-flex">
                    <div class="appointment-list">
                        <div class="upcoming-app">
                            <h2 class="my-app" v-if="$screen.width < 768">My Appointments</h2>
                            <div class="status">
                                <p class="app-status">Upcoming Appointments <span></span></p>
                            </div>
                            <VueSlickCarousel ref="slick" v-bind="settings" class="pr-4 upcoming">
                                <template v-for="(app,idx) in appointments">
                                    <div class="app-item cursor-pointer d-flex" v-if="app.upcomming" :key="idx" @click="selectAppiontment(app.id)">
                                                <div class="uapp-status" v-if="$screen.width < 768">
                                                    <div class="status">
                                                        <svg class="Icon-c98r68-0 gHTbBq Icon-c98r68-1 hFwlVf" width="16" height="16"><g fill="#FFF" fill-rule="evenodd"><path d="M6.7 6.3c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4l2 2c.2.2.4.3.7.3.3 0 .5-.1.7-.3l7-7c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0L8 7.6 6.7 6.3z"></path><path d="M8 15c3.9 0 7-3.1 7-7 0-.6-.4-1-1-1s-1 .4-1 1c0 2.8-2.2 5-5 5s-5-2.2-5-5 2.2-5 5-5c.6 0 1.1.1 1.7.3.5.2 1.1-.1 1.3-.6.2-.5-.1-1.1-.6-1.3C9.6 1.1 8.8 1 8 1 4.1 1 1 4.1 1 8s3.1 7 7 7z"></path></g></svg>
                                                        <p class="status-txt">{{app.status}}</p>
                                                    </div>
                                                </div>
                                                <div class="d-flex flex-column flex-grow-0 branch-img mr-3" v-if="$screen.width >= 768">
                                                    <div class="inner" :style="'background-image:url('+app.branch.profile_image+');'">
                                                        <div class="check-icon"><svg class="Icon-c98r68-0 focnmT Icon-c98r68-1 hFwlVf" width="16" height="16"><g fill="rgb(3, 122, 255)" fill-rule="evenodd"><path d="M6.7 6.3c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4l2 2c.2.2.4.3.7.3.3 0 .5-.1.7-.3l7-7c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0L8 7.6 6.7 6.3z"></path><path d="M8 15c3.9 0 7-3.1 7-7 0-.6-.4-1-1-1s-1 .4-1 1c0 2.8-2.2 5-5 5s-5-2.2-5-5 2.2-5 5-5c.6 0 1.1.1 1.7.3.5.2 1.1-.1 1.3-.6.2-.5-.1-1.1-.6-1.3C9.6 1.1 8.8 1 8 1 4.1 1 1 4.1 1 8s3.1 7 7 7z"></path></g></svg></div>
                                                    </div>
                                                </div>
                                                <div class="apt-detail">
                                                    <p class="booking-time">{{formatDateTime(app.booking_date,app.items[0].start_time,app.business)}}</p>
                                                    <p class="branch-name">{{app.branch.name}}</p>
                                                    <p class="services-short-name">
                                                        {{app.serviceTitles.toString()}}
                                                    </p>
                                                </div>
                                    </div>
                                    <template v-else>
                                        <div :key="idx" v-if="idx == 0" class="status">
                                            <p class="m-0">No upcoming appointment for now.</p>
                                            <p class="m-0">
                                                Have fun making some! Any booking you make will show up here.
                                            </p>
                                        </div>
                                    </template>
                                </template>
                            </VueSlickCarousel>
                        </div>
                        <div class="past-app">
                            <div class="status mt-4">
                                <p class="app-status" v-if="$screen.width >= 768">Past Appointments <span></span></p>
                                <p class="app-status" v-if="$screen.width < 768">Past<span></span></p>
                            </div>
                            <div class="pr-4">
                                <template v-for="(app,idx) in appointments">
                                    <div class="app-item cursor-pointer d-flex" v-if="app.past" :key="idx" @click="selectAppiontment(app.id)">
                                            <div class="d-flex flex-column flex-grow-0 branch-img mr-3">
                                                <div class="inner" :style="'background-image:url('+app.branch.profile_image+');'">
                                                    <div class="check-icon"><svg class="Icon-c98r68-0 focnmT Icon-c98r68-1 hFwlVf" width="16" height="16"><g fill="rgb(3, 122, 255)" fill-rule="evenodd"><path d="M6.7 6.3c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4l2 2c.2.2.4.3.7.3.3 0 .5-.1.7-.3l7-7c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0L8 7.6 6.7 6.3z"></path><path d="M8 15c3.9 0 7-3.1 7-7 0-.6-.4-1-1-1s-1 .4-1 1c0 2.8-2.2 5-5 5s-5-2.2-5-5 2.2-5 5-5c.6 0 1.1.1 1.7.3.5.2 1.1-.1 1.3-.6.2-.5-.1-1.1-.6-1.3C9.6 1.1 8.8 1 8 1 4.1 1 1 4.1 1 8s3.1 7 7 7z"></path></g></svg></div>
                                                </div>
                                            </div>
                                            <div class="apt-detail">
                                                <p class="booking-time">{{formatDateTime(app.booking_date,app.items[0].start_time,app.business)}}</p>
                                                <p class="branch-name">{{app.branch.name}}</p>
                                                <p class="services-short-name">
                                                    {{app.serviceTitles.toString()}}
                                                </p>
                                            </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="right-area" ref="rightArea">
                    <div class="appointment-wrapper d-flex flex-column flex-grow-1" v-if="selectedAppointment">
                        <span class="app-close" v-if="$screen.width < 768" @click="closeApp">
                            <b-icon-x />
                        </span>
                        <div class="banner-top">
                            <p class="appointment-details-date">
                                {{formatDateTime(selectedAppointment.booking_date,selectedAppointment.items[0].start_time,selectedAppointment.business)}}
                            </p>
                            <div class="status" :style="selectedAppointment.status == 'cancelled' ? 'background:#da2346' : ''">
                                <svg class="Icon-c98r68-0 gHTbBq Icon-c98r68-1 hFwlVf" width="16" height="16"><g fill="#FFF" fill-rule="evenodd"><path d="M6.7 6.3c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4l2 2c.2.2.4.3.7.3.3 0 .5-.1.7-.3l7-7c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0L8 7.6 6.7 6.3z"></path><path d="M8 15c3.9 0 7-3.1 7-7 0-.6-.4-1-1-1s-1 .4-1 1c0 2.8-2.2 5-5 5s-5-2.2-5-5 2.2-5 5-5c.6 0 1.1.1 1.7.3.5.2 1.1-.1 1.3-.6.2-.5-.1-1.1-.6-1.3C9.6 1.1 8.8 1 8 1 4.1 1 1 4.1 1 8s3.1 7 7 7z"></path></g></svg>
                                <p class="status-txt">{{selectedAppointment.status}}</p>
                            </div>
                            <div class="branch-details">
                                <div class="branch d-flex">
                                    <div class="d-flex flex-column flex-grow-0 branch-img mr-3">
                                        <div class="inner m-0" :style="'background-image:url('+selectedAppointment.branch.profile_image+');'">
                                        </div>
                                    </div>
                                    <div class="location-data">
                                        <p class="location-name">{{selectedAppointment.branch.name}}</p>
                                        <p class="location-address">{{selectedAppointment.branch.address}}</p>
                                    </div>
                                </div>
                                <div class="appoint-options d-flex">
                                    <a :href="'https://www.google.com/maps?daddr='+selectedAppointment.branch.address" target="_blank" class="box d-flex flex-column justify-content-between align-items-center">
                                        <div class="icon-box d-flex align-items-center justify-content-center"><div class="visualLayer"></div><b-icon-geo-alt font-scale="1.5"/></div>
                                        <p class="tag pt-1">Directions</p>
                                    </a>
                                    <!-- <div class="box d-flex flex-column justify-content-between align-items-center">
                                        <div class="icon-box d-flex align-items-center justify-content-center"><div class="visualLayer"></div> <b-icon-calendar2-week font-scale="1.2"/> </div>
                                        <p class="tag pt-1">Reschedule</p>
                                    </div>
                                    <div class="box d-flex flex-column justify-content-between align-items-center">
                                        <div class="icon-box d-flex align-items-center justify-content-center"><div class="visualLayer"></div><b-icon-x-circle font-scale="1.3" /> </div>
                                        <p class="tag pt-1">Cancel</p>
                                    </div> -->
                                </div>
                            </div>
                        </div>
                        <div class="banner-bottom">
                            <div class="services">
                                <div class="service-list">
                                    <template v-for="(data,idx) in selectedAppointment.items">
                                        <div class="list-item d-flex" :key="idx">
                                            <div class="d-flex flex-column flex-grow-1">
                                                <p class="title">
                                                    {{data.service.title}}
                                                </p>
                                                <p class="duration">
                                                    {{$auth.user.durations.filter(duration => duration.value == data.duration)[0].text}}
                                                </p>
                                            </div>
                                            <div class="price-list ml-4 d-flex flex-column flex-grow-0">
                                                <p class="price title">{{selectedAppointment.business.country.currency}} {{data.price | currency}}</p>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                                <div class="service-list border-0 m-0 p-0">
                                    <div class="list-item d-flex pb-0 border-bottom-0" v-if="totalTaxes">
                                        <div class="d-flex flex-grow-1">
                                            <p class="duration">
                                                Taxes
                                            </p>
                                        </div>
                                        <div class="price-list ml-4 d-flex flex-column flex-grow-0">
                                            <p class="duration">
                                                {{selectedAppointment.business.country.currency}} {{totalTaxes | currency}}
                                            </p>
                                        </div>
                                    </div>
                                    <div class="list-item d-flex pt-2">
                                        <div class="d-flex flex-grow-1">
                                            <p class="title">
                                                Total
                                            </p>
                                        </div>
                                        <div class="price-list ml-4 d-flex flex-column flex-grow-0">
                                            <p class="price title">
                                                {{selectedAppointment.business.country.currency}} {{grandTotal | currency}}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <div v-if="!loader" class="d-flex flex-column justify-content-center align-items-center" style="min-height:50vh">
                    <img src="/images/not-found.png" alt="Not Found" class="mt-4 mb-4" style="max-width:180px;">
                    <h3>No Appointment Booked</h3> 
                </div>
            </div>
        </div>
    </b-overlay>
</template>
<script>
import moment from "moment";

export default {
    data(){
        return{
            loader:true,
            appointments: [],
            showStatus: false,
            selectedAppointment: null,
            settings: {
                "responsive": [
                    {
                    "breakpoint": 40960,
                    "settings": "unslick",
                    },
                    {
                    "breakpoint": 767,
                    "settings": {
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            infinte: true,
                            centerMode: true,
                            centerPadding: '40px',
                            draggable: false,
                        }
                    }
                ]
            },
            form:{
                customer_id: null
            }
        }
    },
    computed:{
        taxData: function () {
            let taxes = []
            if (this.selectedAppointment.items.length > 0) {
                this.selectedAppointment.items.forEach(cart => {
                    const price = cart.price
                    if (cart.tax) {
                        if (cart.tax.rate) {
                            let taxRow = taxes.filter(row => row.id == cart.tax.id)
                            
                            if (taxRow.length) {
                                taxRow[0].amount += parseFloat(this.calculateTax(cart.tax.rate, price))
                            } else {
                                taxes.push({id: cart.tax.id, title: cart.tax.title, rate: cart.tax.rate, amount: parseFloat(this.calculateTax(cart.tax.rate, price))})
                            }
                        } else {
                            if (cart.tax.tax_1) {
                                let tmp_tax_1 = taxes.filter(row => row.id == cart.tax.tax_1.id);
                                if(tmp_tax_1.length){
                                    tmp_tax_1[0].amount += parseFloat(this.calculateTax(cart.tax.tax_1.rate, price))
                                }else{
                                    taxes.push({id: cart.tax.tax_1.id, title: cart.tax.tax_1.title, rate: cart.tax.tax_1.rate, amount: parseFloat(((cart.tax.tax_1.rate / 100) * price))})
                                }
                            }
                            
                            if (cart.tax.tax_2) {
                                let tmp_tax_2 = taxes.filter(row => row.id == cart.tax.tax_2.id);
                                if(tmp_tax_2.length){
                                    tmp_tax_2[0].amount += parseFloat(this.calculateTax(cart.tax.tax_2.rate, price))
                                }else{
                                    taxes.push({id: cart.tax.tax_2.id, title: cart.tax.tax_2.title, rate: cart.tax.tax_2.rate, amount: parseFloat(((cart.tax.tax_2.rate / 100) * price))})
                                }
                            }
                            if (cart.tax.tax_3) {
                                let tmp_tax_3 = taxes.filter(row => row.id == cart.tax.tax_3.id);
                                if(tmp_tax_3.length){
                                    tmp_tax_3[0].amount += parseFloat(this.calculateTax(cart.tax.tax_3.rate, price))
                                }else{
                                    taxes.push({id: cart.tax.tax_3.id, title: cart.tax.tax_3.title, rate: cart.tax.tax_3.rate, amount: parseFloat(((cart.tax.tax_3.rate / 100) * price))})
                                }
                            }
                        }
                    }
                })
            }
            return taxes
        },
        totalTaxes: function () {
            let totalTax = 0;
            if(this.taxData.length > 0){
                this.taxData.forEach(res => {
                    totalTax += res.amount;
                })
            }
            return totalTax;
        },
        grandTotal: function () {
            let total = 0;
            
            if(this.selectedAppointment.items){
                this.selectedAppointment.items.forEach(cart => {
                    total +=  parseFloat(cart.price);
                })
            }
            if (!this.selectedAppointment.business.is_tax_inclusive) {
                // add tax 
                if(this.taxData){
                    this.taxData.forEach(tax => {
                        total += tax.amount
                    })
                }
            }
            return total
        },
    },
    created: function() {
        if(this.$auth.loggedIn){
            this.form.customer_id = this.$auth.user.id
            this.$axios.get('/appointments/all',{params: this.form})
            .then(res => {
                let currentTime = moment();
                let data = res.data.filter(data => {
                    let bookingTime = moment(data.booking_date + ' ' +data.items[0].start_time);
                    if(bookingTime.diff(currentTime, 'hours') >= 0){
                        data.upcomming = true;
                    }

                    if(bookingTime.diff(currentTime, 'hours') < 0){
                        data.past = true; 
                    }
                    data.booking_date = bookingTime.format("DD MMM YYYY");

                    data.serviceTitles = data.items.map( function( el ){ 
                        return el.service.title; 
                    });
                    return data;
                });
                this.appointments = data;

                this.selectAppiontment(data[0].id);
                this.loader = false
            }).catch(err => {
                this.loader = false
                console.log(err);
            });
            
        }else{
            this.$router.replace("/");
        }
    },
    methods: {
        selectAppiontment: function (id) {
            this.appointments.filter(res => {
                if(res.id == id){
                    this.selectedAppointment = res;
                }
                return res;
            });
            this.$router.push({path: this.$route.path, query: { appointment: id }});
            if(this.$screen.width < 767){
                this.$refs.rightArea.style.display = "flex"
            }
        },
        closeApp: function (){
           if(this.$screen.width < 767){
                this.$refs.rightArea.style.display = "none"
            } 
        }
    }
}
</script>

<style lang="scss" scoped>
.container {
    @media (max-width:767px) {
        padding: 0;
    }
}
.appointments{
    display: grid;
    -webkit-box-flex: 1;
    flex-grow: 1;
    grid-template-columns: repeat(12, 1fr);
    gap: 30px;
    @media (max-width:767px) {
        display: block;
    }
    .left-sidebar {
        min-height: 0px;
        min-width: 0px;
        grid-column-end: span 4;
        flex-direction: column;
        // @media (max-width:767px) {
        //     display: none !important;
        // }
        .appointment-list {
            position: sticky;
            top: 2.6rem;
            height: calc(100vh - 5rem);
            overflow: auto;
            margin: 0px -16px 0px -32px;
            padding: 0px 0px 0 16px;
            @media (max-width:767px) {
                margin: 0;
                padding: 0;
            }
            .my-app {
                color: #000;
                font-size: 25px;
                line-height: 31px;
                font-weight: 800;
                padding-bottom: 20px;
                padding-top: 40px;
            }
            .status{
                padding: 40px 16px 16px;
                @media (max-width:767px) {
                    padding: 0px 0px 16px;
                }
                .app-status{
                    letter-spacing: 0px;
                    margin: 0px;
                    min-width: 0px;
                    font-size: 27px;
                    font-weight: 800;
                    line-height: 33px;
                    color: #000;
                    @media (max-width:980px) {
                        font-size: 20px;
                        line-height: 25px;
                    }
                }
            }
            .app-item{
                // box-shadow: 0 21px 0 -20px rgb(16 25 40 / 10%);
                border-bottom: 1.5px solid rgba(38, 57, 87, 0.15);
                margin: 2px 0px;
                padding: 16px;
                transition: background-color 300ms ease 0s, transform 300ms ease 0s;
                @media (max-width:980px) {
                    padding-right: 0;
                }
                &:hover{
                    border-radius: 10px;
                    border-bottom: none;
                    background-color: rgb(255, 255, 255);
                    box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.1);
                    transition: background-color 300ms ease 0s, transform 300ms ease 0s;
                }
                .branch-total {
                    p {
                        font-size: 17px;
                        line-height: 21px;
                        color: rgba(38, 57, 87, 0.9);
                        font-weight: 700;
                        margin: 0;
                        padding: 20px 16px 10px;   
                        border-top: 1.5px solid rgba(38, 57, 87, 0.15);
                        margin-top: 20px;
                    }
                }
            }
            .upcoming {
                .slick-active{
                    padding:0 10px;
                }
                .app-item{
                    @media (max-width:767px) {
                        display: block !important;
                        background: #FFFFFF;
                        box-shadow: 0px 4px 29px rgb(0 0 0 / 15%);
                        border-radius: 5px;
                        padding: 16px 0;
                        margin-bottom: 30px;
                    }
                    .uapp-status {
                        width: 100%;
                        @media (max-width:767px) {
                            padding: 0 16px;
                        }
                    }
                    .apt-detail {
                        @media (max-width:767px) {
                            padding: 0 16px;
                        }
                    }
                    .status{
                        display: inline-flex;
                        height: 28px;
                        border-radius: 16px;
                        padding: 0px 16px 0px 8px;
                        margin:15px 0px 20px;
                        -webkit-box-align: center;
                        align-items: center;
                        background-color: #0C56C9;
                        .status-txt{
                            letter-spacing: 0px;
                            margin: 0px 0px 0px 8px;
                            min-width: 0px;
                            font-size: 14px;
                            font-weight: 700;
                            line-height: 18px;
                            color: white;
                            text-transform: capitalize;
                        }
                    }
                    .branch-img {
                        @media (max-width:767px) {
                            float: right;
                            .inner {margin: 0;}
                        }
                    }
                }
            }
            .upcoming-app {
                @media (max-width:767px) {
                    background: #EEF3FB;
                    padding: 0 15px 20px;
                    .pr-4{
                        padding: 0 !important;
                    }
                }
            }
            .past-app {
                @media (max-width:767px) {
                    padding: 0 15px;
                    .pr-4{
                        padding: 0 !important;
                    }
                }
            }
        }
    }
    .right-area{
        min-height: 0px;
        min-width: 0px;
        grid-column-end: span 8;
        flex-direction: column;
        padding-top: 32px;
        padding-bottom: 50px;
        @media (max-width:767px) {
            padding-top: 0;
            position: fixed;
            width: 100%;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 11;
            display: none;
            padding-bottom: 0;
        }
        .appointment-wrapper{
            @media (max-width:767px) {
                height: 100%;
            }
            .app-close {
                position: absolute;
                right: 10px;
                top: 10px;
                svg {
                    color: white;
                    width: 25px;height: 25px;
                }
            }
            .banner-top{
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                flex-shrink: 0;
                background-color: #0C56C9;
                padding: 40px;
                @media (max-width:767px) {
                    padding: 40px 20px;
                }
                .appointment-details-date{
                    letter-spacing: 0px;
                    margin: 0px;
                    min-width: 0px;
                    font-size: 30px;
                    font-weight: 800;
                    line-height: 38px;
                    color: rgb(255, 255, 255);
                    @media (max-width:980px) {
                        font-size: 25px;
                        line-height: 31px;
                    }
                }
                .status{
                    display: inline-flex;
                    height: 28px;
                    border-radius: 16px;
                    padding: 0px 16px 0px 8px;
                    margin:15px 0px 32px;
                    -webkit-box-align: center;
                    align-items: center;
                    background-color: #0C56C9;
                    border:1px solid #FFF;
                    .status-txt{
                        letter-spacing: 0px;
                        margin: 0px 0px 0px 8px;
                        min-width: 0px;
                        font-size: 14px;
                        font-weight: 700;
                        line-height: 18px;
                        color: white;
                        text-transform: capitalize;
                    }
                }
                .branch-details{
                    display: flex;
                    align-self: stretch;
                    -webkit-box-pack: justify;
                    justify-content: space-between;
                    flex-direction: row;
                    @media (max-width:980px) {
                        display: block;
                    }
                    .branch {
                        @media (max-width:980px) {
                            margin-bottom: 40px;
                        }
                        @media (max-width:767px) {
                            flex-direction: row-reverse;
                            justify-content: space-between;
                            margin-bottom: 40px;
                        }
                    }
                    .branch-img{
                        @media (max-width:767px) {
                            margin-right: 0 !important;
                        }
                        .inner{
                            border: 2px solid white;
                            border-radius: 10px;
                        }
                    }
                    .location-data{
                        .location-name{
                            letter-spacing: 0px;
                            margin: 0px;
                            min-width: 0px;
                            font-size: 20px;
                            font-weight: 800;
                            line-height: 24px;
                            color: rgb(255, 255, 255);
                            overflow-wrap: break-word;
                            margin-bottom: 5px;
                            text-transform: capitalize;
                            @media (max-width:767px) {
                                font-size: 16px;
                                margin-bottom: 0;
                            }
                        }
                        .location-address{
                            letter-spacing: 0px;
                            margin: 0px;
                            min-width: 0px;
                            font-size: 15px;
                            font-weight: 400;
                            line-height: 21px;
                            color: rgba(255, 255, 255, 0.7);
                            overflow-wrap: break-word;
                            text-transform: capitalize;
                            @media (max-width:767px) {
                                font-size: 12px;
                            }
                        }
                    }
                }
                .appoint-options{
                    align-items: flex-start;
                    @media (max-width:980px) {
                            align-items: flex-start;
                            justify-content: center;
                    }
                    .box{
                        margin-left: 25px;
                        @media (max-width:980px) {
                            margin-left: 20px;
                            margin-right: 20px;
                        }
                        .icon-box{
                            padding: 11px 12px;
                            width: 52px;
                            height: 52px;
                            border-radius: 9px;
                            background: rgba(255, 255, 255, 0.2);
                            margin-bottom: 5px;
                            svg{
                                color: rgb(255, 255, 255);
                                width: 22px;
                                height: 22px;
                            }
                        }
                    .tag{
                        letter-spacing: 0px;
                        margin: 0px;
                        min-width: 0px;
                        font-size: 15px;
                        font-weight: 600;
                        line-height: 21px;
                        color: rgb(255, 255, 255);
                        @media (max-width:767px) {
                            font-size: 14px;
                        }
                    }
                    }
                }
            }
            .banner-bottom{
                padding: 0px 40px 40px;
                background: linear-gradient(#0C56C9 70px, transparent 70px);
                margin-top: -1px;
                @media (max-width:767px) {
                    padding: 0;
                    background: none;
                    margin-top: 0;
                    height: 100%;
                }
                .services{
                    background: #FFFFFF;
                    box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.1);
                    border-radius: 10px;
                    padding: 12px 0px;
                    border-bottom: none;
                    @media (max-width:767px) {
                        padding: 12px 20px;
                        background: #EEF3FB;
                        box-shadow: none;
                        border-radius: 0;
                        height: 100%;
                    }
                    .service-list{
                        border-bottom: 1.5px solid rgba(38, 57, 87, 0.15);
                        padding-bottom: 20px;
                        .list-item{
                            padding: 12px 24px;
                            @media (max-width:767px) {
                                padding: 12px 0;
                            }
                            .title{
                                letter-spacing: 0px;
                                margin: 0px;
                                min-width: 0px;
                                font-size: 17px;
                                font-weight: 700;
                                line-height: 24px;
                                color: #000;
                                overflow-wrap: break-word;
                                margin-bottom: 4px;
                                @media (max-width:767px) {
                                    font-size: 16px;
                                    line-height: 20px;
                                }
                            }
                            .duration{
                                letter-spacing: 0px;
                                margin: 0px;
                                min-width: 0px;
                                font-size: 15px;
                                font-weight: 600;
                                line-height: 21px;
                                color: rgba(0, 0, 0, 0.5);
                            }
                            .price-list {
                                .title {
                                    font-size: 18px;
                                    @media (max-width:767px) {
                                        font-size: 16px;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

</style>
<style lang="scss">
.upcoming {
    .slick-active{
        padding:0 10px;
    }
}
</style>