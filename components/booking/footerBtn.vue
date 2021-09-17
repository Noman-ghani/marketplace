<template>
    <div class="footer-area bg-white p-3 border-top position-fixed">
            <div class="container">
                <div class="d-flex justify-content-between">
                    <p></p>
                    <nuxt-link :to="link" class="btn btn-primary">Book Now</nuxt-link>
                </div>
            </div>
        </div>
</template>
<script>
export default {
     props: {
        link: {
            default: "booking"
        }
    }
}
</script>