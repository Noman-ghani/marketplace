<template>
    <div>
    <b-overlay :show="deals_loader" variant="transparent" class="loader-height-wrap">
        <div class="container p-0" v-if="branch">
            <b-card no-body class="mt-4 deals-detail">
            <b-row no-gutters>
                <div class="branch-detail pl-3 pr-3">
                    <div :class="'w-100 ' + ($screen.width < 768 ? 'pt-4' : 'p-4' )">
                        <h2 class="title">{{branch.name}}</h2>
                        <p class="address mb-4">{{completeAddress}}</p>
                        <nuxt-link :to="$route.params.branch_slug+'/booking'" class="btn btn-primary booknow-mob" v-if="(categories && categories.length > 0) && !business_expire">Book Now</nuxt-link>
                        <b-button v-else disabled variant="secondary" class="w-100 booknow-mob">Book Now</b-button>
                        <ul class="social-icons d-flex justify-content-center align-items-center m-0 pt-4" v-if="business.website || business.facebook || business.linkedin || business.instagram">
                            <li class="icon ml-1 mr-1 web" v-if="business.website">
                                <a :href="business.website" target="_blank">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 92 92"><path d="M46 0C20.6 0 0 20.6 0 46s20.6 46 46 46 46-20.6 46-46S71.4 0 46 0zm3.7 83.8c-.2 0-.4 0-.7.1V62.2c5.2-.1 9.9-.2 14.2-.5-3.8 11.7-10.9 19.5-13.5 22.1zm-7.4 0c-2.7-2.7-9.7-10.5-13.5-22.1 4.2.3 9 .5 14.2.5v21.7c-.2 0-.4-.1-.7-.1zM8 46c0-2.5.3-5 .7-7.4 2.2-.4 6.4-1 12.3-1.6-.5 2.9-.8 5.9-.8 9.1 0 3.2.3 6.2.7 9-5.8-.6-10.1-1.2-12.3-1.6-.3-2.5-.6-5-.6-7.5zm18.3 0c0-3.4.4-6.6 1-9.6 4.6-.3 9.8-.6 15.7-.6v20.4c-5.8-.1-11.1-.3-15.8-.7-.5-2.9-.9-6.1-.9-9.5zM49.6 8.2c2.7 2.7 9.6 10.7 13.5 22.1-4.2-.3-8.9-.5-14.1-.5V8.1c.2 0 .4.1.6.1zM43 8.1v21.7c-5.2.1-9.9.2-14.1.5 3.8-11.4 10.8-19.4 13.4-22.1.3 0 .5-.1.7-.1zm6 48.1V35.8c5.8.1 11.1.3 15.7.6.6 3 1 6.2 1 9.6 0 3.4-.3 6.6-.9 9.6-4.6.3-9.9.5-15.8.6zM70.9 37c5.9.6 10.1 1.2 12.3 1.6.5 2.4.8 4.9.8 7.4s-.3 5-.7 7.4c-2.2.4-6.4 1-12.3 1.6.5-2.9.7-5.9.7-9.1 0-3-.3-6.1-.8-8.9zm10.5-4.8c-2.8-.4-6.8-.9-11.9-1.4-2.4-8.6-6.6-15.5-10.1-20.4 10.1 3.8 18.1 11.8 22 21.8zM32.6 10.4c-3.6 4.8-7.7 11.7-10.1 20.3-5 .4-9 1-11.9 1.4 3.9-9.9 12-17.9 22-21.7zm-22 49.4c2.8.4 6.8.9 11.8 1.4 2.4 8.6 6.4 15.5 10 20.3-10-3.9-17.9-11.8-21.8-21.7zm49 21.7c3.6-4.8 7.6-11.6 10-20.2 5-.4 9-1 11.8-1.4-3.9 9.8-11.8 17.7-21.8 21.6z"/></svg>
                                </a>
                            </li>
                            <li class="icon ml-1 mr-1 facebook" v-if="business.facebook">
                                <a :href="business.facebook" target="_blank">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24"><path d="M15.12,5.32H17V2.14A26.11,26.11,0,0,0,14.26,2C11.54,2,9.68,3.66,9.68,6.7V9.32H6.61v3.56H9.68V22h3.68V12.88h3.06l.46-3.56H13.36V7.05C13.36,6,13.64,5.32,15.12,5.32Z"/></svg>
                                </a>
                            </li>
                            <li class="icon ml-1 mr-1 linkedin" v-if="business.linkedin">
                                <a :href="business.linkedin" target="_blank">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" viewBox="0 0 32 32"><path d="M2.064 10H8v22H2.064zm18.11.002c-2.174 0-3.258 1.036-4.174 1.738V10h-5.968v22H16V18.15s-.218-2.758 3.088-2.758c1.992 0 2.912 1.134 2.912 2.758V32h6.288V18.344c0-7.5-6.038-8.342-8.114-8.342zM2 5a3 3 1080 1 0 6 0 3 3 1080 1 0-6 0z"/></svg>
                                </a>
                            </li>
                            <li class="icon ml-1 mr-1 instagram" v-if="business.instagram">
                                <a :href="business.instagram" target="_blank">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 48 48"><path fill-rule="evenodd" d="M524 160c-6.518 0-7.335.028-9.895.144-2.555.117-4.3.523-5.826 1.116-1.578.613-2.917 1.434-4.25 2.768-1.335 1.334-2.156 2.673-2.769 4.251-.593 1.527-1 3.271-1.116 5.826-.116 2.56-.144 3.377-.144 9.895s.028 7.335.144 9.895c.117 2.555.523 4.3 1.116 5.826.613 1.578 1.434 2.917 2.768 4.25 1.334 1.335 2.673 2.156 4.251 2.77 1.527.592 3.271.998 5.826 1.115 2.56.116 3.377.144 9.895.144s7.335-.028 9.895-.144c2.555-.117 4.3-.523 5.826-1.116 1.578-.613 2.917-1.434 4.25-2.768 1.335-1.334 2.156-2.673 2.77-4.251.592-1.527.998-3.271 1.115-5.826.116-2.56.144-3.377.144-9.895s-.028-7.335-.144-9.895c-.117-2.555-.523-4.3-1.116-5.826-.613-1.578-1.434-2.917-2.768-4.25-1.334-1.335-2.673-2.156-4.251-2.769-1.527-.593-3.271-1-5.826-1.116-2.56-.116-3.377-.144-9.895-.144zm0 4.324c6.408 0 7.167.025 9.698.14 2.34.107 3.61.498 4.457.827 1.12.435 1.92.955 2.76 1.795.839.84 1.359 1.64 1.794 2.76.33.845.72 2.116.827 4.456.115 2.53.14 3.29.14 9.698s-.025 7.167-.14 9.698c-.107 2.34-.498 3.61-.827 4.457-.435 1.12-.955 1.92-1.795 2.76-.84.839-1.64 1.359-2.76 1.794-.845.33-2.116.72-4.456.827-2.53.115-3.29.14-9.698.14-6.409 0-7.168-.025-9.698-.14-2.34-.107-3.61-.498-4.457-.827-1.12-.435-1.92-.955-2.76-1.795-.839-.84-1.359-1.64-1.794-2.76-.33-.845-.72-2.116-.827-4.456-.115-2.53-.14-3.29-.14-9.698s.025-7.167.14-9.698c.107-2.34.498-3.61.827-4.457.435-1.12.955-1.92 1.795-2.76.84-.839 1.64-1.359 2.76-1.794.845-.33 2.116-.72 4.456-.827 2.53-.115 3.29-.14 9.698-.14zm0 7.352c-6.807 0-12.324 5.517-12.324 12.324 0 6.807 5.517 12.324 12.324 12.324 6.807 0 12.324-5.517 12.324-12.324 0-6.807-5.517-12.324-12.324-12.324zM524 192a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm15.691-20.811a2.88 2.88 0 1 1-5.76 0 2.88 2.88 0 0 1 5.76 0z" transform="translate(-500 -160)"/></svg>                        
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="detail-img">
                    <b-overlay :show=" /*!categories || categories.length == 0*/ 1 == 2" class="offline-overlay">
                        <b-card-img :src="branch.profile_image" v-if="branch" :alt="branch.name" class="rounded-0"></b-card-img>
                        <template #overlay>
                            <div class="d-flex align-items-center justify-content-center flex-column bg-white text-center p-4" style="width:calc(100% - 40px - 40px)">
                                <svg class="Icon-c98r68-0 dZbhoG Icon-c98r68-1 flJfTH" viewBox="0 0 92 97" width="42px" height="47px"><defs><path d="M56.94 64.06a1.5 1.5 0 00-2.121 0L46 72.88l-8.819-8.819a1.5 1.5 0 10-2.12 2.121L43.878 75l-8.819 8.819a1.5 1.5 0 102.121 2.12L46 77.121l8.819 8.819a1.5 1.5 0 102.12-2.121L48.122 75l8.819-8.819a1.5 1.5 0 000-2.12z" id="a"></path></defs><g fill="none" fill-rule="evenodd"><path d="M87 0a5 5 0 015 5v66a5 5 0 01-5 5H5a5 5 0 01-5-5V5a5 5 0 015-5h82zM26.706 21.5H3V71a2 2 0 002 2l22.09.001A1.494 1.494 0 0126.707 72l-.001-50.5zM89 21.5H29.706V72c0 .385-.144.736-.382 1.001L87 73a2 2 0 002-2V21.5zM87 3H5a2 2 0 00-2 2v13.5h86V5a2 2 0 00-2-2zM13.38 8c1.637 0 2.965 1.343 2.965 3s-1.328 3-2.966 3c-1.637 0-2.965-1.343-2.965-3s1.328-3 2.965-3zM25.24 8c1.638 0 2.966 1.343 2.966 3s-1.328 3-2.966 3c-1.637 0-2.965-1.343-2.965-3s1.328-3 2.965-3z" fill="#101928"></path><circle fill="#adcdff" cx="46" cy="74" r="20"></circle><path d="M46 51c12.703 0 23 10.297 23 23S58.703 97 46 97 23 86.703 23 74s10.297-23 23-23zm0 3c-11.046 0-20 8.954-20 20s8.954 20 20 20 20-8.954 20-20-8.954-20-20-20z" fill="#101928"></path><use fill="#000" xlink:href="#a"></use></g></svg>
                                <h2>Bookings Offline</h2>
                                <p>{{branch.name}} is not listed on ServU anymore. But fear not, we have other similar places near you</p>
                            </div>
                        </template>
                    </b-overlay>
                </div>
            </b-row>
            </b-card>

            <b-row class="about-detail">
            <b-col md="8 pl-0 pr-0" >
                <h3 class="pt-4" v-if="$screen.width >= 768">About {{branch.name}}</h3>
                <div hidden>
                    <span class="first">Instant Confirmation</span>
                    <span class="middle">Unisex</span>
                    <span class="last">Pay by App</span>
                </div>
                <p v-if="branch.description">{{branch.description}}</p>
                <p v-else>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
            </b-col>
            <b-col md="4" class="pl-0 pr-0">
                <h3 class="pt-4" v-if="$screen.width >= 768">Location</h3>
                <div class="d-flex w-auto location-wrap justify-content-between">
                    <div>
                        <p>{{completeAddress}}</p>
                        <a :href="'tel:+'+business.country.phone_code+branch.phone_number" class="phone-number">+{{business.country.phone_code}} {{branch.phone_number | VMask(business.country.phone_mask)}}</a>
                    </div>
                    <a :href="'https://www.google.com/maps/search/'+completeAddress" target="_blank">
                        <img src="/images/location.png" alt="map">
                    </a>
                </div>
                <div class="time-slot">
                    <h3 v-if="$screen.width < 768">Time Slot</h3>
                    <b-button v-b-toggle.collapse-l-1 variant="primary" class="time-close">Branch Timings</b-button>
                    <b-collapse id="collapse-l-1" class="mt-2 timings">
                        <p v-for="(time,idx) in branch.timings" :key="'tm-'+idx" class="d-flex justify-content-between">
                            <span>{{time.weekday}}</span> 
                            <span v-if="time.is_closed == 1"><strong>Closed</strong></span>
                            <span v-else> {{time.starts_at}} - {{time.ends_at}}</span>
                        </p>
                    </b-collapse>
                </div>
            </b-col>
            </b-row>

            <section v-if="(categories && categories.length > 0) && !business_expire" class="mb-4">
                <h1>Services</h1>

                <b-tabs lazy vertical justified class="bussiness-services" v-if="$screen.width >= 768">
                    <template v-for="(category,idx) in categories">
                        <b-tab 
                            v-if="category.services && category.services.length > 0" 
                            :key="idx"
                            :title-link-class="(category.services && category.services.length > 0) ? ' has' : 'zero'">
                            <template #title >
                                <strong>{{category.title}}</strong> 
                                <b-badge variant="light" class="ml-2">{{category.services.length}}</b-badge>
                            </template>
                            <template v-for="(service,idx) in category.services">
                                <div :key="idx" class="services d-flex align-items-center flex-wrap"  v-if="service.enable_online_booking">
                                    <template v-if="service.pricings.length > 1">
                                        <b-icon-three-dots v-b-toggle="'collapse-'+idx" class="cursor-pointer"/>
                                        <div class="mb-0 flex-grow-1 d-flex justify-content-between align-items-center">
                                            <p class="service-title m-0">{{service.title}}</p>
                                            <div class="d-flex flex-column align-items-end">
                                                <div class="font-weight-bold">
                                                    <span v-if="+service.pricings[0].special_price">From {{business.country.currency}} {{service.pricings[0].special_price | currency}}</span>
                                                    <span v-else>From {{business.country.currency}} {{service.pricings[0].price | currency}}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <b-collapse :id="'collapse-'+idx" v-if="service.pricings.length > 1" class="w-100">
                                            <ul class="pl-5 m-0">
                                                <template v-for="(price, idx) in service.pricings">
                                                    <li :key="idx" class="services">
                                                        <nuxt-link :to="$route.params.branch_slug+'/booking?service_id='+service.id+'&pindex='+idx" class="d-flex align-items-center flex-wrap text-dark">
                                                            <b-icon-blank class="cursor-pointer" />
                                                            <div class="mb-0 flex-grow-1 d-flex justify-content-between align-items-center">
                                                                <span class="title">{{price.name}}</span>
                                                                <div class="d-flex flex-column align-items-end">
                                                                    <div class="font-weight-bold">
                                                                        <span v-if="+price.special_price"> {{business.country.currency}} {{price.special_price | currency}}</span>
                                                                        <span v-else> {{business.country.currency}} {{price.price | currency}}</span>
                                                                    </div>
                                                                    <del v-if="+price.special_price">{{business.country.currency}} {{price.price | currency}}</del>
                                                                </div>
                                                            </div>
                                                        </nuxt-link>
                                                    </li>
                                                </template>
                                            </ul>
                                        </b-collapse>
                                    </template>
                                    <nuxt-link :to="$route.params.branch_slug+'/booking?service_id='+service.id+'&pindex='+0" v-else class="d-flex align-items-center m-0 flex-grow-1">
                                        <b-icon-blank />
                                        <div class="mb-0 flex-grow-1 d-flex justify-content-between align-items-center">
                                            <p class="service-title m-0">{{service.title}}</p>
                                            <div class="d-flex flex-column align-items-end">
                                                <div class="font-weight-bold">
                                                    <span v-if="+service.pricings[0].special_price"> {{business.country.currency}} {{service.pricings[0].special_price | currency}}</span>
                                                    <span v-else> {{business.country.currency}} {{service.pricings[0].price | currency}}</span>
                                                </div>
                                                <del v-if="+service.pricings[0].special_price">{{business.country.currency}} {{service.pricings[0].price | currency}}</del>
                                            </div>
                                        </div>
                                    </nuxt-link>
                                </div>
                            </template>
                        </b-tab>
                    </template>
                </b-tabs>
                <div class="bussiness-services" v-else>
                    <ul class="nav-tabs" role="tablist">
                        <template v-for="(category,idx) in categories">
                        <li 
                        v-if="category.services && category.services.length > 0" 
                        :key="idx"
                        :class="'nav-item ' + (category.services.length > 0 ? 'has' : 'zero')" >
                            <div v-b-toggle="'collapse-s-'+idx" role="tab" class="nav-link cursor-pointer">
                                <strong>{{category.title}}</strong> 
                                <b-badge variant="light" class="ml-2">{{category.services.length}}</b-badge> 
                            </div>
                            <b-collapse :id="'collapse-s-'+idx" :visible="idx == 0 ? true : false" class="mt-2" accordion="my-accordion" role="tabpanel">
                                <template v-for="(service,idx) in category.services">
                                    <div :key="idx" class="services d-flex align-items-center flex-wrap pl-0 pr-0">
                                        <template v-if="service.pricings.length > 1">
                                            <b-icon-three-dots v-b-toggle="'collapse-'+idx" class="cursor-pointer"/>
                                            <p class="service-title m-0">{{service.title}}</p>
                                            <b-collapse :id="'collapse-'+idx" v-if="service.pricings.length > 1" class="w-100">
                                                <ul class="pl-0 m-0">
                                                    <template v-for="(price, idx) in service.pricings">
                                                        <li :key="idx" class="services">
                                                            <nuxt-link :to="$route.params.branch_slug+'/booking?service_id='+service.id+'&pindex='+idx" class="d-flex justify-content-between align-items-center text-dark">
                                                                <b-icon-blank class="cursor-pointer" />
                                                                <div class="mb-0 flex-grow-1 d-flex justify-content-between align-items-center">
                                                                    <span class="title">{{price.name}}</span>
                                                                    <div class="d-flex flex-column align-items-end flex-bs-80">
                                                                        <div class="font-weight-bold">
                                                                            <span v-if="+price.special_price" class="price"> {{business.country.currency}} {{price.special_price | currency}}</span>
                                                                            <span v-else class="price"> {{business.country.currency}} {{price.price | currency}}</span>
                                                                        </div>
                                                                        <del class="del" v-if="+price.special_price">{{business.country.currency}} {{price.special_price | currency}}</del>
                                                                    </div>
                                                                </div>
                                                            </nuxt-link>
                                                        </li>
                                                    </template>
                                                </ul>
                                            </b-collapse>
                                        </template>
                                        <nuxt-link :to="$route.params.branch_slug+'/booking?service_id='+service.id+'&pindex='+idx" v-else class="d-flex w-100 justify-content-between align-items-center text-dark">
                                            <b-icon-blank class="cursor-pointer" />
                                            <div class="mb-0 flex-grow-1 d-flex justify-content-between align-items-center">
                                                <span class="service-title">{{service.title}}</span>
                                                <div class="d-flex flex-column align-items-end flex-bs-80">
                                                    <div class="font-weight-bold">
                                                        <span v-if="+service.pricings[0].special_price" class="price"> {{business.country.currency}} {{service.pricings[0].special_price | currency}}</span>
                                                        <span v-else class="price"> {{business.country.currency}} {{service.pricings[0].price | currency}}</span>
                                                    </div>
                                                    <del class="del" v-if="+service.pricings[0].special_price">{{business.country.currency}} {{service.pricings[0].special_price | currency}}</del>
                                                </div>
                                            </div>
                                        </nuxt-link>
                                    </div>
                                </template>
                            </b-collapse>
                        </li>
                        </template>
                    </ul>
                </div>
            </section>

            <nuxt-link :to="$route.params.branch_slug+'/booking'" class="ss-btn pl-3 pr-3" v-if="$screen.width < 768">Show All Services ></nuxt-link>
            <div class="our-staff pt-5 pb-5" v-if="branch.staff && branch.staff.length > 0 && $screen.width >= 768">
                <h3>Our Staffs</h3>
                <div>
                    <VueSlickCarousel ref="slick" v-bind="settings">
                        <template v-for="(data,idx) in branch.staff">
                        <div class="staff-col" :key="'staff-'+idx">
                            <div class="nick-name" :style="'border-color:' + data.staff.appointment_color">
                                <p v-if="!data.staff.profile_image" class="inner d-flex justify-content-center align-items-center">
                                    {{data.staff.first_name.charAt(0)}}{{data.staff.last_name.charAt(0)}}
                                </p>
                                <b-img-lazy :src="data.staff.profile_image" v-else alt="staff"/>
                            </div>
                            <h4>{{data.staff.full_name}}</h4>
                            <p>{{data.staff.staff_title}}</p>
                        </div>
                        </template>
                    </VueSlickCarousel>
                </div>
            </div>
        </div>
    </b-overlay>
        <div class="bussiness_deals related-deals" v-if="deals && deals.length > 0">
            <div class=" bd-heading container">
                <h2>Related Deals</h2>
                <nuxt-link to="/deals" class="sa-btn" v-if="$screen.width < 768">See All Deals ></nuxt-link>
                
            </div> 
            <DealsListTemplate :slider="true" :data="deals" :loader="deals_loader"/>
            <nuxt-link to="/deals" class="va-btn" v-if="$screen.width >= 768">View All</nuxt-link>
        </div>
        <booking-footerBtn :link="this.$route.params.branch_slug+'/booking'" v-if="($screen.width < 768) && (categories && categories.length > 0) && !business_expire"/>
    </div>
