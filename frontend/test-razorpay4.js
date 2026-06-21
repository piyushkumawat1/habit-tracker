import Razorpay from 'razorpay';
try {
  const razorpay = new Razorpay({
    key_id: "rzp_test_T3rnFrBpFQLyII",
    key_secret: ""
  });
  const order = await razorpay.orders.create({ amount: 100, currency: 'INR', receipt: 'r' });
  console.log("Success");
} catch (error) {
  console.error("Error:", error);
}
