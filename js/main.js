let eventBus = new Vue()


Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: false
        },
        details:{
            type: Array,
            required: true
        }
    },     
    template: `
     <div>   
       <ul>
         <span class="tab"
               :class="{ activeTab: selectedTab === tab }"
               v-for="(tab, index) in tabs"
               @click="selectedTab = tab"
               @mouseover="showCostShipping"
         >{{ tab }}</span>
       </ul>
       <div v-show="selectedTab === 'Reviews'">
         <p v-if="!reviews.length">There are no reviews yet.</p>
         <ul>
           <li v-for="review in reviews">
           <p>{{ review.name }}</p>
           <p>Rating: {{ review.rating }}</p>
           <p>{{ review.review }}</p>
           <p v-if="review.recomend == 1">Рекомендую</p>
           <p v-else-if="review.recomend == 0 ">Не рекомендую</p>
           </li>
         </ul>
       </div>
       <div v-show="selectedTab === 'Make a Review'">
            <product-review></product-review>
       </div>
       <div v-show="selectedTab === 'Shipping'" >
            <p>Стоймость доставки:  {{ shippingCost }}</p>
       </div>
       <div v-show="selectedTab === 'Details'" >
            <ul v-for="det in details">
                <li >{{ det }}</li>
            </ul>
       </div>
     </div>
    `,


    data() {
        return {
            tabs: ['Reviews', 'Make a Review', 'Shipping', 'Details'],
            selectedTab: 'Reviews',  // устанавливается с помощью @click
            shippingCost : 222,
        }
    },
    methods:{
        showCostShipping(){
            eventBus.$emit('custom');
        }
    },
    mounted(){
        eventBus.$on('result-shipping', function(shippingCost){
            this.shippingCost=shippingCost;
        }.bind(this))
    }
 })
 
 

Vue.component('product-review', {
    template: `
        <form class="review-form" @submit.prevent="onSubmit">
            <p v-if="errors.length">
                <b>Please correct the following error(s):</b>
                <ul>
                    <li v-for="error in errors">{{ error }}</li>
                </ul>
            </p>
            <p>
                <label for="name">Name:</label>
                <input id="name" v-model="name" placeholder="name">
            </p>
        
            <p>
                <label for="review">Review:</label>
                <textarea id="review" v-model="review"></textarea>
            </p>
        
            <p>
                <label for="rating">Rating:</label>
                <select id="rating" v-model.number="rating">
                    <option>5</option>
                    <option>4</option>
                    <option>3</option>
                    <option>2</option>
                    <option>1</option>
                </select>
            </p>
            <label>Вы рекомендуете этот товар?</label>
            <p>
                <input type="radio" v-model="recomend" value="1" checked name="recomend"/>Рекомендую
            </p>
            <p>
                <input type="radio" v-model="recomend" value="0" name="recomend"/>Не рекомендую
            </p>
        
            <p>
                <input type="submit" value="Submit"> 
            </p>
    
        </form>
  `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recomend: null,
            errors: [],

        }
    },
    methods:{
        onSubmit() {
            if(this.name && this.review && this.rating && this.recomend) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recomend: this.recomend,
                }
                eventBus.$emit('review-submitted', productReview)
                console.log(productReview);
                this.name = null
                this.review = null
                this.rating = null
                this.recomend = null
            } else {
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
                if(!this.recomend) this.errors.push("Recomendation required.")
            }
         }
         


         
     }
 
 })
 

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
              <p>{{ description }}</p>
              <a v-bind:href="link">More products like this</a>
              <div class="sale-box">
                  <div v-if="sale" :class="{red_text: sale}">On sale!</div>
                  <div v-else></div>
              </div>
              
              <p v-if="inStock">In stock</p>
              <p v-else :class="{out_of_stock:  !inStock}">Out of Stock</p>

              <p>Sizes:</p>
              <ul>
                  <li v-for="size in sizes">{{ size }}</li>
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
   
              <button
                      v-on:click="addToCart"
                      :disabled="!inStock"
                      :class="{ disabledButton: !inStock }"
              >
                  Add to cart
              </button>

              <button
              v-on:click="deleteFromCart"
              :disabled="!inStock"
              :class="{ disabledButton: !inStock }"
                >Delete
                </button>
          </div>

          <product-tabs :reviews="reviews" :details="details" ></product-tabs>

      </div>
    `,
    data() {
        return {    
            product: "Socks",
            brand: 'Vue Mastery',  
            selectedVariant: 0,                   
            altText: "A pair of socks",
            description:  " A pair of warm, fuzzy socks",
            link:"https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=sock",
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
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
            reviews: [],
        }    
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);

        },
        deleteFromCart() {
            this.$emit('del-from-cart', this.variants[this.selectedVariant].variantId);

        },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        },
        shipping2() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
         }       
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        }),
        eventBus.$on('custom', () => {
            let shippingCost = this.shipping2();
            eventBus.$emit('result-shipping', shippingCost);
        }); 
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
        cart: [],

    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        removeCart(id){
            this.cart.pop(id);
        }
             
     }     
 })
