export const state = () => ({
    data: []
  })
  
  export const mutations = {
    add (state, text) {
      state.data = text;
    },
    remove (state) {
      state.data = [];
    }
  }