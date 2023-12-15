let app = Vue.createApp({
    
    data() {
      return {
        showSidebar:false,
        inventory: [
        { "id": 1,  "name": "Raddishes",   "icon": "raddish",    "price": { "USD": 3.26, "NOK": 17.43 }, "type": "vegetable" },
{ "id": 2,  "name": "Artichokes",  "icon": "artichoke",  "price": { "USD": 9.44, "NOK": 15.82 }, "type": "vegetable" },
{ "id": 3,  "name": "Broccoli",    "icon": "broccoli",   "price": { "USD": 5.20, "NOK": 16.66 }, "type": "fruit" },
{ "id": 5,  "name": "Cabbages",    "icon": "cabbage",    "price": { "USD": 0.95, "NOK": 62.33 }, "type": "vegetable" },
{ "id": 6,  "name": "Cherries",    "icon": "cherry",     "price": { "USD": 1.04, "NOK": 62.50 }, "type": "fruit"     },
{ "id": 7,  "name": "Carrots",     "icon": "carrot",     "price": { "USD": 4.82, "NOK": 72.74 }, "type": "vegetable" },
{ "id": 8,  "name": "Corn",        "icon": "corn",       "price": { "USD": 7.53, "NOK": 99.43 }, "type": "vegetable" },
{ "id": 9,  "name": "Grapes",      "icon": "grapes",     "price": { "USD": 4.94, "NOK": 88.29 }, "type": "fruit"     },
{ "id": 10, "name": "Onions",      "icon": "onion",      "price": { "USD": 6.45, "NOK": 69.53 }, "type": "vegetable" },
{ "id": 11, "name": "Oranges",     "icon": "orange",     "price": { "USD": 9.95, "NOK": 96.53 }, "type": "fruit"     },
{ "id": 12, "name": "Peas",        "icon": "peas",       "price": { "USD": 2.61, "NOK": 65.74 }, "type": "vegetable" },
{ "id": 13, "name": "Pineapples",  "icon": "pineapple",  "price": { "USD": 1.62, "NOK": 35.22 }, "type": "fruit"     },
{ "id": 14, "name": "Steaks",      "icon": "steak",      "price": { "USD": 8.32, "NOK": 83.08 }, "type": "meat"      },
{ "id": 15, "name": "Watermelons", "icon": "watermelon", "price": { "USD": 5.08, "NOK": 89.69 }, "type": "fruit"     },
{ "id": 16, "name": "Sausages",    "icon": "sausage",    "price": { "USD": 3.69, "NOK": 26.68 }, "type": "meat"      }

        ]
         ,
        cart: {}
        
        
      }
    },
    computed:{
      totalQuantity(){
    
    return Object.values(this.cart).reduce((acc,curr)=>{
return acc+curr
    },0)
    
  }
    },
    methods: {
      addToCart(name,index) {
       if(!this.cart[name]) {this.cart[name]=0
      }
        this.cart[name] += this.inventory[index].quantity
        this.inventory[index].quantity=0
       
        
        console.log(name,index)
        console.log(this.cart)
      },
      toggleSidebar(){
        this.showSidebar=!this.showSidebar
      },
   
     
    }
  })
  app.component('sidebar',({
    props:['toggle','cart','inventory','remove'],
    computed:{
   cartTotal(){
return (this.cart.carrots*4.82).toFixed(2)
},

},
    

    methods:{
      getPrice(name) {
const product = this.inventory.find((p) => p.name === name);

if (product && product.price && product.price.USD) {
return product.price.USD;
} else {
return 0; // Default value if product or its price is not found
}
}
,
removeItem(name){
delete this.cart[name]
},
getTotal(name,quantity){
let T=(quantity*this.getPrice(name)).toFixed(2)
if(T!==null){
return T
}
return 0.0
},
calculatTotal(){
const names=Object.keys(this.cart)
const total =Object.values(this.cart).reduce((acc,curr,index)=>{
console.log("current  : "+ acc,curr,names[index])
return acc+(curr*this.getPrice(names[index]))

},0)

return total.toFixed(2)

},

    },
   
template:`

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
              <td>{{getTotal(name,quantity)}}</td>
              <td class="center">
                <button class="btn btn-light cart-remove" @click="removeItem(name)">
                  &times;
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <p class="center" v-if="!Object.keys(cart).length"><em>No items in cart</em></p>
        <div class="spread">
          <span><strong>Total:</strong>{{calculatTotal()}} </span>
          <button class="btn btn-light">Checkout</button>
        </div>
      </div>
    </div>
  </aside>
`
}))
  app.mount('#app')