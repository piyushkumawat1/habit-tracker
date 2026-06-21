import Razorpay from 'razorpay';
try {
  const razorpay = new Razorpay({
    key_id: "",
    key_secret: "xOZLrtHMMLzagzGoxzJ8SnwR"
  });
  const order = await razorpay.orders.create({ amount: 100, currency: 'INR', receipt: 'r' });
  console.log("Success");
} catch (error) {
  console.error("Error:", error);
}
