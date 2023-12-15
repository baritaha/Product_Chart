<template>
  <div id="app">
    <header class="top-bar spread">
      <nav class="top-bar-nav">
          <router-link to="/App" class="top-bar-link">
            <i class="icofont-spoon-and-fork"></i>
          </router-link>
            <router-link to="/HomeView" class="top-bar-link">
              <span>Home</span>|
            </router-link>
          <router-link to="/ProductsPage" class="top-bar-link">
            <span class="p">Products </span>|
          </router-link>
          <router-link to="/PastOrders" class="top-bar-link">
            <span>Past Orders</span>
          </router-link>
          <router-link to="/LoginPage" class="top-bar-link">
            <span>Login <em v-if="userId">{{'('+this.user.username+')'}}
              <button @click="logout">Logout</button>
            </em>
            <em v-else>(NOT Login)</em>
          </span>
          </router-link>
            <router-link to="/RegisterPage" class="top-bar-link">
            <span>Regist</span>
          </router-link>
          <p>id: {{ userId }}</p>
          Welcome {{ this.username }}
        </nav>
        <div @click="toggleSidebar" class="top-bar-cart-link">
          <i class="icofont-cart-alt icofont-1x"></i>
          <span>cart ({{counter}})</span>
        </div>
        <div v-if="user.isAuthenticated" class="welcome-message">
          
          
        </div>
    </header>
    <router-view :inventory="inventory" :addToCart="addToCart" :cart="cart" />
    <SideBar
      v-if="showSidebar"
      :toggle="toggleSidebar"
      :cart="cart"
      :calculatTotal="calculatTotal"
      :inventory="inventory"
      :remove="removeItem"
      :counter="counter"
      
    />
  </div>
</template>
<script>
import { mapState, mapGetters,mapMutations} from 'vuex';
const apiBaseUrl='http://localhost:5230'
import SideBar from '@/components/SideBar.vue';
import food from './food.json';
export default {
  props:['calculatTotal'],
  components: {
    SideBar,
  },
  data() {
    return {
      toggle: 'toggleSidebar',
      showSidebar: false,
      inventory: food,
      cart: {},
      username: '',
      apiBaseUrl: 'http://localhost:5230',
      counter:0
    }
  },
  created() {
    console.log('User object from store:', this.user);
    const storedUserId = localStorage.getItem('userId');
  const storedUsername = localStorage.getItem('username');

  if (storedUserId) {
    this.$store.commit('setUser', { username: storedUsername, userId: storedUserId });
  }

  },
  computed: {
    
    
    totalQuantity() {
      return Object.values(this.cart).reduce((acc, curr) => {
        return acc + curr;
      }, 0);
    },
    ...mapState(['user']),
    ...mapGetters(['getUserId']),
    user() {
      return this.$store.state.user;
    },
    userId() {
      return this.$store.state.user.userId;
    },
  },
  methods: {
    getPrice (name) {
      const product = this.inventory.find((p) => {
        
        return p.name === name
      })
      console.log(`Product name: ${name}, Price: ${product.price.USD}`);
      return product.price.USD
      
    },
    calculatTotal () {
      const names = Object.keys(this.cart);
  console.log("NAMES: ",names); // Log the cart contents for debugging

  const total = Object.values(this.cart).reduce((acc, curr, index) => {
    console.log('Cart contents:', this.cart);
console.log('Names:', names);
console.log('Curr:', curr);
console.log('Index:', index);

    return acc + (curr * this.getPrice(names[index]));
    
  }, 0);
  

  return total.toFixed(2);
    },
    name(){
      return this.user
    },
   async addToCart(name, index) {
    const userId = this.$store.getters.getUserId;
      if (!this.cart[name]) {
        this.cart[name] = 0;
      }
      const item = this.inventory[index];
      this.cart[name] += item.quantity;
      this.cart[name] += item.quantity=0;
      this.counter+=1;
      console.log(`Added ${item.quantity} of ${name} to cart`);
  console.log(`Cart contents:`, this.cart);
     
     /* const formData = new FormData();
      formData.append('productName',item.name);
      formData.append('type', item.type);
      formData.append('Price', item.price.USD);
      formData.append('Quantity', item.quantity);
      formData.append('userId', userId);
     console.log("userId in App.vue is "+userId)
    try {
      const response = await fetch(`${apiBaseUrl}/api/CartApp/AddProducts`, {
        method: 'POST',
        body:formData,
      });

      if (response.ok) {
       console.log("Added Successfully")
      } else {
        console.log("Not Added")
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      console.log(error)
    }*/
    },
    toggleSidebar() {
      this.showSidebar = !this.showSidebar;
    },
    removeItem(name) {
      delete this.cart[name];
    },
    setUsername(username) {
      this.username = username;
    },
    logout() {
      this.$store.dispatch('logout');
      this.$store.commit('clearUser');
      this.$router.push({ path: '/LoginPage' });
    },
  }
}
</script>

