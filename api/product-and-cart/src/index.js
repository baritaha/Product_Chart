// store/index.js
import { createStore } from 'vuex';

export default createStore({
  
  state: {
    user: {
      username: '',
      isAuthenticated: false,
      userId: null, // Add userId property
    },
  },
  mutations: {
    setUser(state, { username, userId }) {
      state.user.username = username;
      state.user.isAuthenticated = true;
      state.user.userId = userId; // Set userId
    },
    clearUser(state) {
      state.user.username = '';
      state.user.isAuthenticated = false;
      state.user.userId = null; // Clear userId
    },
    logoutUser(state) {
      state.user.username = '';
      state.user.isAuthenticated = false;
      state.user.userId = null;
    },
  },
  
  actions: {
    async login({ commit }, { username, password }) {
      try {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);

        const response = await fetch(`http://localhost:5230/api/CartApp/Login`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          if (data.isRegistered) {
            commit('setUser', { username, userId: data.userId }); // Pass userId
          } else {
            console.log("Not registed data");
          }
        } else {
          console.log("Not login");
        }
      } catch (error) {
        console.error('Error during login:', error);
        // Handle error
      }
    },
    logout({ commit }) {
      
      commit('logoutUser');
  
      // Clear user data from local storage
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      localStorage.removeItem('pastOrders');
    },
    
  },
  
    getters: {
      getUserId: (state) => state.user.userId,
    },
  
});
