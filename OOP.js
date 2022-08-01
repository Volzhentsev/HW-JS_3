class Good {
    constructor(id, name, description, sizes, price, available) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.sizes = sizes;
        this.price = price;
        this.available = available;
    }
    setAvailable(available) {
        this.available = available;
    }
}

class GoodsList{
    #goods
    constructor(goods, filter, sortPrice, sortDir) {
        this.#goods = goods;
        this.filter =  filter;
        this.sortPrice = sortPrice;
        this.sortDir = sortDir;
    }
    add(good) {
        this.#goods.push(good);
    }
    remove(id){
        for(let i=0; i<this.#goods.length; i++){
            if (this.#goods[i]['id'] === id){
                this.#goods.splice(i,1);
            }
        }
    }
    get list() {
        let goodsList = [];
        if (this.sortPrice != undefined){
            if(this.sortDir == false){
                goodsList = this.#goods.sort((a, b) => b.price > a.price ? 1 : -1);
            } else{
                goodsList = this.#goods.sort((a, b) => a.price > b.price ? 1 : -1);
            }
        }
        if (this.filter != undefined) {
            goodsList = goodsList.filter(good => this.filter.test(good.name));
        }
        goodsList = goodsList.filter(good => good.available);
        return goodsList;
    }
} 

class BasketGood extends Good {
    constructor(id, name, description, sizes, price, available, amount) {
        super(id, name, description, sizes, price, available);
        this.amount = amount;
    }
}

class Basket {
    constructor(goods) {
        this.goods = goods;
    }
    get totalAmount() { 
        return this.goods.reduce((a,b)=>a.amount+b.amount);
    }
    get totalSum() {
        let sum = 0;
        this.goods.forEach(good => sum += good.price * good.amount);
        return sum;
    } 
    clear() {
        this.goods.length = 0;
    }
    removeUnavailable() {
        let g = this.goods.filter((good) => good.available==true);
        return this.goods = g;
    } 
    add(good, amount) {
        let goodId = this.goods.findIndex(value => value.id === good.id)
        if (goodId >= 0) {
            this.goods[goodId].amount += amount;
        } else {
            let newBasketGood = new BasketGood(good.id, good.name, good.description, good.sizes, good.price, good.available, amount);
            this.goods.push(newBasketGood);
        }
    }

    remove(good, amount) {
        let goodIndex = this.goods.findIndex(good => good.id === good.id);
        let currentAmount = this.goods[goodIndex].amount;
        if (goodIndex >= 0) {
            if (currentAmount - amount === 0) {
                this.goods.splice(goodIndex, 1);
            } else {
                currentAmount -= amount;
                goods.amount = currentAmount;
            }
        }
    }
}

let good1 = new Good(1, 't-shirt', 'sport', ['xs', 's', 'm', 'l'], 150, true);
let good2 = new Good(2, 'socks', 'sport', [42, 43], 50, true);
let good3 = new Good(3, 'shoes', 'chelsea', [41, 44, 45], 550, true);
let good4 = new Good(4, 'pants', 'boxer', ['m', 'xl', 'xxl'], 100, true);
let good5 = new Good(5, 'belt', 'crocodile skin', ['one size'], 777, true);

console.log(good5);
good5.setAvailable(false);
console.log(good5);

let goodList1 = new GoodsList([good1,good4],/[a-z]/u, true,false);
goodList1.add(good3);
goodList1.add(good2);
goodList1.remove(1);
console.log(goodList1.list);

let basketGood1 = new BasketGood(1, 't-shirt', 'sport', ['xs', 's', 'm', 'l'], 150, true, 5);
let basketGood2 = new BasketGood(5, 'belt', 'crocodile skin', ['one size'], 777, false, 3);
let basketGood3 = new BasketGood(3, 'shoes', 'chelsea', [41, 44, 45], 550, true, 2);
console.log(basketGood2);
let basket = new Basket([basketGood1, basketGood2 ]);
console.log(basket);
console.log(basket.totalAmount);
console.log(basket.totalSum);
basket.removeUnavailable();
basket.remove(basketGood1, 5);
basket.add(basketGood3, 3);
console.log(basket);
basket.clear();
console.log(basket);
console.log(basket.goods.length)