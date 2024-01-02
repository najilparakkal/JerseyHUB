const User = require("../models/userModels");
const Admin = require("../models/adminModels");
const Category = require("../models/categoryModels")
const Products = require("../models/productModels")
const Orders = require("../models/orderModel");
const { render } = require("../routes/userRouter");
const PDFDocument = require("pdfkit")
const excel = require('exceljs');



const loadLogin = async (req, res) => {
    try {
        res.render("adminLogin", { message: "" });
    }
    catch (err) {
        console.log(err.message);
    }
}


const verifyAdmin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const adminData = await Admin.findOne({ password: password });

        if (adminData) {
            if (adminData.password === password) {
                req.session.admin_id = adminData._id;
                res.redirect("/admin/home");
            } else {
                res.render("adminLogin", { message: "Invalid Adm" });
            }
        } else {
            res.render("adminLogin", { message: "You are Not a Admin" });
        }


    } catch (err) {
        console.log(err.message);
    }
}


const loadMainPage = async (req, res) => {
    try {

        const users = await User.find();

        const recentUsers = await User.aggregate([
            {
                $sort: { createdAt: -1 } // Sort by createdAt field in descending order (recent first)
            },

            {
                $limit: 3 // Limit the result to the last 10 recently registered users (adjust as needed)
            }
        ]);


        const products = await Products.find({ isListed: true })

        const categories = await Category.find();

        const orders = await Orders.find();
        const totalOrders = orders.length
        const totalDeliverdOrders = await Orders.aggregate([
            { $match: { status: "Delivered" } }
        ])
        const totalRevenue = await Orders.aggregate([
            { $match: { status: "Delivered" } },
            { $group: { _id: null, total: { $sum: "$grandTotal" } } },
            { $project: { _id: 0 } }
        ])

        const totalValue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

        const monthlyRevenue = await Orders.aggregate([
            {
                $match: {
                    status: "Delivered", // Filter by orders with status "Delivered"
                    createdAt: { $exists: true } // Filter to ensure createdAt field exists
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    total: { $sum: "$grandTotal" }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);

        const monthlySalesRevenue = monthlyRevenue.map((item) => item.total || 0);



        const monthlyOrders = await Orders.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);
        const monthlyOrdersCount = Array.from({ length: 12 }, (_, index) => {
            const monthData = monthlyOrders.find(
                (item) => (item._id.month === index + 1) || (item._id.month === index)
            );
            return monthData ? monthData.count : 0;
        });



        const monthlySales = await Orders.aggregate([
            {
                $match: {
                    status: "Delivered", // Filter by status
                },
            },
            {
                $group: {
                    _id: {
                        $month: "$createdAt",
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: {
                    _id: 1,
                },
            },
        ]);
        const monthlySalesArray = Array.from({ length: 12 }, (_, index) => {
            const monthData = monthlySales.find((item) => item._id === index + 1);
            return monthData ? monthData.count : 0;
        });



        const categorySales = await Orders.aggregate([
            {
              $match: {
                status: "Delivered", // Filter by status
              },
            },
            {
              $unwind: "$products",
            },
            {
              $lookup: {
                from: "products", // Assuming your products collection is named 'products'
                localField: "products.product",
                foreignField: "_id",
                as: "productInfo",
              },
            },
            {
              $unwind: "$productInfo",
            },
            {
              $group: {
                _id: "$productInfo.category", // Group by category
                totalSales: { $sum: "$products.quantity" }, // Calculate total sales quantity
              },
            },
          ]);
      



        const monthlyDeliveredOrders = await Orders.aggregate([
            {
                $match: {
                    status: "Delivered",
                    createdAt: { $exists: true }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);


        const monthlyCancelledOrders = await Orders.aggregate([
            {
              $match: {
                status: "Canceled" // Match the "Canceled" status
              }
            },
            {
              $group: {
                _id: {
                  year: { $year: "$createdAt" },
                  month: { $month: "$createdAt" }
                },
                count: { $sum: 1 } // Count the canceled orders per month
              }
            },
            {
              $sort: { "_id.year": 1, "_id.month": 1 } // Sort by year and month
            }
          ]);
          
          


        // Assuming you have a user field in the orders collection
        const monthlyUsers = await Orders.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                        user: "$user" // Replace with actual user reference field
                    }
                }
            },
            {
                $group: {
                    _id: {
                        year: "$_id.year",
                        month: "$_id.month"
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);
        const monthlyUsersCount = Array.from({ length: 12 }, (_, index) => {
            const monthData = monthlyUsers.find(
                (item) => (item._id.month === index + 1) || (item._id.month === index)
            );
            return monthData ? monthData.count : 0;
        });



        const totalCategories = categories.length
        const totalProducts = products.length;



        let topRevenueMonthsAggregate = await Orders.aggregate([
            {
                $match: {
                    status: "Delivered" // Match documents with the "Delivered" status
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" } // If you want to consider the year as well
                    },
                    totalRevenue: { $sum: "$grandTotal" }
                }
            },
        ]);
   
        console.log(topRevenueMonthsAggregate, "👌");
        const topRevenueMonthsData = topRevenueMonthsAggregate.map((entry) => ({
            month: entry._id.month, // Extract the month value
            totalRevenue: entry.totalRevenue,
        }));

        // Extract month names for labels
        const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        const topRevenueLabels = monthNames
        const topRevenueValues = Array.from({ length: 12 }, (_, i) => {
            const monthData = topRevenueMonthsData.find((data) => data.month === i + 1);
            return monthData ? monthData.totalRevenue : 0; // If data exists for the month, use its revenue; otherwise, default to 0
        });

        console.log(topRevenueLabels, topRevenueValues, "😂😂😂😂");

        const latestOrders = await Orders.find().sort({ createdAt: -1 }).limit(5).populate("products.product").populate("user").populate("address")
        res.render("mainPage", {
            totalProducts,
            totalCategories,
            totalValue,
            totalOrders,
            monthlyRevenue,
            users,
            monthlyOrders,
            monthlyUsers,
            monthlyDeliveredOrders,
            monthlySalesArray,
            monthlySalesRevenue,
            monthlyOrdersCount,
            monthlyUsersCount,
            // monthlyrevenue,
            topRevenueLabels,
            topRevenueValues,
            recentUsers,
            latestOrders,
            categories,
            categorySales,
            totalDeliverdOrders,
            monthlyCancelledOrders
        })
    } catch (err) {
        console.error(err);
        console.log(err.message);
    }
}




// const userDetail = async (req, res) => {
//     try {
//         console.log("sioujkncv sldkoervnc sw;klvniucsw;likjorucfnv;hswiurvnchw;siu");
//         const userDetails = {
//             userName: 'John Doe',
//             email: 'john@example.com',
//             // Other user details
//         };

//         // Send user details as JSON response
//         res.status(200).json({ userDetails });
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };



const logoutAdmin = async (req, res) => {
    try {
        req.session.admin_id = null;
        res.redirect("/admin");
    } catch (err) {
        console.log(err.message);
    }
}





const usersList = async (req, res) => {
    try {
        const users = await User.find().sort({ userName: 1 })
        res.render("usersList", { users });
    }
    catch (err) {
        console.log(err.message);
    }
}


const block = async (req, res) => {
    try {
        const userId = req.query.id;
        const blockUser = await User.findByIdAndUpdate(userId, { isBlocked: true });

        if (blockUser) {
            res.redirect("/admin/users");
        } else {
            res.status(404).send("User Not Found");
        }
    } catch (err) {
        console.log(err);
    }
}

const unBlock = async (req, res) => {
    try {
        const userId = req.query.id;
        const unBlock = await User.findByIdAndUpdate(userId, { isBlocked: false });
        if (unBlock) {
            res.redirect("/admin/users");
        } else {
            res.status(404).send("User not Found");
        }
    } catch (err) {
        console.log(err);
    }
}


const categories = async (req, res) => {
    try {
        const usersCatagory = await Category.find();

        res.render("usersCategories", { category: usersCatagory })
    }
    catch (err) {
        console.log(err);
    }
}

const addCategory = async (req, res) => {
    try {

        const { name, description } = req.body;
        const nameRegex = new RegExp(name, "i");
        const checkData = await Category.findOne({ name: { $regex: nameRegex } });

        if (checkData) {
            const errMessage = "Category alredy exists";
            res.redirect(`/admin/categories?error=${encodeURIComponent(errMessage)}`)
        } else {
            const addingcategory = new Category({
                name: name,
                description: description
            })
            await addingcategory.save();

            res.redirect("/admin/categories")

        }


    } catch (error) {
        console.log(err);
    }
}


const blockCategory = async (req, res) => {
    try {
        const categoryId = req.query.id;
        const blocked = await Category.findByIdAndUpdate(categoryId, { isListed: false });

        if (blocked) {
            res.redirect("/admin/categories");
        } else {
            res.status(404).send("User Not Found......");

        }
    } catch (err) {
        console.log(err);
    }
}


const unBlockCategory = async (req, res) => {
    try {

        const categoryId = req.query.id;
        const unBlock = await Category.findByIdAndUpdate(categoryId, { isListed: true });


        if (unBlock) {
            res.redirect("/admin/categories");
        } else {
            res.status(404).send("User Not Find")
        }
    } catch (err) {
        console.log(err);
    }
}

const editCategory = async (req, res) => {
    try {
        const categoryId = req.query.id;
        const categoryData = await Category.findById(categoryId);
        if (categoryData) {
            res.render("editCategory", { Category: categoryData })
        } else {
            return res.status(404).send("NOT AVAILABLE")
        }
    } catch (err) {
        console.log(err);
    }
}



const updatCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.body.id,
            {
                $set:
                {
                    name: req.body.name,
                    description: req.body.description
                }
            });

        res.redirect("/admin/categories");



    } catch (err) {
        console.log(err);
    }
}





///////////////////////////////////////////////////////////////////
const deleteCategory = async (req, res) => {
    try {
        const categoryid = req.query.id;
        const remove = await Category.findByIdAndDelete({ _id: categoryid })
        if (remove) {
            res.redirect("/admin/categories");
        } else {
            res.send("NOT DELETED")
        }
    } catch (err) {
        console.log(err);
        if (err) {
            res.render("404page")
        }
    }
}



const productList = async (req, res) => {
    try {
        const product = await Products.find()
        res.render("productList", { product: product })
    } catch (err) {
        if (err) {
            res.render("404page")
        }
    }
}



const loadCreateingProduct = async (req, res) => {
    try {
        const category = await Category.find()
        res.render("loadCreateProductPage", { category });

    } catch (err) {
        if (err) {
            res.render("404Page");
            console.log(err);
        }
    }
}


const createProduct = async (req, res) => {
    try {

        const creatingProduct = {
            name: req.body.name,
            description: req.body.description,
            stock: req.body.stock,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            coverimage: "/product/" + req.session.images[0],
            images: [
                "/product/" + req.session.images[1],
                "/product/" + req.session.images[2],
                "/product/" + req.session.images[3],


            ]
        };
        req.session.images = null
        await Products.insertMany([creatingProduct]);
        // req.session
        res.redirect("/admin/productList")

    } catch (error) {

        console.log(error);

    }
}

const blockProduct = async (req, res) => {

    try {
        const product_id = req.query.id;
        const blocked = await Products.findByIdAndUpdate(product_id, { status: false, isListed: false })

        if (blocked) {
            res.redirect("/admin/productList")
        } else {
            res.render("404page")
        }


    } catch (err) {
        console.log(err);
        if (err) {
            res.render("404page")
        }
    }

}

const unblockproduct = async (req, res) => {
    try {

        const product_id = req.query.id;
        const unblock = await Products.findByIdAndUpdate(product_id, { status: true, isListed: true });

        if (unblock) {
            res.redirect("/admin/productList")
        } else {
            res.render("404page")
        }


    } catch (err) {
        console.log(err);
        if (err) {
            res.render("404page")
        }
    }
}

const editProduct = async (req, res) => {
    try {
        const productId = req.query.id

        const product = await Products.findById(productId);
        const category = await Category.find({ isListed: true })
        res.render("editProduct", { product: product, category })

    } catch (err) {
        console.log(err);
        if (err) {
            res.render("404page")
        }
    }
}

const updateProduct = async (req, res) => {
    try {
        const product = await Products.findById(req.body.id)
        const coverimage = product.coverimage
        const images = product.images
       console.log(images,'🙌🙌');
       console.log(coverimage);
        const updating = await Products.findByIdAndUpdate(req.body.id,
            {
                $set: {
                    name: req.body.name,
                    description: req.body.description,
                    stock: req.body.stock,
                    brand: req.body.brand,
                    price: req.body.price,
                    category: req.body.category,
                    coverimage:  req.session.images ?'/product/' +( req.session.images[0]) : coverimage,
                    images: [
                        req.session.images ?"/product/" +(req.session.images[1]):images[0],
                        req.session.images ?"/product/" +(req.session.images[2]):images[1],
                        req.session.images ?"/product/" +(req.session.images[3]):images[2],        
        
                    ]
                },
            }
        );

        req.session.images = null
        if (updating) {
            res.redirect('/admin/productList')
        } else {
            res.send("ERROR CHECK THE CODE")
        }


    } catch (err) {
        console.error(err);
        res.status(500).send(`Internal Server Error: ${err.message}`);
    }
};


const deletProduct = async (req, res) => {
    try {
        const product_id = req.query.id;
        const remove = await Products.findByIdAndDelete({ _id: product_id });

        if (remove) {
            res.redirect("/admin/productList");
        } else {
            res.send("Product not found or could not be deleted.");
        }
    } catch (err) {
        console.error(err);
        res.render("404page");
    }
};


const orders = async (req, res) => {
    try {

        const order = await Orders.find({}).sort({ createdAt: -1 }).populate("user").populate('products.product')
        res.render("ordersList", { order })
    } catch (err) {
        console.log(err);
        if (err) {
            res.render("404page")
        }
    }
}



const orderDetail = async (req, res) => {
    try {
        const orderId = req.query.id;
        const order = await Orders.findById(orderId).populate("user").populate("products.product").populate("address")
        console.log(order, "❤️❤️");

        res.render("orderDetails", { order })
    } catch (err) {
        console.log(err);
        if (err) {
            res.render("404page")
        }
    }
}


const cancelOrder = async (req, res) => {
    try {

        const orderId = req.query.id;
        const findOrder = await Orders.findByIdAndUpdate(orderId, {
            $set: {
                status: "Cancelled"
            }
        })
        res.redirect("/admin/orders");
    } catch (err) {
        console.log(err);
        res.render("404page")
    }
}



const orderPending = async (req, res) => {
    try {

        const orderId = req.query.id;

        const findOrder = await Orders.findByIdAndUpdate(orderId, {
            $set: {
                status: "Pending"
            }
        })
        res.redirect("/admin/orders");
    } catch (err) {
        console.log(err);
        res.render("404page")
    }
}

const orderDelivered = async (req, res) => {
    try {

        const orderId = req.query.id;

        const findOrder = await Orders.findByIdAndUpdate(orderId, {
            $set: {
                status: "Delivered"
            }
        })
        res.redirect("/admin/orders");
    } catch (err) {
        console.log(err);
        res.render("404page")
    }
}

const orderConfirm = async (req, res) => {
    try {
        const orderId = req.query.id;
        const findOrder = await Orders.findByIdAndUpdate(orderId, {
            $set: {
                status: "Shipped"
            }
        })
        res.redirect("/admin/orders");
    } catch (err) {
        console.log(err);
        res.render("404page")
    }
}



const salesReport = async(req,res)=>{
    try{

        const orders = await Orders.find({ status: "Delivered" }).sort({ createdAt: -1 }).populate("user").populate("products.product").populate("address")
        console.log(orders,"💕💕💕");
        res.render("salesReport",{orders})
    }
    catch(err){
        console.log(err);
        res.render("404page")
    }
}   

const showSales = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        console.log({ startDate, endDate });
        
        // Adjust the end date to capture orders for the entire day
        const adjustedEndDate = new Date(endDate);
        adjustedEndDate.setHours(23, 59, 59, 999); // Set to the end of the day

        const filterDate = await Orders.find({
            createdAt: { $gte: new Date(startDate), $lte: adjustedEndDate },
            status: "Delivered" 
        }).populate("user")
            res.json(filterDate) 
          
        
        // Rest of your code to handle filtered orders
        

    } catch (err) {
        console.log(err);
        res.render("404page");
    }
};


