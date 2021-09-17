<template>
    <div class="w-100 categories-list flex-wrap p-0" v-if="branch.staff && branch.staff.length > 0">
        <template v-for="(data,idx) in branch.staff">
                <b-card class="staff-select shadow-none w-100 rounded-0 border-0 cursor-pointer" @click="selectStaff(data.staff)" no-body v-if="data.staff.enable_appointments" :key="idx">
                    <b-card-body class="p-4 staff-name">
                            <div class="d-flex align-items-between">
                                <div class="flex-grow-1 d-flex">
                                    <div class="nick-name" :style="'border-color:' + data.staff.appointment_color">
                                        <p v-if="!data.staff.profile_image" class="inner d-flex justify-content-center align-items-center">
                                            {{data.staff.first_name.charAt(0)}}{{data.staff.last_name.charAt(0)}}
                                        </p>
                                        <b-img-lazy :src="data.staff.profile_image" v-else alt="staff"/>
                                    </div>
                                    <div class="full-name d-flex align-content-center flex-wrap flex-grow-1">
                                        <p class="name m-0 w-100">{{data.staff.first_name}} {{data.staff.last_name}}</p>
                                        <p class="title m-0 w-100">{{data.staff.staff_title}}</p>
                                    </div>
                                </div>
                                <div class="next d-flex align-content-center flex-wrap">
                                    <b-icon-chevron-right font-scale="1.1" />
                                </div>
                            </div>
                    </b-card-body>
                </b-card>
        </template>
    </div>
    <div class="w-100 categories-list p-4 justify-content-center" v-else>
        <h3 class="mt-4 mb-4">Staffs Not Added for this Branch</h3>
    </div>
</template>
<script>

export default {
    layout: 'bookingWidget',
    data() {
        return {
            data: {
                name: 'b-branch_slug-booking',
                step: 2,
                title: 'Select Staff'
            }
        }
    },
    created: function () {
        // let cartData = this.$store.state.checkout.cart.data;
        // if(!cartData){
        //     this.$router.push({name: 'b-branch_slug-booking'});
        // }
        this.getStoreItemFromLocalStorage();
    },
    mounted: function(){
        this.$store.commit("checkout/step/add",this.data);
        let step = this.$store.state.checkout.step.data;
        this.$auth.$storage.setLocalStorage("step",step);
    },
    computed: {
        business: function() {
            let business = this.$auth.$storage.getLocalStorage('business');
            return business;
        },
        branch: function() {
            let branch = this.$auth.$storage.getLocalStorage('branch');
            return branch;
        },
        settings: function() {
            let setting = this.$auth.$storage.getLocalStorage('setting');
            return setting;
        },
    },
    methods: {
        selectStaff(staff){
            this.$store.commit("checkout/staff/add",staff);
            this.$auth.$storage.setLocalStorage('staff',staff);
            this.getStoreItemFromLocalStorage();
            this.$router.push('time');
        }
    }
}
</script>

<style lang="scss" scoped>
.nick-name{
    img{
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}
.staff-select {
    @media (max-width:767px) {
        padding: 0 20px;
        .next {
            display: none !important;
        }
    }
    .staff-name {
        border-bottom: 1.5px solid rgba(38, 57, 87, 0.15);
        @media (max-width:767px) {
            padding: 20px 0 !important;
        }
    }
    &:last-child {
            .staff-name {
                border: none;
            }
        }
}

</style>