<template>
  <div class="PastOrder">
    <main class="wrapper">
      <h1 style="text-align: center;">Past Orders</h1>
      
      <h1 class="username" v-if="userId"  >Welcome <em>{{ user.username }}</em> </h1>
      <table class="product-table">
        <thead>
          <tr class="title">
            <td>Product Image</td>
            <td>Product</td>
            <td>Price</td>
            <td>Quantity</td>
            <td>Total</td>
            <td>Creation Date</td>
            <td>Options</td>
          </tr>
        </thead>
        <tbody class="output">
  <tr v-for="(order, index) in pastOrders" :key="index">
    <td><i :class="'icofont-'+ getIconByName(order.productName) +' icon icofont-5x'"></i></td>
    <td>{{ order.productName }}</td>
    <td>{{ order.Price }}</td>
    <td>{{ order.Quantity }}</td>
    <td>{{ order.Price * order.Quantity }} $</td>
    <td>{{ order.orderDate }}</td>
    <td><button type="button" class="btn btn-outline-success" @click="DetailsProduct(index)">Details</button></td>
    <tr v-if="expandedProductIndex === index">
    <td colspan="6">
      <p>Product Name : {{ order.productName }}</p>
      <p>Price : {{ order.Price }}$</p>
      <p>Date Added : {{ order.orderDate }}</p>
      <p>Quantity : {{ order.Quantity }}</p>
      <p>Total Price : {{ order.Price * order.Quantity }}$</p>
    </td>
  </tr>
  </tr>

</tbody>


      </table>
    </main>
  </div>
</template>

<script>
import { mapState } from 'vuex';
const apiBaseUrl = 'http://localhost:5230';

export default {
  
  computed: {
    ...mapState(['user']),
    user() {
      return this.$store.state.user;
    },
    userId() {
      return this.$store.state.user.userId;
    },
  },
  
  name: 'PastOrders',
  props: ['cart', 'inventory','index'],
  data() {
    return {
      pastOrders: [],
      expandedProductIndex: -1,
    };
  },
  methods: {
    async fetchPastOrders(userId) {
      try {
        
        userId=this.userId;
        if(userId){
        const response = await fetch(`${apiBaseUrl}/api/CartApp/GetPastOrders?userId=${userId}`);
        console.log("API URL:", apiBaseUrl);
        if (response.ok) {
          const pastOrdersData = await response.json();
          this.pastOrders = [];
          pastOrdersData.forEach((orderData) => {
            const existingOrder = this.pastOrders.find(order => order.productName === orderData.productName);
            if (existingOrder) {
              existingOrder.Quantity += orderData.Quantity;
            } else {
              this.pastOrders.push(orderData);
            }
          });
          this.$store.commit('setUser', { username: this.user.username, userId });
          localStorage.setItem('userId', this.userId);
            localStorage.setItem('username', this.user.username);
          localStorage.setItem('pastOrders', JSON.stringify(this.pastOrders));
        } else {
          console.error('Error fetching past orders:', response.statusText);
        }
      }else{
        console.log("Your not Login yet");
      }
      } catch (error) {
        console.error('Error fetching past orders:', error);
      }
    },
    getIconByName(name) {
  const item = this.inventory.find(item => item.name === name);
  return item && item.icon ? item.icon : 'Default-icon'; 
},
    logUserId() {
    console.log('UserId:', this.userId);
  },
  DetailsProduct(index) {
    if (this.expandedProductIndex === index) {
      this.expandedProductIndex = -1;
    } else {
      this.expandedProductIndex = index;
    }
  },
  },
  created() {
    console.log(this.user.userId)
    this.fetchPastOrders();
const storedPastOrders = localStorage.getItem('pastOrders');
if (storedPastOrders) {
  this.pastOrders = JSON.parse(storedPastOrders);
}
const storedUserId = localStorage.getItem('userId');
const storedUsername = localStorage.getItem('username');

if (storedUserId) {
  this.$store.commit('setUser', { username: storedUsername, userId: storedUserId });
}


  },
};
</script>
