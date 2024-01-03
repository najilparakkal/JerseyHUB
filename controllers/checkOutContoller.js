const Product = require("../models/productModels")
const User = require("../models/userModels");
const Cart = require("../models/cart")
const Address = require("../models/addressModel")
const Order = require("../models/orderModel")
const Razorpay = require("razorpay");
const { render } = require("../routes/userRouter");
const easyinvoice = require('easyinvoice')













const checkOut = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const user = await User.findById(userId);
        const cart = await Cart.findOne({ user: user._id })
        for (const item of cart.items) {
            item.products = await Product.findById(item.products)
        }
        const address = await Address.find({ userId: userId });
        res.render("checkOut", { address, user, cart });
    } catch (err) {
        console.log(err);
        res.render("404page");
    }
};











const itemCheckOut = async (req, res) => {
    try {
        const productId = req.query.id;
        const userId = req.session.user_id;
        const user = await User.findById(userId);
        const selectedProduct = await Product.findById(productId);
        const address = await Address.find({ userId: userId });
        res.render("itemCheckOut", { address, user, selectedProduct });
    } catch (err) {
        console.log(err);
    }
}














const editCartAdd = async (req, res) => {
    try {
        const addressId = req.query.id;
        const addressData = await Address.findById(addressId);
        res.render("editCartAdd", { address: addressData })
    } catch (err) {
        console.log(err);
        if (err) {
            res.render("404page")
        }
    }
}












const deleteCartAdd = async (req, res) => {
    try {
        const addressId = req.query.id;
        const remove = await Address.findOneAndDelete({ _id: addressId })
        if (remove) {
            res.redirect("/checkOut");
        } else {
            res.render("404page");
        }
    } catch (err) {
        console.log(err);
        if (err) {
            res.render("404page");
        }
    }
}










const updateCartAdd = async (req, res) => {
    try {

        const address = await Address.findByIdAndUpdate(req.body.id,
            {
                $set: {
                    fullName: req.body.fullName,
                    phoneNum: req.body.phoneNum,
                    district: req.body.district,
                    pincode: req.body.pincode,
                    city: req.body.city,
                    state: req.body.state,
                    houseNum: req.body.houseNum,
                }
            })
        if (address) {
            res.redirect("/CheckOut");
        } else {
            res.send("Somthing has happend Check the Console")
        }
    } catch (err) {
        console.log(err);
        if (err) {
            res.render("404page");
        }
    }
}










const checkOutAdd = async (req, res) => {
    try {
        res.render("checkOutAdd")
    } catch (err) {
        console.log(err);
        if (err) {
            res.render("404page")
        }
    }
}












const getCheckOutAdd = async (req, res) => {
    try {
        userId = req.session.user_id;
        if (userId) {
            const address = new Address({
                userId: userId,
                fullName: req.body.fullName,
                phoneNum: req.body.phoneNum,
                district: req.body.district,
                pincode: req.body.pincode,
                city: req.body.city,
                state: req.body.state,
                houseNum: req.body.houseNum,
            })
            await address.save()
            res.redirect("/checkOut")
        }
    } catch (err) {
        console.log(err);
        if (err) {
            res.render("404page")
        }
    }
}











const cancelOrder = async (req, res) => {
    try {
        const orderId = req.body.orderId;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        order.status = 'Cancelled';
        order.products.forEach(item => {
            item.status = 'Cancelled';
        });
        await order.save();
        res.status(200).json({ message: 'Order Cancelled Successfully', order });
        console.log('Order cancelled');
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error cancelling order' });
    }
};











const orders = async (req, res) => {
    try {
        const userId = req.session.user_id
        const orders = await Order.find({ user: userId }).populate('products.product').sort({ createdAt: -1 }).populate("address")
        res.render("orders", { userId, orders })
    } catch (err) {
        console.log(err);
        if (err) {
            res.render("404page");
        }
    }
}











