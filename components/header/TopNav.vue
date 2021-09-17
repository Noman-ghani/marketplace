<template>
    <header class="main-header" :style="showMenuStyle">
        <div class="container">
            <b-navbar type="light">
                <nuxt-link class="navbar-brand logo" to="/" :style="showMenuStyle">
                    <img src="/images/servu-logo.svg" alt="logo" style="max-width:110px">
                </nuxt-link>
                <nuxt-link class="navbar-brand scroll-logo" to="/" v-if="!menuOpen">
                    <img src="/images/servu-logo-white.png" alt="logo" style="max-width:110px">
                </nuxt-link>
                <div class="banner-search d-none" v-if="$screen.width > 767">
                    <HeaderSearch />
                </div>
                <b-navbar-toggle target="nav_dropdown_collapse" class="flex-grow-0">
                    <template>
                        <div v-if="$auth.loggedIn" class="d-flex justify-content-between align-items-center">
                            <img v-if="$auth.user.profile_image" :src="$auth.user.profile_image" alt="User Profile" class="user-profile" >
                            <div v-else class="border rounded-circle user-profile d-flex justify-content-center align-items-center" >
                                {{$auth.user.first_name.charAt(0)}}{{$auth.user.last_name.charAt(0)}}
                            </div>
                            <b-icon-chevron-down font-scale="0.7"/>
                        </div>
                        <div v-else>
                            <span class="btn btn-outline-primary pt-1 pb-1 pl-3 pr-3" @click="$router.push({name: 'login'})">
                                 Login
                            </span>
                        </div>
                    </template>
                </b-navbar-toggle>    
                <b-collapse v-model="menuOpen" id="nav_dropdown_collapse" class="flex-grow-0" is-nav >
                    <b-icon-x font-scale="2" class="close-menu"  v-if="($screen.width < 768) && menuOpen" @click="menuOpen = false" style="float: right;margin:10px" />
                    <b-navbar-nav class="w-100 flex-wrap">
                        <li class="nav-item profile-li" v-bind:class="{setting : $auth.user.is_completed}" v-if="$auth.loggedIn">
                            <div class="menu-item-profile" v-if="$screen.width < 768">
                                <img v-if="$auth.user.profile_image" :src="$auth.user.profile_image" alt="User Profile" class="user-profile" >
                                <div v-else class="border rounded-circle user-profile d-flex justify-content-center align-items-center" >
                                    {{$auth.user.first_name.charAt(0)}}{{$auth.user.last_name.charAt(0)}}
                                </div>
                            </div>
                            <div class="full-name w-100">
                                <h2>
                                    {{$auth.user.first_name}} {{$auth.user.last_name}}
                                </h2>
                                <nuxt-link :to="{name: 'profile'}" @click.native="menuOpen = false" class="setting-a" v-if="$auth.user.is_completed">Setting</nuxt-link>
                            </div>
                        </li>
                        <li class="nav-item border-0 update-li" v-if="$auth.loggedIn && !$auth.user.is_completed">
                            <div class="upgrade-box mb-4">
                                <img src="images/mobile-menu-card.svg" v-if="$screen.width < 768" class="upgrade-box-img" alt="upgrade-box-img">
                                <p class="title">Update profile</p>
                                <p class="subtitle" v-if="$screen.width >= 768">We just need a few more details from you.</p>
                                <p class="subtitle" v-else>Add more details about yourself on your profile to improve your ServU experience.</p>
                                <nuxt-link to="/profile" @click.native="menuOpen = false" :class="($screen.width < 768 ? 'btn btn-light': 'link')" replace>
                                        Update now
                                </nuxt-link>
                            </div>
                        </li>

                        <li class="nav-item d-flex justify-content-between align-items-center" v-if="$auth.loggedIn">
                            <nuxt-link :to="{path: '/appointments'}" class="nav-link" replace>My Appoinments</nuxt-link>
                            <b-icon-chevron-right font-scale="1.4" v-if="$screen.width < 768"/>
                       </li>
                         <li class="nav-item d-flex justify-content-between align-items-center" v-if="$auth.loggedIn">
                            <nuxt-link :to="{path: '/invoices'}" class="nav-link" replace>My Invoices</nuxt-link>
                            <b-icon-chevron-right font-scale="1.4" v-if="$screen.width < 768"/>
                       </li>
                        <li class="nav-item d-flex justify-content-between align-items-center" v-if="$auth.loggedIn">
                            <nuxt-link :to="{path: '/profile'}" class="nav-link" replace>My profile</nuxt-link>
                            <b-icon-chevron-right font-scale="1.4" v-if="$screen.width < 768"/>
                       </li>
                        <li class="nav-item d-flex justify-content-between align-items-center" v-if="$auth.loggedIn">
                            <span class="nav-link" @click="logout">Logout</span>
                            <b-icon-chevron-right font-scale="1.4" v-if="$screen.width < 768"/>
                       </li>
                        <!-- <li class="nav-item d-flex justify-content-between align-items-center" v-if="!$auth.loggedIn">
                            <nuxt-link class="nav-link" to="/login">Login</nuxt-link>
                            <b-icon-chevron-right font-scale="1.4" v-if="$screen.width < 768"/>
                        </li>
                        <li class="nav-item d-flex justify-content-between align-items-center" v-if="!$auth.loggedIn">
                            <nuxt-link class="nav-link" to="/signup">SignUp</nuxt-link>
                            <b-icon-chevron-right font-scale="1.4" v-if="$screen.width < 768"/>
                        </li> -->
                    </b-navbar-nav>
                </b-collapse>
            </b-navbar>
        </div>
        <section class="search" v-if="$route.path != '/' && $screen.width <= 767">
            <HeaderSearch />
        </section>
    </header>
