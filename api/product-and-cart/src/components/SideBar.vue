<template>
    <aside class="cart-container">
    <div class="cart">
      <h1 class="cart-title spread">
        <span>
          Cart
          <i class="icofont-cart-alt icofont-1x"></i>
        </span>
        <button @click="toggle" class="cart-close">&times;</button>
      </h1>
      <div class="cart-body">
        <table class="cart-table">
          <thead>
            <tr >
              <th><span class="sr-only">Product Image</span></th>
              <th>Product</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Total</th>
              <th><span class="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(quantity,name,i) in cart" :key="i">
              <td><i class="icofont-carrot icofont-3x"></i></td>
              <td>{{name}}</td>
              <td>{{getPrice(name)}}</td>
              <td class="center">{{quantity}}</td>
              <td>{{getTotal(name,quantity)}} $</td>
              <td class="center">
                <button class="btn btn-light cart-remove" @click="remove(name)">
                  &times;
                </button>
              </td>
             <td>
            
              </td>
            </tr>
          </tbody>
        </table>

        <p class="center" v-if="!Object.keys(cart).length"><em>No items in cart</em></p>
        <div class="spread">
          <span><strong>Total: </strong>{{calculatTotal}} $</span>
          <button class="btn btn-light" @click="openConfirmationDialog">Checkout</button>
        </div>
        <div v-if="successMessage" class="success-message">
              {{ successMessage }}
        </div>
      </div>
    </div>
  </aside>
</template>
<script >
const apiBaseUrl = 'http://localhost:5230';
import { mapState, mapGetters ,mapMutations } from 'vuex';
import food from '@/food';
export default {
  data(){
    return{
      inventory: food,
      successMessage: '',
      isConfirmationOpen: false,
      counter:0
     

      
    }
  },
  props:['toggle', 'cart', 'inventory', 'remove', 'calculatTotal'],
   
  computed:{
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
    ...mapState(['user']),
    ...mapGetters(['getUserId']),
    user() {
      return this.$store.state.user;
    },
    userId() {
      return this.$store.state.user.userId;
    },
  },
  created() {
    console.log('User object from side page:', this.user);
    const storedUserId = localStorage.getItem('userId');
  const storedUsername = localStorage.getItem('username');

  if (storedUserId) {
    this.$store.commit('setUser', { username: storedUsername, userId: storedUserId });
  }

  },
  methods: {
    openConfirmationDialog() {
      if(!this.userId){
        this.$router.push({ path: 'LoginPage' });
      }
      else{
  this.isConfirmationOpen = true;
  const priceMessage = `The price required from you is ( ${this.calculatTotal()} $ ). Do you want to proceed?`;
  if (window.confirm(priceMessage)) {
    this.checkoutAndFetch();
  } else {
    // User canceled, do nothing
  }
  this.isConfirmationOpen = false;
}
},

    async checkoutAndFetch() {
  if (window.confirm('Do you want to Add?')) {
    const userId = this.userId;
    const productPromises = [];
    const itemsToRemove = [];

    for (const [name, quantity] of Object.entries(this.cart)) {
      const itemIndex = this.inventory.findIndex((product) => product.name === name);
      if (itemIndex !== -1) {
        const item = this.inventory[itemIndex];
        const formData = new FormData();
        formData.append('productName', item.name);
        formData.append('type', item.type);
        formData.append('Price', item.price.USD);
        formData.append('Quantity', quantity);
        formData.append('userId', userId);

        productPromises.push(
          fetch(`${apiBaseUrl}/api/CartApp/AddProducts`, {
            method: 'POST',
            body: formData,
          })
        );
        itemsToRemove.push(name);
      } else {
        console.error(`Item "${name}" not found in the inventory.`);
      }
    }

    
    try {
      const responses = await Promise.all(productPromises);

      // Check the responses and handle accordingly
      for (let i = 0; i < responses.length; i++) {
        if (responses[i].ok) {
          this.successMessage = `Products  added successfully SEE Past Orders Page`;
          console.log(`Added product to AddProduct database successfully `);
          setTimeout(() => {
           this.successMessage = '';
            }, 5000);
          const itemName = itemsToRemove[i];
          if (itemName) {
            delete this.cart[itemName];
          }
        } else {
          console.log(`Failed to add product to AddProduct database`);
        }
      }
    } catch (error) {
      console.error('Error adding products to AddProduct database:', error);
    }
  } else {
    // If "No" is clicked, do nothing or provide feedback to the user
    window.confirm('Checkout canceled');
    console.log(this.cart);
  }
  
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
    getPrice (name) {
      const product = this.inventory.find((p) => {
        
        return p.name === name
      })
      console.log(`Product name: ${name}, Price: ${product.price.USD}`);
      return product.price.USD
      
    },
   
    removeItem(name) {
      delete this.cart[name];
    },
    removing(){
      delete this.cart[name];
    },
    getTotal (name, quantity) {
      const T = (quantity * this.getPrice(name)).toFixed(2)
      if (T !== null) {
        return T
      }
      return 0
    },
    goToLogin () {
      this.$router.push({ path: '/LoginPage' })
    },
    clearCart() {
      this.$store.commit('clearCart'); 
  },
  }
}
</script>
