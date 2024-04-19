// const couponModel = require("../model/couponModel");

// const createCoupon = async (req, res) => {
//     try {
//         const { code, discountAmount, expiryDate } = req.body;

//         // Check if the coupon code already exists
//         const existingCoupon = await couponModel.findOne({ code });

//         if (existingCoupon) {
//             return res.status(400).json({ success: false, message: 'Coupon code already exists' });
//         }

//         const currentDate = new Date();
//         const couponExpiryDate = new Date(expiryDate);

//         if (currentDate > couponExpiryDate) {
//             return res.status(400).json({ success: false, message: 'Coupon has already expired' });
//         }

//         const newCoupon = new couponModel({
//             code,
//             discountAmount,
//             expiryDate
//         });

//         const savedCoupon = await newCoupon.save();

//         res.status(200).send({ success: true, coupon: savedCoupon });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };






// // Create a route for applying a coupon
// const applyCoupon= async (req, res) => {
//     try {
//       const { couponCode, orderAmount } = req.body;
  
//       // Check if the coupon code exists
//       const coupon = await couponModel.findOne({ code: couponCode });
  
//       if (!coupon) {
//         return res.status(400).json({ success: false, message: 'Invalid coupon code' });
//       }
  
//       // Check if the coupon is still valid
//       const currentDate = new Date();
//       if (currentDate > coupon.expiryDate) {
//         return res.status(400).json({ success: false, message: 'Coupon has expired' });
//       }
  
//       // Apply the discount to the order amount
//       const discountedAmount = orderAmount - coupon.discountAmount;
  
//       res.status(200).json({ success: true, discountedAmount });
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   }



//   const deleteCoupon =async(req,res)=>{
//     const {id}=req.params;
//     try {
//         const coupon=await couponModel.findById(id);
//         if(!coupon){
//             return res.status(400).send({success:false,error:"No Such Coupon.."})
//         }
//         await couponModel.findByIdAndDelete(id);
//         res.status(200).send({success:true,deleted:coupon})
//     } catch (error) {
//         console.log(error);
//         res.status(500).send({success:false,error:error})
//     }
//   }





// const allCoupon=async(req,res)=>{
//   try {
//     const coupons=await couponModel.find();
//     // console.log(coupons);
//     if(coupons.length<1){
//       return res.status(400).send({success:false,error:"No Coupons in Database"})
//     }

//     res.status(200).send({success:true,coupons:coupons})
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({success:false,error});
//   }
// }



// module.exports = { createCoupon,applyCoupon ,deleteCoupon,allCoupon};






const couponModel = require("../model/couponModel");

const createCoupon = async (req, res) => {
    try {
        const { code, discountAmount, expiryDate, active = true } = req.body;

        // Check if the coupon code already exists
        const existingCoupon = await couponModel.findOne({ code });

        if (existingCoupon) {
            return res.status(400).json({ success: false, message: 'Coupon code already exists' });
        }

        const currentDate = new Date();
        const couponExpiryDate = new Date(expiryDate);

        if (currentDate > couponExpiryDate) {
            return res.status(400).json({ success: false, message: 'Coupon has already expired' });
        }

        const newCoupon = new couponModel({
            code,
            discountAmount,
            expiryDate,
            active // Set the active status based on the provided value
        });

        const savedCoupon = await newCoupon.save();

        res.status(200).send({ success: true, coupon: savedCoupon });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// const applyCoupon = async (req, res) => {
//     try {
//         const { couponCode, orderAmount } = req.body;

//         // Check if the coupon code exists
//         const coupon = await couponModel.findOne({ code: couponCode });

//         if (!coupon) {
//             return res.status(400).json({ success: false, message: 'Invalid coupon code' });
//         }

//         // Check if the coupon is still valid and active
//         const currentDate = new Date();
//         if (currentDate > coupon.expiryDate || !coupon.active) {
//             return res.status(400).json({ success: false, message: 'Coupon is not valid' });
//         }

//         // Apply the discount to the order amount
//         const discountedAmount = orderAmount - coupon.discountAmount;

//         res.status(200).json({ success: true, discountedAmount });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };


const applyCoupon = async (req, res) => {
    try {
        const { couponCode, orderAmount } = req.body;

        // Check if the coupon code exists
        const coupon = await couponModel.findOne({ code: couponCode });

        if (!coupon) {
            return res.status(400).json({ success: false, error: 'Invalid coupon code' });
        }

        // Check if the coupon is still valid and active
        const currentDate = new Date();
        if (currentDate > coupon.expiryDate || !coupon.active) {
            return res.status(400).json({ success: false, error: 'Coupon is not valid' });
        }

        // Apply the discount to the order amount
        const discountedAmount = orderAmount - coupon.discountAmount;

        res.status(200).json({ success: true, discountedAmount, discount: coupon.discountAmount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




const deleteCoupon = async (req, res) => {
    const { id } = req.params;
    try {
        const coupon = await couponModel.findById(id);
        if (!coupon) {
            return res.status(400).send({ success: false, error: "No Such Coupon.." })
        }
        await couponModel.findByIdAndDelete(id);
        res.status(200).send({ success: true, deleted: coupon })
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, error: error })
    }
}

const allCoupon = async (req, res) => {
    try {
        const coupons = await couponModel.find();
        if (coupons.length < 1) {
            return res.status(400).send({ success: false, error: "No Coupons in Database" })
        }

        res.status(200).send({ success: true, coupons: coupons })
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, error });
    }
}

module.exports = { createCoupon, applyCoupon, deleteCoupon, allCoupon };