const rzp = new Razorpay({
    key_id: process.env.RAZORPAYId,
    key_secret: process.env.RAZORPAYSECRET,
});












const placeOrder = async (req, res) => {
    try {
        const { selectedAddressId, paymentMethod, grandTotal, size } = req.body;
        const userId = req.session.user_id;
        if (paymentMethod === "COD") {
            let products = [];
            const cartItems = await Cart.findOne({ user: userId });
            for (let cartItem of cartItems.items) {
                const foundProduct = await Product.findById(cartItem.products);
                const updatedQuantity = foundProduct.quantity - cartItem.quantity;
                if (updatedQuantity < 0) {
                    console.log(`Insufficient quantity for product ID: ${cartItem.products}`);
                    return res.status(400).json({ error: "Insufficient product quantity" });
                }
                await Product.findByIdAndUpdate(foundProduct._id, { quantity: updatedQuantity });
                products.push({ product: foundProduct._id, quantity: cartItem.quantity, size: size, price: cartItem.price });
            }
            const order = new Order({
                user: userId,
                address: selectedAddressId,
                PaymentMethod: paymentMethod,
                products,
                grandTotal: grandTotal,

            });
            await order.save();
            await Cart.findByIdAndDelete({ _id: cartItems._id });
            return res.status(200).json({ message: "Order Placed" });
        } else if (paymentMethod === "razorpay") {
            const options = {
                amount: grandTotal * 100,
                currency: "INR",
                receipt: "Order Reciept" + Date.now(),
                payment_capture: 1
            }
            rzp.orders.create(options, (err, order) => {
                if (err) {
                    console.log(err);
                }
                return res.status(201).json({ order });
            })
        } else if (paymentMethod === "Wallet") {
            const cartItems = await Cart.findOne({ user: userId });
            let total = 0;
            for (const cartItem of cartItems.items) {
                const foundProduct = await Product.findById(cartItem.products);
                const productTotal = cartItem.quantity * foundProduct.price;
                total += productTotal;
            }
            const user = await User.findById(userId);
            const userWallet = user.wallet;
            if (total > userWallet) {
                return res.status(501).json({ status: false, message: "Insufficient wallet balance" });
            }
            user.wallet -= total;
            console.log(total);
            console.log(user.wallet);
            await user.save();
            return res.status(200).json({ status: true, message: "Order placed successfully" });
        } else {
            return res.status(400).json({ error: "Invalid payment method" });
        }
    } catch (error) {
        console.error("Error placing order:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

















const wallet = async (req, res) => {
    try {
        const { selectedAddressId, paymentMethod, grandTotal } = req.body;
        const userId = req.session.user_id;
        const user = await User.findById(userId);
        let products = [];
        const cartItems = await Cart.findOne({ user: userId });
        for (let cartItem of cartItems.items) {
            const foundProduct = await Product.findById(cartItem.products);
            const updatedQuantity = foundProduct.quantity - cartItem.quantity;
            if (updatedQuantity < 0) {
                console.log(`Insufficient quantity for product ID: ${cartItem.products}`);
                return res.status(400).json({ error: "Insufficient product quantity" });
            }
            await Product.findByIdAndUpdate(foundProduct._id, { quantity: updatedQuantity });
            products.push({ product: foundProduct._id, quantity: cartItem.quantity });
        }
        const order = new Order({
            user: userId,
            address: selectedAddressId,
            paymentMethod,
            products,
            grandTotal: grandTotal,
        });
        await order.save();
        await Cart.findByIdAndDelete({ _id: cartItems._id });
        return res.status(200).json({ message: "Funds added to the wallet successfully" });
    } catch (error) {
        console.error("Error handling wallet action:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

















const orderRazorpay = async (req, res) => {
    try {
        const { selectedAddressId, paymentMethod, grandTotal } = req.body;
        const userId = req.session.user_id;
        let products = [];
        const cartItems = await Cart.findOne({ user: userId });
        for (let cartItem of cartItems.items) {
            const foundProduct = await Product.findById(cartItem.products);
            const updatedQuantity = foundProduct.quantity - cartItem.quantity;
            if (updatedQuantity < 0) {
                console.log(`Insufficient quantity for product ID: ${cartItem.products}`);
                return res.status(400).json({ error: "Insufficient product quantity" });
            }
            await Product.findByIdAndUpdate(foundProduct._id, { quantity: updatedQuantity });
            products.push({ product: foundProduct._id, quantity: cartItem.quantity });
        }
        const order = new Order({
            user: userId,
            address: selectedAddressId,
            paymentMethod,
            products,
            grandTotal: grandTotal,
        });
        await order.save();
        await Cart.findByIdAndDelete({ _id: cartItems._id });
        const rzpOrder = await rzp.orders.create({
            amount: grandTotal * 100,
            currency: "INR",
            receipt: "Order receipt " + Date.now(),
            payment_capture: 1
        });

        res.status(201).json({ message: "Order placed successfully", order, rzpOrder });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


















const removeProduct = async (req, res) => {
    try {
        const { orderId, productId } = req.body;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        const productToUpdate = order.products.find(product => product._id.toString() === productId);
        if (!productToUpdate) {
            return res.status(404).json({ message: 'Product not found in the order' });
        }
        productToUpdate.status = 'Cancelled';
        await order.save();
        res.status(200).json({ message: 'Product status updated to Cancelled', order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating product status' });
    }
};












const invoice = async (req, res) => {
    try {
        const orderId = req.query.id;
        const order = await Order.findById(orderId)
            .populate('products.product')
            .populate('user')
            .populate('address');

        if (order) {
            order.products = order.products.filter(product => product.status !== 'Cancelled');
        }
        if (!order) {
            return res.status(404).send("Order not found");
        }
        const userDetails = order.user;
        const userAddress = order.address;
        const data = {
            "documentTitle": "Invoice",
            "currency": "INR",
            "taxNotation": "vat",
            "marginTop": 25,
            "marginRight": 25,
            "marginLeft": 25,
            "marginBottom": 25,
            "logo": "/assets/img/company-logos/jerseyhub-high-resolution-logo-transparent (3).png",
            "sender": {
                "company": "JerseyHUB",
                "address": "Btototype",
                "city": "Maradu",
                "country": "India"
            },
            "client": {
                "company": `<span style="color: blue;">Orderd client : </span>${userDetails.userName}`,
                "address": `<span style="color: red;">Billed Address :</span><br>${userAddress.fullName}<br>${userAddress.phoneNum}<br>${userAddress.district}<br> ${userAddress.pincode}<br> ${userAddress.houseNum}<br> ${userAddress.city}<br> ${userAddress.state}`
            },

            "products": order.products.map(product => {
                return {
                    "quantity": product.quantity,
                    "description": product.product.description,
                    "price": product.product.price,
                    "size": product.size,
                    "tax-rate": 5
                };
            }),
            "information": {
                "number": `${order.id}`,
                "date": order.createdAt ? order.createdAt.toISOString().split('T')[0] : '',
                "due-date": ''
            },
            "bottom-notice": "Thank You "
        };
        easyinvoice.createInvoice(data, function (result) {
            res.set({
                'Content-Disposition': 'attachment; filename="invoice.pdf"',
                'Content-Type': 'application/pdf'
            });
            res.send(Buffer.from(result.pdf, 'base64'));
        });
    } catch (err) {
        console.log(err);
        res.render("404page");
    }
}















module.exports = {
    checkOut,
    editCartAdd,
    deleteCartAdd,
    updateCartAdd,
    getCheckOutAdd,
    checkOutAdd,
    placeOrder,
    orders,
    itemCheckOut,
    cancelOrder,
    orderRazorpay,
    removeProduct,
    wallet,
    invoice
}