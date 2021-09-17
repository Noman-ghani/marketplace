export const state = () => ({
    data: null
  })
  
  export const mutations = {
    add (state, text) {
      state.data = text;
    },
    remove (state) {
      state.data = null;
    }
  }