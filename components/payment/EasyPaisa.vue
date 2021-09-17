<template>
    <div v-if="!show">
        <iframe id="easypay-iframe" name="easypay-iframe" :src="url" width="900px" 
    height="900px"></iframe>
    </div>

</template>
<script>
export default {
    props:{
        url: {
            type: String,
            default: ""
        },
        show: {
            type: Boolean,
            default: true
        },
    },
    data(){
        return{
        }
    },

}
</script>
<style lang="scss" scoped>
iframe{
    position: fixed;
    top: 0;
    left: 0;
    
}
</style>