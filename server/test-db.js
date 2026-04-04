import mongoose from 'mongoose';

const uri = "mongodb+srv://RawThread:RawRaw123@cluster0.nbdz8qr.mongodb.net/rawthread?appName=Cluster0";

mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log("Connected successfully!");
    process.exit(0);
  })
  .catch(err => {
    console.error("Connection error:", err.message);
    process.exit(1);
  });