</template>
<script>
export default {
        data(){
            return{
                header : "#FFF",
                menuOpen: false
            }
        },
        created: function(){
            // this.$auth.logout();
        },
        computed: {
            showMenuStyle: function (){
                if (this.menuOpen){
                    return {
                        zIndex: 12,
                        display: 'block'
                    }
                }
            },
        },
        methods:{
            async logout() {
                this.$auth.logout();
                this.successToast("Logout Success.", {title: "Logout."})
            },
            handleSCroll (event) {
                let addressBar = document.querySelector(".current-address");
                let header = document.querySelector(".main-header");
                if(this.$route.path == '/' && header && addressBar){
                    if (window.scrollY > 350 && !header.className.includes('header-bgchange')) {
                        header.classList.add('header-bgchange'); 
                        addressBar.style.display = "none";
                        
                    } else if (window.scrollY < 350) {
                        header.classList.remove('header-bgchange');
                        addressBar.removeAttribute("style")
                    }
                }
                // if(addressBar){
                // }
            },
            checkRouteForHeader(routeRef){
                let header = document.querySelector(".main-header");
                if(routeRef.path != '/'){
                    header.classList.add('inner-page-header'); 
                    header.classList.add('header-bgchange');
                }else{
                    header.classList.remove('inner-page-header'); 
                    header.classList.remove('header-bgchange');
                    if(this.$screen.width <= 768){
                        this.header = "#FFF"
                    } 
                }
            }

        },
        mounted () {
            window.addEventListener('scroll', this.handleSCroll);
            this.checkRouteForHeader(this.$route);
        },
        watch:{
            $route (to, from){
                this.checkRouteForHeader(to);
            },
        },
        destroyed () {
            window.removeEventListener('scroll', this.handleSCroll);
        } 
}
</script>
<style lang="scss" scoped>
@media(max-width:767px){
::v-deep .navbar-expand .navbar-nav{
    overflow: auto;
    height: calc(100vh - 55px);
    align-content: flex-start;
}
.header-bgchange{
    .btn-outline-primary{
        color: #FFF;
        border-color: #FFF;
    }
   .user-profile{
       &+svg{
           color: #FFF;
       }
        @media(max-width:767px){
            color: #FFF;
        }
   }
   &.inner-page-header{
    .user-profile{
        &+svg{
            color: #000;
            @media(max-width:767px){
                color: #FFF;
            }
        }
       
    }   
   }
}
}
.user-profile{
    width: 32px;
    height: 32px;
    overflow: hidden;
    border-radius: 50%;
    font-size: 12px;
    color: #000;
    font-weight: 700;
    &+svg{
        font-weight: 700;
        margin-left: 5px;
    }
    @media(max-width:767px){
       color: #0c56c9;
    }
}
.menu-item-profile{
        width: 130px;
        height: 130px;
        padding: 3px;
        border-radius: 50%;
        border:2px solid #0C56C9;
    .user-profile{
        width: 100%;
        height: 100%;
        @media(max-width:767px){
            font-size: 32px;
            color: #000;
        }
    }
}
.nav-item{
    padding: 10px 15px;
    border-bottom: 1px solid #dfdfdf;
    width: 100%;
    a{
        cursor: pointer;
    }
    &.profile-li{
        justify-content: center;
        display: flex;
        align-items: center;
        padding: 1.5rem 15px; 
        border-bottom: 0;
        flex-wrap: wrap;
        .full-name{
            h2{
                letter-spacing: 0px;
                margin: 0px;
                min-width: 0px;
                font-size: 17px;
                font-weight: 700;
                line-height: 24px;
                text-align: left;
                color: rgb(16, 25, 40);
                @media (max-width:767px) {
                    margin-top: 20px;
                    text-align: center;
                }
            }
        }
    }
    &.profile-li.setting{
        border-bottom: 1px solid #dfdfdf;
        .setting-a{
            @media(max-width:767px){
                margin: auto;
                display: table;
            }
        }
    }
    &.update-li{
        padding: 0;
        @media(max-width:767px){
            padding: 10px 15px;
        }
    }
    .upgrade-box{
        background-color: #cde4ff;
        position: relative;
        overflow: hidden;
        border: 1px solid #d5d7da;
        padding: 24px 15px;
        @media(max-width:767px){
            padding: 24px 24px 40px;
            border-radius: 8px;
        }
        .upgrade-box-img{
                max-height: 120px;
                max-width: 35%;
                position: absolute;
                right: 0;
                bottom: 0;
        }
        .title{
            font-size: 24px;
            font-weight: 800;
            line-height: 32px;
            @media(max-width:767px){
                max-width: 80%;
            }
        }
        .subtitle{
           font-size: 15px;
            font-weight: 400;
            line-height: 21px; 
            @media(max-width:767px){
                max-width: 80%;
            }
        }
    }
}
</style>