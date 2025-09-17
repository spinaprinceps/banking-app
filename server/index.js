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

const balance=require("./Routes/balance");
app.use("/auth/balance",balance);

const sendmoney = require("./Routes/payment");
app.use("/auth/payment", sendmoney);

const user_identity = require("./Routes/identity");
app.use("/auth", user_identity);

const transaction=require("./Routes/trans");
app.use("/auth/transaction",transaction);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));