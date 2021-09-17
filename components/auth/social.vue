<template>
    <div class="social-login">
        <b-button @click="googleLogin" variant="primary"> 
            <div class="icon google-icon">
                <svg class="Icon-c98r68-0 ipWlqP Icon-c98r68-1 hFwlVf" viewBox="0 0 533.5 544.3"><path d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z" fill="#4285f4"></path><path d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z" fill="#34a853"></path><path d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z" fill="#fbbc04"></path><path d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z" fill="#ea4335"></path></svg>
            </div>
           <p>Continue with Google</p>
        </b-button>
        <b-button @click="facebookLogin" variant="primary">
            <div class="icon fb-icon">
                <svg class="Icon-c98r68-0 gbemWV Icon-c98r68-1 hFwlVf" viewBox="0 0 155.139 155.139"><path d="M89.584 155.139V84.378h23.742l3.562-27.585H89.584V39.184c0-7.984 2.208-13.425 13.67-13.425l14.595-.006V1.08C115.325.752 106.661 0 96.577 0 75.52 0 61.104 12.853 61.104 36.452v20.341H37.29v27.585h23.814v70.761h28.48z"></path></svg>
            </div>
            <p>Continue with Facebook</p>
        </b-button>
    </div>
</template>
<script>
export default {
    methods: {
        async facebookLogin() {
            this.$axios.get('auth/facebook')
           .then(response => {
                window.location.href = response.data.redirectUrl;   
           })
        },
        async googleLogin() {
           this.$axios.get('auth/google')
           .then(response => {
                window.location.href = response.data.redirectUrl;   
           })
        }
    }
}
</script>
<style lang="scss" scoped>
button{
    width: 100%;
    background-color: rgb(255, 255, 255);
    display: flex;
    -webkit-box-align: center;
    align-items: center;
    border-radius: 4px;
    // box-shadow: rgb(213 215 218) 0px 4px 6px 0px;
    border: 2px solid rgba(38, 57, 87, 0.3) !important;
    padding: 0px;
    padding-right: 48px;
    margin-top: 20px;
    &:hover,&:focus,&:active{
        background-color: rgb(255, 255, 255) !important;
        border: 2px solid rgba(38, 57, 87, 0.3);
        box-shadow: none;
    }
    @media (max-width:767px) {
        padding-right: 0;
    }
    .icon{
        border-right: 2px solid rgba(38, 57, 87, 0.3);
        width: 48px;
        height: 48px;
        padding: 12px;
        svg{
            width: 24px;
            height: 24px;
        }
    }
    .fb-icon {
        svg {
            color: #3B5999;
        }
    }
    p{
        letter-spacing: 0px;
        margin: 0px;
        min-width: 0px;
        font-size: 17px;
        font-weight: 700;
        line-height: 24px;
        text-align: center;
        color: #000;
        padding: 12px;
        width: 100%; 
    }
}
</style>