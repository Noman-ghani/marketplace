<template>
    <div></div>
</template>
<script>
export default {
    data() {
        return {
            form: this.$auth.user
        }
    },
    fetch: async function() {
        let strategy = this.$auth.strategy.name;
        switch(strategy){
            case "facebook" :
                this.form.strategy = strategy;
                this.getUserAfterLogin();
            break;
            case "google" :
                this.form.strategy = strategy;
                this.getUserAfterLogin();
            break;
            default :
                this.$router.push('/');
            break;
        }
    },
    methods:{
        async getUserAfterLogin() {
            let auth = this.$auth;
            try{
                const result = await this.$axios.post('/auth/login',this.form);
                        
                auth.setToken('local', result.data.token_type + result.data.token);
                    setTimeout( async () => {
                        auth.setStrategy('local');
                        setTimeout( async () => {
                            await auth.fetchUser();
                        })
                    });
                    
                    this.$router.push('/login');

            }
            catch(err){
                console.log(err);
            }
        }
    }
}
</script>