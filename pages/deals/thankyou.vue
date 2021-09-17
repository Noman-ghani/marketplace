<template>
    <div>
        <div class="top-area pt-5 pb-5 position-static">
            <div class="container">
                <h2 class=" text-center">Thank You.</h2>
                <p class=" text-center">Your deals has been checkout / purchase successfully. Details are mentioned bellow:</p>
            </div>
        </div>
        <div class="container" v-if="invoice">
            <div class="invoice-grid">
                <div class="invoice pt-4 pb-4">
                    <h2 class="text-center">Invoice # {{invoice.invoice_number}}</h2>
                </div>

                <div class="detail">
                    <b-table-simple>
                        <b-thead>
                            <b-tr>
                                <b-th>Invoice Item<template v-if="invoice.items.length > 1" >s</template> ({{invoice.items.length}})</b-th>
                                <b-th>Price</b-th>
                            </b-tr>
                        </b-thead>
                        <b-tbody>
                            <b-tr v-for="(item,idx) in invoice.items" :key="idx">
                                <b-td>
                                    {{item.title}}
                                </b-td>
                                <b-td>
                                    {{item.quantity}} <b-icon-x /> {{invoice.business.country.currency}} {{item.price | currency}}
                                </b-td>
                            </b-tr>
                            <b-tr>
                                <b-td>
                                    <p class="m-0 mb-3 font-weight-bold">Payment Details</p>
                                    <div v-if="invoice.payment_method">
                                        <img :src="invoice.payment_method.image" v-if="invoice.payment_method.image" :alt="invoice.payment_method.title">
                                        <p v-else>{{invoice.payment_method.title}}</p>
                                    </div>
                                    <div v-if="invoice.transactions">
                                        <p class="mt-4 mb-1"><strong>Transaction Num:</strong> {{invoice.transactions.transaction_num}}</p>
                                        <p><strong>Status:</strong> {{invoice.transactions.status}}</p>
                                    </div>
                                </b-td>
                                <b-td class="price-details">
                                    <p class="m-0 mb-2 d-flex justify-content-between subtotal"><strong>Subtotal </strong> {{invoice.business.country.currency}} {{invoice.subtotal | currency}}</p>
                                    <p class="m-0 mb-2 d-flex justify-content-between tax"><strong>Tax </strong> {{invoice.business.country.currency}} {{invoice.tax | currency}}</p>
                                    <p class="m-0 mb-2 d-flex justify-content-between grandtotal"><strong>Total </strong> {{invoice.business.country.currency}} {{invoice.grandtotal | currency}}</p>
                                </b-td>
                            </b-tr>
                        </b-tbody>
                    </b-table-simple>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            invoice: null
        }
    },
    created: function(){
        if(!this.$auth.loggedIn){
            this.$auth.$storage.setLocalStorage("redirect_url", this.$route.path);
            
            this.$router.push('/');
        }
        if(!this.invoice){
            this.$router.push('/');
        }
        this.$auth.$storage.removeLocalStorage("redirect_url");
        if(this.$route.query.invoice){
            this.$axios.get('invoices/'+this.$route.query.invoice+'?with-items&with-branch&with-payment-method&with-transactions')
            .then(res => {
                this.invoice = res.data;
            })
            .catch(err => {
                console.log(err);
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.invoice-grid{
    max-width: 680px;
    margin: auto;
}
</style>