const Cart = require("../models/cart")
const User = require("../models/userModels");
const Products = require("../models/productModels");
const mongoose = require("mongoose");











const addToCart = async (req, res) => {
    try {
        const { size } = req.body;
        let correctedSize = size;
        if (size === "MS" || size === "ML" || size === "MX" || size === "MXL" || size === "MXXL" || size === "MM") {
            correctedSize = size.slice(1);
        }
        const { id } = req.query;
        const user = req.session.user_id;
        let cart = await Cart.findOne({ user: user });
        if (cart === null) {
            cart = new Cart({
                user: user,
                items: [{
                    products: new mongoose.Types.ObjectId(id),
                    quantity: 1,
                    size: correctedSize
                }]
            });
            await cart.save();
        } else {
            const cartItem = cart.items.find((item) => item?.products + '' === id);
            if (cartItem) {
                cartItem.quantity += 1;
            } else {
                cart.items.push({
                    products: id,
                    quantity: 1,
                    size: correctedSize
                });
            }
            await cart.save();
        }
        res.status(200).json({ message: "Product added to cart", status: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};














const cart = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const user = await User.findById(userId);
        const cartData = await Cart.find({ user: userId }).populate('items.products');
        console.log(cartData.length);
        if (cartData.length > 0) {
            cartData.forEach(cartItem => {
                cartItem.items.forEach(async (item) => {
                    console.log(item, "👌👌👌");
                    const product = item.products;
                    if (product.offerPrice == null || product.offerPrice === undefined) {
                        console.log(product.price);
                        item.price = product.price;
                    } else {
                        item.price = product.offerPrice;
                    }
                    try {
                        await cartItem.save();
                    } catch (err) {
                        console.error(err);
                    }
                });
            });
            res.render("cart", { cart: cartData, user: user });
        } else {
            res.render("cart", { cart: null, user: user });
        }
    } catch (err) {
        console.error(err);
        res.render("404page");
    }
};















const dicQuantity = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const cart = await Cart.findOne({ user: userId });
        const findIndex = cart.items.findIndex(item => item.products.toString() === req.params.id);
        if (findIndex !== -1) {
            if (cart.items[findIndex].quantity === 1) {
                cart.items[findIndex].quantity = 1;
            } else {
                cart.items[findIndex].quantity -= 1;
            }
            await cart.save();
            res.status(200).json({ quantity: cart.items[findIndex].quantity });
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}












const incQuantity = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const cart = await Cart.findOne({ user: userId });
        const itemIndex = cart.items.findIndex(item => item.products.toString() === req.params.id);
        const product = await Products.findById(req.params.id)
        if (itemIndex !== -1) {
            cart.items[itemIndex].quantity += 1;
            await cart.save();
            let stock = product.stock - cart.items[itemIndex].quantity
            product.stock = stock
            res.status(200).json({ quantity: cart.items[itemIndex].quantity, stock: product.stock });
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}













const productPrice = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const cartData = await Cart.find({ user: userId }).populate('items.products');
        let productPrice
        cartData.forEach(cartItem => {
            cartItem.items.forEach(item => {
                const product = item.products;
                if (product.offerPrice == null || product.offerPrice === undefined) {
                    console.log(product.price);
                    item.price = product.price;
                    productPrice = item.price
                } else {
                    item.price = product.offerPrice;
                    productPrice = item.price
                }
            });
        });
        res.status(200).json({ price: productPrice });
    } catch (error) {
        console.error('Error fetching product price:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}










const getCartTotal = async (req, res) => {
    try {
        const cartId = req.params.cartId;
        const cart = await Cart.findById(cartId).populate("items.products")
        console.log(cart);
        let total = 0;
        if (cart) {
            cart.items.forEach((item) => {
                total += item.price * item.quantity;
            });
        }
        res.status(200).json({ total });
    } catch (error) {
        console.error('Error calculating cart total:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};










const removeProduct = async (req, res) => {

    try {
        const id = req.session.user_id
        const user = await User.findById(id)
        const cart = await Cart.findOne({ user: user._id }).populate("items.products");
        if (cart) {
            const dltProduct = cart.items.map(item => item.productId === id)
            if (dltProduct) {
                console.log(dltProduct);
                cart.items.splice(dltProduct, 1)
                await cart.save()
            }
        } else {
        }
        res.json({ status: true })
    } catch (error) {
        console.log(error, 'error while deleting cart item');
    }
}










module.exports = {
    cart,
    addToCart,
    dicQuantity,
    incQuantity,
    removeProduct,
    productPrice,
    getCartTotal
}