const stripe = require('stripe')(process.env.STRIPE_SECRET);

exports.sendStripeKey = (req, res) => {
    try {
        res.status(200).json({
            stripekey: process.env.STRIPE_API_KEY,
        });
    } catch (error) {
        res.status(500).json({
            succss: false,
            message: error.message
        });
    }
}

exports.captureStripePayment = async (req, res) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: req.body.amount,
            currency: "inr",

            //optional
            metadata: {
                integration_check: "accept_a_payment"
            },
        });

        res.status(200).json({
            success: true,
            amount: req.body.amount,
            client_secret: paymentIntent.client_secret,
            //you can optionally send id as well
        });
    } catch (error) {
        res.status(403).json({
            success: false,
            message: error.message
        })
    }
}