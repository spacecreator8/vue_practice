

 Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        },
        details:{
            type: Array,
            required: true
        }
    },

    template: `
      <div class="product">
      
          <div class="product-image">
              <img :src="image" :alt="altText"/>
          </div>
   
          <div class="product-info">
              <h1>{{ title }}</h1>
              <div class="sale-box">
                  <div v-if="sale" :class="{red_text: sale}">Sale!</div>
                  <div v-else></div>
              </div>
              
              <p v-if="inStock">In stock</p>
              <p v-else>Out of Stock</p>
              <ul>
                  <li v-for="detail in details">{{ detail }}</li>
              </ul>

              <p>User is premium: {{ premium }}</p>
              <p>Shipping: {{ shipping }}</p>

              <div
                  class="color-box"
                  v-for="(variant, index) in variants"
                  :key="variant.variantId"
                  :style="{ backgroundColor:variant.variantColor }"
                  @mouseover="updateProduct(index)"
               ></div>

   
              <div class="cart">
                  <p>Cart({{ cart }})</p>
              </div>
   
              <button
                      v-on:click="addToCart"
                      :disabled="!inStock"
                      :class="{ disabledButton: !inStock }"
              >
                  Add to cart
              </button>
          </div>
      </div>
    `,
    data() {
        return {    
            product: "Socks",
            brand: 'Vue Mastery',  
            selectedVariant: 0,                   
            altText: "A pair of socks",
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10,
                    onSale:true,
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0,
                    onSale:false,
                }
            ],
            cart: 0
        }    
    },
    methods: {
        addToCart() {
            this.cart += 1
        },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        }         
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity;
        },
        sale(){
            return this.variants[this.selectedVariant].onSale;
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
         }
                 
    },
 })
 

 let app = new Vue({
    el: '#app', 
    data: {
        premium: true,
        details:['80% cotton', '20% polyester', 'Gender-neutral'],
    },
   
 })
