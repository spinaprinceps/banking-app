const express = require("express");
const cors = require("cors");
const dotenv =require("dotenv")
const connectDB = require("./config/db");
dotenv.config(); 




connectDB();

const app = express();
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:5173','*' // Local development
     // Replace with your frontend URL for production
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Public routes
const authRoutes = require("./Routes/auth");
app.use("/auth", authRoutes);

const balance=require("./routes/balance");
app.use("/auth/balance",balance);

const sendmoney = require("./routes/payment");
app.use("/auth/payment", sendmoney);

const transaction=require("./routes/transaction");
app.use("/auth/transaction",transaction);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));