<template>
  <div class="regist">
    <h1>Register Page</h1>
    <div class="rg">
      User Name: <input type="text" v-model="username" title="Username" /><br />
      Password: <input type="password" v-model="password" title="Password" /><br />
      Confirm Password: <input type="password" v-model="confirmPassword" title="Confirm Password" /><br />
      <button class="btn btn-dark" @click="register">Register</button>
      <a class="signup-link" @click="goToLogin">Have an account? Login here.</a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      confirmPassword: '',
      apiBaseUrl: 'http://localhost:5230',
    };
  },
  methods: {
    async register(username,i) {
      if (this.password !== this.confirmPassword) {
        alert("Passwords don't match")
        return ;
      }

      try {
        const formData = new FormData();
        formData.append('username', this.username);
        formData.append('password', this.password);
        formData.append('Cpassword', this.confirmPassword);

        const response = await fetch(`${this.apiBaseUrl}/api/CartApp/Registing`, {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          alert('Registration successful');
          this.$router.push({ path: 'LoginPage' });
        } else {
          alert('Registration failed');
        }
      } catch (error) {
        console.error('Error during registration:', error);
        alert('An error occurred during registration');
        console.log(error);
      }
    },
    goToLogin() {
      this.$router.push({ path: 'LoginPage' });
    }
  }
};
</script>
