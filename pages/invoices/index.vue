<template>
  <b-overlay  class="container" variant="transparent">

      <div class="invoices">
         <div class="left-sidebar d-flex">
                    <div class="invoices-list">
                       
                        <div class="invoice-app">
                            <div class="status mt-4">
                                <p class="app-status">Customer Invoices  <span></span></p>
                            </div>
                             <div class="pr-4">
                                <template v-for="(app,idx) in invoices">
                                    
                                    <div class="app-item cursor-pointer d-flex" :key="idx" @click="selectInvoice(app.id)">
                                           
                                            <div class="apt-detail">
                                                
                                                <p class="invoice-number branch-name">{{app.invoice_number}}</p>
                                                <p class="invoice-number mb-2"><strong>Invoice Item <span v-if="app.items.length > 0">s</span>:</strong> {{app.items.length}}</p>
                                                
                                                 <div class="uapp-status">
                                                    <div class="status" :style="'background-color:' + (app.status == 'voided' ? '#da2346' : app.status == 'completed' ? 'green' : '')">
                                                            <svg class="Icon-c98r68-0 gHTbBq Icon-c98r68-1 hFwlVf" width="16" height="16"><g fill="#FFF" fill-rule="evenodd"><path d="M6.7 6.3c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4l2 2c.2.2.4.3.7.3.3 0 .5-.1.7-.3l7-7c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0L8 7.6 6.7 6.3z"></path><path d="M8 15c3.9 0 7-3.1 7-7 0-.6-.4-1-1-1s-1 .4-1 1c0 2.8-2.2 5-5 5s-5-2.2-5-5 2.2-5 5-5c.6 0 1.1.1 1.7.3.5.2 1.1-.1 1.3-.6.2-.5-.1-1.1-.6-1.3C9.6 1.1 8.8 1 8 1 4.1 1 1 4.1 1 8s3.1 7 7 7z"></path></g></svg>
                                                            <p class="status-txt">Status: {{app.status}}</p>
                                                    </div>
                                                </div>
                                                
                                            </div>
                                    </div>
                                </template>
                            </div>
                           
                        </div>
                    </div>
                </div>
                <div class="right-area">
                    <div class="invoice-wrapper d-flex flex-column flex-grow-1" v-if="selectedInvoices">
                        <span class="app-close" v-if="$screen.width < 768">
                            <b-icon-x />
                        </span>
                        <div class="banner-top">
                            <p class="invoice-details-date">Invoice # {{selectedInvoices.invoice_number}}</p>
                           <div class="status" :style="'background:'+ (selectedInvoices.status == 'voided' ? '#da2346' : selectedInvoices.status == 'completed' ? 'green' : '')">
                                <svg class="Icon-c98r68-0 gHTbBq Icon-c98r68-1 hFwlVf" width="16" height="16"><g fill="#FFF" fill-rule="evenodd"><path d="M6.7 6.3c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4l2 2c.2.2.4.3.7.3.3 0 .5-.1.7-.3l7-7c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0L8 7.6 6.7 6.3z"></path><path d="M8 15c3.9 0 7-3.1 7-7 0-.6-.4-1-1-1s-1 .4-1 1c0 2.8-2.2 5-5 5s-5-2.2-5-5 2.2-5 5-5c.6 0 1.1.1 1.7.3.5.2 1.1-.1 1.3-.6.2-.5-.1-1.1-.6-1.3C9.6 1.1 8.8 1 8 1 4.1 1 1 4.1 1 8s3.1 7 7 7z"></path></g></svg>
                                <p class="status-txt">{{selectedInvoices.status}}</p>
                            </div>
                           
                        </div>

                        <div class="banner-bottom">
                            <div class="invoices-wrapper">
                               
                                <div class="invoice-list border-0 m-0 p-0">
                                    <div class="invoice-grid">
                                       

                                           <div class="detail">
                                                <b-table-simple>
                                                    <b-thead>
                                                        <b-tr>
                                                            <b-th>Invoice Item<template v-if="selectedInvoices.items.length > 1" >s</template> ({{selectedInvoices.items.length}})</b-th>
                                                            <b-th>Price</b-th>
                                                        </b-tr>
                                                    </b-thead>
                                                    <b-tbody>
                                                        <b-tr v-for="(item,idx) in selectedInvoices.items" :key="idx">
                                                            <b-td>
                                                                {{item.title}}
                                                            </b-td>
                                                            <b-td>
                                                                {{item.quantity}} <b-icon-x /> {{selectedInvoices.business.country.currency}} {{selectedInvoices.subtotal | currency}}
                                                            </b-td>
                                                        </b-tr>
                                                        <b-tr>
                                                            <b-td>
                                                                <div v-if="selectedInvoices.payment_method">
                                                                    <p class="m-0 mb-3 font-weight-bold">Payment Details</p>
                                                                    <img v-if="selectedInvoices.payment_method.image" :src="selectedInvoices.payment_method.image" :alt="selectedInvoices.payment_method.title">
                                                                    <p v-else>{{selectedInvoices.payment_method.title}}</p>
                                                                </div>
                                                                <p class="mt-4 mb-1" v-if="selectedInvoices.transactions"><strong>Transaction Num:</strong> {{selectedInvoices.transactions.transaction_num}}</p>
                                                                <p v-if="selectedInvoices.transactions"><strong>Status:</strong> {{selectedInvoices.transactions.status}}</p>
                                                            </b-td>
                                                            <b-td class="price-details">
                                                                <p class="m-0 mb-2 d-flex justify-content-between subtotal"><strong>Subtotal </strong> {{selectedInvoices.business.country.currency}} {{selectedInvoices.subtotal | currency}}</p>
                                                                <p class="m-0 mb-2 d-flex justify-content-between tax"><strong>Tax </strong> {{selectedInvoices.business.country.currency}} {{selectedInvoices.tax | currency}}</p>
                                                                <p class="m-0 mb-2 d-flex justify-content-between grandtotal"><strong>Total </strong> {{selectedInvoices.business.country.currency}} {{selectedInvoices.grandtotal | currency}}</p>
                                                            </b-td>
                                                        </b-tr>
                                                    </b-tbody>
                                                </b-table-simple>
                                            </div>
                                        </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>

      </div>
  </b-overlay>
