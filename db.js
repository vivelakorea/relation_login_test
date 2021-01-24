const mongoose = require('mongoose');

const connect = () => {
  mongoose.connect(
    process.env.MONGO_URL,
    {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    },
  );

  const db = mongoose.connection;

  const handleOpen = () => console.log('✅ Connected to DB');
  const handleError = (error) => {
    console.log(`❌ Error on DB Connection:${error}`);
    connect();
  };

  db.once('open', handleOpen);
  db.on('error', handleError);
};

connect();