const pdfDownload = async (req, res) => {
    const { tableHeaders, tableData, heading } = req.body;

    try {
        const doc = new PDFDocument();
        // Pipe the PDF content to the response
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${heading}.pdf"`); // Set the filename dynamically

        doc.pipe(res);

        // Add heading to the PDF
        doc.fontSize(10).text(heading, { align: 'center' }).moveDown();

        const tableTop = 200; // Y-coordinate to start the table
        const rowHeight = 40; // Height of each row
        const colWidth = 80; // Width of each column

        // Draw table headers with borders
        doc.font('Helvetica-Bold');
        tableHeaders.forEach((header, i) => {
            doc.rect(100 + colWidth * i, tableTop, colWidth, rowHeight).stroke();
            doc.text(header, 100 + colWidth * i + 10, tableTop + 10); // Adjust text positioning
        });

        // Draw table data with borders
        doc.font('Helvetica');
        tableData.forEach((row, i) => {
            Object.values(row).forEach((value, j) => {
                doc.rect(100 + colWidth * j, tableTop + rowHeight * (i + 1), colWidth, rowHeight).stroke();
                doc.text(value, 95 + colWidth * j + 10, tableTop + rowHeight * (i + 1) + 10); // Adjust text positioning
            });
        });

        doc.end();
    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
};


const updateCategoryOffer = async (req, res) => {
    try {
        const enteredValue = req.body.offerValue;
        const id = req.body.id;

        const category = await Category.findById(id);
        const name = category.name;
        let products = await Products.find();

        for (const product of products) {
            const trimmedProductCategory = product.category.trim();
            const trimmedName = name.trim();

            if (trimmedProductCategory === trimmedName) {
                console.log(product.price, "😂😂");

                const originalPrice = product.price;
                const value = (originalPrice * enteredValue) / 100;
                const result = originalPrice - value;

                const productId = product.id;
                const update = await Products.findByIdAndUpdate(
                    productId,
                    { $set: { offerPrice: result } },
                    { new: true }
                );
            }
        }

        res.status(200).json({ message: 'Category offer updated successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while calculating the category offer' });
    }
};

const generateExcel = async (req, res) => {
    const { tableHeaders, tableData, heading } = req.body;

    try {
        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet('Sheet 1');

        worksheet.addRow([heading]); // Adding heading to the Excel file

        worksheet.addRow([]); // Blank row

        worksheet.addRow(tableHeaders); // Adding table headers

        tableData.forEach(row => {
            const values = tableHeaders.map(header => row[header]);
            worksheet.addRow(values); // Adding table data rows
        });
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${heading}.xlsx"`); // Set the filename dynamically

        await workbook.xlsx.write(res); // Send the workbook as response
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

const removeImage = async (req, res) => {
    try {
        const productId = req.query.productId;
        const imageIndex = req.query.imageIndex; // Index of the image to remove
        console.log("💕💕💕💕💕💕💕💕💕💕");
        // Fetch the product by its ID
        const product = await Products.findById(productId);

        if (!product) {
            return res.status(404).send('Product not found');
        }

        // Remove the image at the specified index from the 'images' array
        if (product.images && product.images[imageIndex]) {
            const removedImage = product.images.splice(imageIndex, 1)[0];

            // Save the changes to the product after removing the image
            await product.save();
            res.redirect("/admin/editProduct?id="+productId)
        } else {
            res.status(404).send('Image not found');
        }
    } catch (err) {
        console.log("😊😊😊😊😊😊😊");
        console.error(err);
        res.render("404page");
    }
}
const changeimage = async (req, res) => {
    try {
        const productId = req.query.productId;
        const imageIndex = req.query.imageIndex;
        const file = req.file; // Access the uploaded file using req.file

        const product = await Products.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Update the image at the specified index
        if (product.images && product.images[imageIndex]) {
            const uploadedPath = "/product/" + file.filename; // Assuming 'filename' contains the uploaded file's name

            // If the array index exists and the value is a string (path), update it
            if (Array.isArray(product.images) && typeof product.images[imageIndex] === 'string') {
                product.images[imageIndex] = uploadedPath;
            } else {
                // If it's an array but not in the expected format, replace the entire index
                product.images[imageIndex] = [uploadedPath];
            }

            // Save the updated product
            await product.save();
            req.session.images = null

            res.status(200).json({ message: 'Image changed successfully' });
        } else {
            res.status(404).json({ message: 'Image not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error changing image' });
    }
};



const changeCoverImage = async (req, res) => {
    try {
        const productId = req.query.productId;
        const file = req.file; // Access the uploaded file using req.file
        const product = await Products.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (file) {
            const uploadedCoverImagePath = "/product/" + file.filename; // Assuming 'filename' contains the uploaded file's name

            // Update the cover image path
            product.coverimage = uploadedCoverImagePath;

            // Save the updated product
            await product.save();
            req.session.images = null

            res.status(200).json({ message: 'Cover image changed successfully', newCoverImagePath: uploadedCoverImagePath });
        } else {
            res.status(400).json({ message: 'No file uploaded for cover image' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error changing cover image' });
    }
};



module.exports = {
    loadLogin,
    loadMainPage,
    logoutAdmin,
    verifyAdmin,
    usersList,
    block,
    unBlock,
    categories,
    addCategory,
    blockCategory,
    unBlockCategory,
    editCategory,
    updatCategory,
    deleteCategory,
    productList,
    loadCreateingProduct,
    createProduct,
    blockProduct,
    unblockproduct,
    editProduct,
    updateProduct,
    deletProduct,
    orders,
    orderDetail,
    cancelOrder,
    orderPending,
    orderDelivered,
    orderConfirm,
    salesReport,
    showSales,
    pdfDownload,
    updateCategoryOffer,
    generateExcel,
    removeImage,
    changeimage,
    changeCoverImage
}