</template>
<script>

export default {
    data(){
         return {
            invoices: [],
            selectedInvoices: null,
        }
    },
  
    created: function() {
        if(this.$auth.loggedIn){
           
           this.$axios.get('/invoices?id='+this.$auth.user.id+'&with-items&with-branch&with-payment-method&with-transactions')
            .then(res => {
                   let data = res.data.filter(data => {
                  
                   
                    return data;
                });

                this.invoices = data;
                console.log(this.invoices);
                
                this.selectInvoice(data[0].id);
            })
            .catch(err => {
                console.log(err);
            })
        }else{
            this.$router.replace("/");
        }
    },
    methods: {
       selectInvoice: function (id){
           
           this.invoices.filter(res => {
                if(res.id == id){
                    this.selectedInvoices = res;
                }
                return res;
            });

       }
    }
}
</script>

<style lang="scss" scoped>
.container {
    @media (max-width:767px) {
        padding: 0;
    }

.invoices{
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
       
        .invoices-list {
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
            .uapp-status{
                .status{
                        display: inline-flex;
                        height: 28px;
                        border-radius: 16px;
                        padding: 0px 16px 0px 8px;
                        margin:0 0 5px;
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
                padding: 10px;
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
            
            
            .invoice-app {
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
            z-index: 1;
            display: none;
            padding-bottom: 0;
        }
        .invoice-wrapper{
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
                padding: 40px 40px 0 40px;
                @media (max-width:767px) {
                    padding: 40px 20px;
                }
                .invoice-details-date{
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
                .invoices-wrapper{
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
                    .invoice-list{
                        border-bottom: 1.5px solid rgba(38, 57, 87, 0.15);
                        padding-bottom: 20px;

                           .table th{
                                border-top: 0;
                            }
                            .table th, .table td{
                                width: 70%;
                            }
                       
                    }
                }
            }
        }
    }
}
}

</style>