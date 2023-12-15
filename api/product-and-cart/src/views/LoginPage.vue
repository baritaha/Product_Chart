<template>
  <div class="login">
    <h1>Login Page</h1>
    <div class="lg">
      <label for="username">User Name:</label>
      <input v-model="username" type="text" name="username" id="username"><br/>
      <label for="password">Password:</label>
      <input v-model="password" type="password" name="password" id="password"><br/>

      <button class="login-button" @click="login">Login</button>
      <a class="signup-link" @click="goToSignUp">Don't have an account? Sign up here.</a>
    </div>
  </div>
</template>

<script>
 import { mapActions } from 'vuex';
export default {
  name: 'LoginPage',
  props: ['cart', 'pastOrders'],
  data() {
    return {
      username: '',
      password: '',
      apiBaseUrl: 'http://localhost:5230',
    }
  },
  methods: {
    ...mapActions(['login']),
    async login() {
      try {
        const formData = new FormData();
        formData.append('username', this.username);
        formData.append('password', this.password);

        const response = await fetch(`${this.apiBaseUrl}/api/CartApp/Login`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          if (data.isRegistered) {
            const userIdResponse = await fetch(`${this.apiBaseUrl}/api/CartApp/GetUserId?username=${this.username}`);
            const userIdData = await userIdResponse.json();
            const userId = userIdData.userId;
            this.$store.commit('setUser', { username: this.username, userId });
            console.log("id in login page is  "+userId+" username is "+this.username)
            localStorage.setItem('userId', userId);
            localStorage.setItem('username', this.username);
            
            this.$router.push({ path: '/App', query: { userId ,username} });
            
          } else {
            alert("You don't have an account");
          }
        } else {
          alert('Login failed');
        }
      } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred during login');
        console.log(error);
      }
    },
    goToSignUp() {
      this.$router.push({ path: '/RegisterPage' })
    }
  },
  created(){
    const storedUserId = localStorage.getItem('userId');
const storedUsername = localStorage.getItem('username');

if (storedUserId) {
  this.$store.commit('setUser', { username: storedUsername, userId: storedUserId });
}

  }
}
</script>
