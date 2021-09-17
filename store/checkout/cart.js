export const state = () => ({
    data: null
  })
  
  export const mutations = {
    add (state, text) {
      state.data = text;
    },
    remove (state, cart) {
      state.data = state.data.filter(data => data.service_id !== cart.service_id);
    },
    removeAll (state) {
      state.data = null;
    }
  }