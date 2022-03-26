const mongoose = require('mongoose')
const { MONGO_URI } = process.env

exports.connect = async () => {
    try {
        const response = await mongoose.connect(
            'mongodb+srv://admin:admin@cluster0.o0dac.mongodb.net/learn?retryWrites=true&w=majority',
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        )

        console.log('MongoDB connected')
    } catch (error) {
        console.log('error while connect to MongoDB', error)
        process.exit(1)
    }
}
