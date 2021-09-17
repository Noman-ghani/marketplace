export const state = () => ({
    data: []
  })
  
  export const mutations = {
    add (state, text) {
        let match = false;
          state.data.forEach(data => {
                if(text.step == data.step){
                  match = true;
                }
          });

          if(!match){
            state.data.push(text);
          }
    },
    remove (state) {
      this.$router.push({name: state.data[state.data.length -1].name});
      state.data.pop();
    },
    removeAll (state) {
      state.data = [];
    }
  }