</template>
<script>
import moment from 'moment';
export default {
    data() {
        return {
            settings: {
                variableWidth: true,
                // slidesToShow:6,
                draggable: false,
                infinite: false, 
            },
            visible: true,
            branch: null,
            business: null,
            business_expire: false,
            categories: null,
            deals: [],
            deals_loader: true,
            form:{
                business_id: null,
                country_id: this.$auth.$storage.getLocalStorage("user_country"),
                city_id: this.$auth.$storage.getLocalStorage("user_city"),
                branch_slug: null,
                'with-timings':1,
                'with-staff':1,
                
            }
        }
    },
    created: function(){
        this.$auth.$storage.removeLocalStorage("redirect_url");
        this.$auth.$storage.removeLocalStorage("step");
        this.$auth.$storage.removeLocalStorage("booking_date");
        this.$auth.$storage.removeLocalStorage("booking_Time");
        this.$auth.$storage.removeLocalStorage("cart");
        this.$auth.$storage.removeLocalStorage("staff");
        this.$auth.$storage.removeLocalStorage("business");
        this.$auth.$storage.removeLocalStorage("branch");
        this.$auth.$storage.removeLocalStorage("settings");
        this.$store.commit("checkout/cart/removeAll")
        this.getServicesData(this.$route.params.branch_slug);
    },
    computed:{
        completeAddress: function () {
            return this.branch.address + ", " + this.branch.state.name + ", " + this.branch.city.name
        },
    },
    methods: {
        async getServicesData(branch_slug){
            try{

                this.form.branch_slug = branch_slug;
                
                const categories = await this.$axios.get('/services',{params: this.form});
                
                categories.data.branch.timings.filter(res => {
                    res.weekday = moment().day(res.day_of_week).format("dddd");
                    res.starts_at = moment(res.starts_at, "HH:mm:ss").format(this.timeFormat(categories.data.business));
                    res.ends_at = moment(res.ends_at, "HH:mm:ss").format(this.timeFormat(categories.data.business));
                    return res;
                })

                this.categories = categories.data.data;
                this.branch = categories.data.branch;
                this.business = categories.data.branch.business;
                this.form.business_id = this.business.id;
                this.getBranchDeals();
 
                let business_expire_date = new Date(this.business.subscription_expires_at);    
                let current_date = new Date();    
                if (current_date > business_expire_date) {    
                    this.business_expire = true;
                }                
                
            }
            catch(err){
                console.log(err);
            }
        },
        async getBranchDeals(){
            try{
                let deals = await this.$axios.get('deals',{params: this.form});
                this.deals = deals.data;
                this.deals_loader = false
            }
            catch(err){
                console.log(err);
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.loader-height-wrap{
    min-height: 50vh;
}
::v-deep .offline-overlay{
    height: 100%;
    .b-overlay{
        & > div{
            top:0 !important;
            left: 0 !important;
            transform:none !important;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            @media(max-width:520px){
                h2{
                    font-size: 1.2rem;
                }
                p{
                    font-size: 12px;
                }
            }
        } 
    }
}
::v-deep .bussiness-services{
    @media (max-width:767px) {
        padding: 0 15px;
        padding-bottom: 25px;
        overflow: hidden;
    }
    .nav-tabs{
        width: 320px;
        border:none;
        @media (max-width:980px) {
            width: 240px;
        }
        @media (max-width:767px) {
            width: 100%;
        }
        .nav-item{
            @media(max-width: 767px){
                border-bottom: 1px solid #dfdfdf;
                float: left;
                width: 100%;
            }
            .zero{
                display: none;
            }
            .nav-link{
                margin: 5px 0;
                border: none;
                font-size: 20px;
                font-weight: 400;
                color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: space-between;
                align-items: center;
                @media (max-width:767px) {
                    font-size: 15px;
                    margin: 0;
                    padding: 10px 15px;
                }
                &.active,&.not-collapsed{
                    background: #0C56C9;
                    position: relative;
                    color:white;
                    border-radius: 0;
                    .badge {
                        color: white;
                    }
                }
                .badge {
                    color: rgba(0, 0, 0, 0.5);
                    background-color: transparent;
                }
            }
            .collapse{
                @media (max-width:767px) {
                    padding:0 5px;
                    margin: 0 !important;
                }
            }
        }
    }
}
::v-deep .our-staff {
    border-top: 1.5px solid rgba(38, 57, 87, 0.15);
    // border-bottom: 1.5px solid rgba(38, 57, 87, 0.15);
    padding-left: 15px;
    padding-right: 15px;
    h3 {
        color: #000;
        font-size: 30px;
        font-weight: 800;
        margin-bottom: 45px;
        @media (max-width:1024px) {
            font-size: 25px;
        }
        @media (max-width:767px) {
            font-size: 20px;
        }
    }
    .slick-arrow {
        top: -45px;
        left: auto;
        right: 0;
    }
    .slick-prev {
        right: 60px;
        &::before {
            content: "" !important;
            background: url(/images/arrow2-black.png) no-repeat;
            width: 32px;height: 23px;
            position: absolute;
            opacity: 1;
        }
        &:hover {
            &::before {opacity: 0.4;}
        }
    }
    .slick-next {
        right: 25px;
        &::before {
            content: "" !important;
            background: url(/images/arrow1-black.png) no-repeat;
            width: 32px;height: 23px;
            position: absolute;
            opacity: 1;
        }
        &:hover {
            &::before {opacity: 0.4;}
        }
    }
    .slick-slide {
        width: 180px;
    }
    .staff-col {
            text-align: center;
                width: 160px;
            h4 {
                font-size: 18px;
                color: #000;
                line-height: 29px;
                font-weight: 800;
                margin-bottom: 0;
            }
            p {
                font-size: 15px;
                line-height: 19px;
                color: rgba(0, 0, 0, 0.5);
                margin-bottom: 0;
                font-weight: 600;
            }
            .nick-name{
                    margin: auto;
                    margin-bottom: 10px;
                    border-radius: 50%;
                    padding: 1px;
                    border: 2px solid #1D88FF;
                    width: 80px;
                    height: 80px;
                    overflow: hidden;
                img{
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: 100%;
                }
                .inner{
                    width: 75px;
                    height: 74px;
                    min-width: 72px;
                    min-height: 72px;
                    font-size: 20px;
                    font-weight: 700;
                    line-height: 24px;
                    background-color: #ebf7fe;
                    color: #1D88FF;
                    text-transform: uppercase;
                    border-radius: 50%
                }
            }
    }
}

.row {margin-left: 0;margin-right: 0;}
.deals-detail {
    border: none;
    box-shadow: none;
    margin-top: 20px;
    padding: 0 15px;
    @media (max-width:767px) {
        margin-top: 0 !important;
        padding: 0;
    }
    .branch-detail {
        width: 43%;
        background-color: #FAFAFA;
        display: flex;
        align-items: center;
        margin: 0;
        
        @media (max-width:767px) {
            width: 100%;
            background-color: white;
            order: 1;
        }
        div{
            @media (max-width:767px) {
                padding-left: 0 !important;
                padding-right: 0 !important;
            }
            h2 {
                font-size: 50px;
                line-height: 59px;
                color: #000;
                font-weight: 800;
                margin-bottom: 20px;
                @media (max-width:1024px) {
                    font-size: 35px;
                    line-height: 42px;
                }
                @media (max-width:767px) {
                    font-size: 20px;
                    margin-bottom: 10px;
                    line-height: 25px;
                }
            }
            p {
                font-size: 20px;
                color: rgba(0, 0, 0, 0.5);
                font-weight: 800;
                margin-bottom: 40px;
                @media (max-width:767px) {
                    font-size: 13px;
                }
            }
            a {
                background-color: #0C56C9;
                width: 100%;
                font-size: 18px;
                border: none;
                font-weight: 800;
                line-height: 28px;
                height: 52px;
                &:active, &:focus {box-shadow: none !important;background-color: #0C56C9 !important;}
            }
            .branch-text {
                p {
                    font-size: 12px;
                    color: #000;
                    line-height: 16px;
                    font-weight: 400;
                }
            }
        }
        .social-icons {
            .icon {
                a{
                    height: 40px;
                    width: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: transparent;
                    transition: 0.3s ease all;
                    &:hover, &:active, &:focus{
                        background: #0c56c9;
                        transition: 0.3s ease all;
                        svg{
                            fill: #FFF;
                        }
                    }
                    svg{
                        fill: #898989;
                    }
                }
            }
        }
    }
    .detail-img {
        width: 55%;
        margin-left: 2%;
        max-height: 354px;
        overflow: hidden;
        @media (max-width:767px) {
            width: 100%;
            margin-left: 0;
        }
        img {
            height: 100%;
            object-fit: cover;
        }
    }
}
h1 {
    font-size: 30px;
    color: #000;
    font-weight: 800;
    margin-top: 25px;
    padding-left: 15px;
    padding-right: 15px;
    margin-bottom: 20px;
    @media (max-width:1024px) {
        font-size: 25px;
    }
    @media (max-width:767px) {
        font-size: 20px;
        margin-top: 10px;
    }
}
.services {
    .price{
        font-size: 20px;
        width: 100%;
        text-align: center;
        color: rgba(0, 0, 0, 0.8);
        @media (max-width:767px) {
            font-size: 12px;
        }
    }
    .del {
        color: rgba(0, 0, 0, 0.8);
        text-align: center;
        font-size: 15px;
        @media (max-width:767px) {
            font-size: 10px;
        }
    }
    @media (max-width:767px) {
        border: none;
        padding: 10px 15px;
    }
    &:last-child {
        border-bottom: none;
    }
    svg {
        color: #D0D0D0;
        width: 26px;
        height: 26px;
        @media (max-width:767px) {
            margin-right: 10px;
        }
    }
    .service-title {
        color: rgba(0, 0, 0, 0.8);
        font-size: 18px;
        text-transform: capitalize;
        font-weight: 600;
        @media (max-width:767px) {
            font-size: 12px;
        }
    }
    .flex-bs-80{
        flex-basis: 80px;
    }
    ul {
        li {
            border-bottom: none;
            border-top: 1.5px solid rgba(38, 57, 87, 0.15);
            padding: 25px 0;
            @media (max-width:767px) {
                border: none;
                padding: 5px 0;
            }
            &:first-child {
                border: none;
            }
            .title {
                color: rgba(0, 0, 0, 0.8);
                font-size: 18px;
                text-transform: capitalize;
                font-weight: 600;
                @media (max-width:767px) {
                    font-size: 12px;
                }
            }
            div{
                span {
                    color: rgba(0, 0, 0, 0.8);
                    @media (max-width:767px) {
                        font-size: 14px;
                    }
                }
                div{
                    .from-text {
                        display: block;
                        color: rgba(0, 0, 0, 0.5);
                    }
                }
            }
        }
    }
}

.about-detail {
    padding-left: 15px;
    padding-right: 15px;
    padding-top: 0px !important;
    padding-bottom: 20px !important;
    @media (max-width:980px) {
        display: block;
    }
    @media (max-width:767px) {
        padding-top: 0 !important;
    }
    div {
        @media (max-width:980px) {
            max-width: 100%;
        }
    }
    h3 {
        color: #000000;
        font-size: 30px;
        font-weight: 800;
        margin-bottom: 20px;
        line-height: 35px;
        @media (max-width:1024px) {
            font-size: 25px;
            margin-bottom: 10px;
        }
        @media (max-width:767px) {
            font-size: 20px;
        }
    }
    p  {
        color: #000000;
        line-height: 28px;
        font-size: 17px;
        font-weight: 400;
        padding-right: 20px;
        margin-bottom: 5px;
        @media (max-width:767px) {
            font-size: 12px;
            line-height: 20px;
            padding: 0;
        }
    }
    span {
        color: rgba(0, 0, 0, 0.5);
        line-height: 28px;
        font-size: 17px;
        font-weight: 600;
        @media (max-width:767px) {
            font-size: 12px;
            line-height: 16px;
        }
    }
    div {
        
        span {
            position: relative;
            padding: 0 40px;
        }
        .first {
            padding-left: 30px;
            &:before{
                content: '';
                background: url(/images/instant.png) no-repeat;
                width: 15px;height: 23px;
                position: absolute;
                left: 0;
            }
        }
        .middle {
            &:before{
                content: '';
                background: url(/images/group.png) no-repeat;
                width: 25px;height: 25px;
                position: absolute;
                left: 0;
            }
        }
        .last {
            &:before{
                content: '';
                background: url(/images/pay.png) no-repeat;
                width: 23px;height: 15px;
                position: absolute;
                left: 0;top: 7px;
            }
        }
    }
    .location-wrap {
        padding-bottom: 30px;
        border-bottom: 1.5px solid rgba(38, 57, 87, 0.15);
        margin-bottom: 15px;
        @media (max-width:767px) {
            p{
                font-size: 17px;
                line-height: 28px;
            }
        }
    }
    .time-slot {
        padding-bottom: 0;
            button {
                position: relative;
                padding-left: 50px;
                width: 100%;
                text-align: left;
                border: 1px solid rgba(38, 57, 87, 0.15);
                border-radius: 3px;
                background-color: transparent;
                color: #000;
                font-size: 15px;
                font-weight: 700;
                margin-top: 10px;
                @media (max-width:767px) {
                    margin-top: 0;
                }
            }
            .time-close {
                &:before{
                    content: '';
                    background: url(/images/time.png) no-repeat;
                    width: 20px;height: 20px;
                    position: absolute;
                    top: 12px;left:15px
                }
                &:after {
                    content: '';
                    background: url(/images/dropdown.png) no-repeat;
                    right: 20px;
                    position: absolute;
                    top: 22px;
                    width: 10px;height: 10px;
                }
                &:active {background-color: transparent;border: 1px solid rgba(38, 57, 87, 0.15);color: #263957;}
                &:focus {box-shadow: none !important;border: 1px solid rgba(38, 57, 87, 0.15);color: #263957;}
            }
            .timings {
                border: none;
                box-shadow: 0px 4px 30px rgb(0 0 0 / 10%);
                padding: 20px 20px 10px;
                span{
                    padding: 0;
                }
            }
    }
    .phone-number{
        color: #0c56c9;
        border-bottom: 1px solid;
        font-weight: 600;
    }
}
.ss-btn {
    font-size: 15px;
    font-weight: 700;
    color: #0C56C9;
}

.bussiness_deals {
    margin-top: 50px;
    @media (max-width:767px) {
        margin-top: 32px;
    }
    .bd-heading {
        justify-content: center;
        @media (max-width:767px) {
            justify-content: space-between;
        }
    } 
    a {
        @media (max-width:767px) {
            font-size: 15px;
            color: #0C56C9;
            font-weight: 700;
            margin-bottom: 15px;
        }
    }
}
.booknow-mob{
    @media (max-width:767px) {
        display: none;
    }
}
</style>