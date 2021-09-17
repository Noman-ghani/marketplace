export const state = () => ({
    list: null,
    settings: null,
    branch: null,
    staff: null
  })
  
  export const mutations = {
    addBusiness (state, text) {
      state.list = text;
    },
    addSettings (state, text) {
      state.settings = text;
    },
    addBranch (state, text) {
      state.branch = text;
    },
    staff (state, text) {
      state.staff = text;
    },
    remove (state) {
      state.list = null
      state.settings = null
      state.branch = null
      state.staff = null
    }
  }