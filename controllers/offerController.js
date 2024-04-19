const offerModel = require("../model/offerModel");

const createOffer = async (req, res) => {
    try {
        const { offerImg } = req.body;

        // Check if the coupon code already exists
        const existingOffer = await offerModel.findOne({ offerImg });

        if (existingOffer) {
            return res.status(400).json({ success: false, message: 'Offer Already Exists' });
        }

        // const currentDate = new Date();
        // const couponExpiryDate = new Date(expiryDate);

        // if (currentDate > couponExpiryDate) {
        //     return res.status(400).json({ success: false, message: 'Coupon has already expired' });
        // }

        const newOffer = new offerModel({
          offerImg
        });

        const savedOffer = await newOffer.save();

        res.status(200).send({ success: true, offer: savedOffer });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const deleteOffer = async (req, res) => {
    const { id } = req.params;
    try {
        const offer = await offerModel.findById(id);
        if (!offer) {
            return res.status(400).send({ success: false, error: "No Such Offer" })
        }
        await offerModel.findByIdAndDelete(id);
        res.status(200).send({ success: true, deleted: offer })
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, error: error })
    }
}

const allOffer = async (req, res) => {
    try {
        const offers = await offerModel.find();
        if (offers.length < 1) {
            return res.status(400).send({ success: false, error: "No Offers in Database" })
        }

        res.status(200).send({ success: true, offers: offers})
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, error });
    }
}


module.exports ={
    createOffer,
    allOffer,
    deleteOffer
}