<template>
    <footer class="bg-white pt-3">
        <div class="container">
            <div class="footer-logo d-md-none">
                <nuxt-link class="navbar-brand" to="/">
                    <img src="/images/servu-logo.svg" alt="logo" style="max-width:150px">
                </nuxt-link>
            </div>
            <div class="footer-menu d-flex">
                <div class="footer-logo d-none d-md-block">
                    <nuxt-link class="navbar-brand" to="/">
                        <img src="/images/servu-logo.svg" alt="logo" style="max-width:150px">
                    </nuxt-link>
                </div>
                <div class="business-menu">
                    <h2>For Business</h2>
                    <ul>
                        <li>For Partners</li>
                        <li>Pricing</li>
                        <li>Support For Partners</li>
                    </ul>
                </div>
                <div class="legal-menu">
                    <h2>Legal</h2>
                    <ul>
                        <li>Booking Terms</li>
                        <li>Privacy Policy</li>
                        <li>Website Terms</li>
                    </ul>
                </div>
                <div class="subscribe d-none d-md-block">
                    <h2>Subscribe For Updates</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</p>
                    <b-form class="d-flex">
                        <b-input type="email" class="w-100" id="email-address" placeholder="Enter Your Email Address"></b-input>
                        <b-button class="subscribe-btn"></b-button>
                    </b-form>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <div class="container">
                <div class="text-center">
                    <p class="m-0">© 2021 ServU</p> 
                </div>
            </div>
        </div>
    </footer>
</template>
<script>
export default {
    
}
</script>
<style lang="scss" scoped>
footer{
    // box-shadow: 0 0px 20px -5px rgb(0 0 0 / 15%);
}
    .footer-bottom {
    background-color: #0C56C9;
    padding: 15px 0;
    p {
        font-size: 20px;
        color: white;
        font-weight: 700;
        @media (max-width:767px) {
            font-size: 15px;
        }
    }
}
footer .footer-logo {text-align: center !important;}

.footer-menu {
    padding-top: 40px;
    justify-content: space-around;
    padding-bottom: 40px;
    @media (max-width:767px) {
        padding-bottom: 10px;
    }
    div {
        text-align: left;
        width: 25%;
        @media (max-width:767px) {
            text-align: center;
            width: 50%;
        }
            h2 {
                font-size: 18px;
                color: #000;
                font-weight: 800;
                margin-bottom: 18px;
                @media (max-width:767px) {
                    font-size: 15px;
                }
            }
            ul {
                li {
                    font-size: 16px;
                    font-weight: 700;
                    color: rgba(0, 0, 0, 0.5);
                    padding: 12px 0;
                    @media (max-width:767px) {
                        font-size: 12px;
                    }
                }
            }
    }
    .subscribe {
        p {
            font-weight: 700;
            font-size: 16px;
            line-height: 25px;
            color: rgba(0, 0, 0, 0.5);
            margin-top: 30px;
            @media (max-width:767px) {
                font-size: 12px;
            }
        }
        form {
            input {
                font-size: 16px;
                color: rgba(38, 57, 87, 0.4);
                font-weight: 700;
                height: 51px;
                background: #FFFFFF;
                border: 1px solid rgba(0, 0, 0, 0.5);
                border-radius: 0;
                text-overflow: ellipsis;
            }
            .subscribe-btn {
                height: 51px;
                background-color: #000;
                border-radius: 0;
                width: 96px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-left: -1px;
                &::before {
                    content: "";
                    background: url(/images/subscribe-icon.png) no-repeat;
                    width: 23px;height: 23px;
                }
            }
        }
    }
}
</style>